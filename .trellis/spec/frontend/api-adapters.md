# API Adapter Guidelines

## Purpose

API adapters keep data access localized without introducing a separate service layer. Users should be able to start from copyable module examples, then reshape the module page, types, components, query params, and API adapter to match their real business domain.

When the page semantics stay the same and only the data source changes, replacing mock data can be as small as editing one API adapter file. When the business workflow or UI shape changes, update the module's types, page/components, queries, and API adapter together.

For shared contract vocabulary such as list results, pagination, mutation results, field errors, adapter errors, and capability states, read [api-contracts.md](./api-contracts.md). Those contracts are optional frontend interoperability helpers, not a requirement to adopt the full Super Admin stack.

## Pattern

Each data-backed module should define:

```text
api/
  <module>.api.ts
  mock/<module>.mock.ts

modules/<module>/
  <module>.types.ts
  <module>.queries.ts
```

Example:

```ts
export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const rows = mockUsers

  return {
    items: rows.map(normalizeUser),
    total: rows.length
  }
}
```

`api/users.api.ts` may call `api/mock/users.mock.ts` by default. Mock files may use their own simulated API field names and structures. API adapters normalize that mock/API shape into the module's frontend types. Users can replace those calls with their own API calls, or reshape the whole module when their business screen is different.

## Rules

- Keep API adapter functions small and specific to the module.
- Keep mock data in `apps/admin/src/api/mock/` so it reads as a simulated API source, not page-local business code.
- Do not make `api/mock` import module types. Mock data is allowed to have its own shape; API adapters adapt it.
- Do not force every module into a generic CRUD interface.
- Do not require universal filter operator types.
- Do not require users to adopt Super Admin backend, CLI, auth, provider, or module conventions.
- Use page pagination for ordinary CRUD modules.
- Use cursor pagination only for stream-like modules such as logs/events/jobs.
- Keep comments clear about scope: "If this screen fits your business, connect your backend here; if not, reshape the module page, types, and API adapter together."
- Treat module types as frontend example contracts, not as a required API schema for user systems.

## Mock Data

- Keep mock datasets small and realistic.
- Include enough rows to show table, empty/loading/error, and detail states.
- Do not make mock data feel like a production backend.
- If changing mock field names or data structure, update the API adapter normalizer and relevant adapter tests.

## Scenario: Optional Reference Backend Adapter Switch

### 1. Scope / Trigger

- Trigger: a frontend module can be locally pointed at the optional reference backend while default scaffold behavior remains mock-backed.
- Scope: module API adapters under `apps/admin/src/api/*.api.ts`, optional reference helpers under `apps/admin/src/api/reference/`, and Vite env declarations in `apps/admin/src/env.d.ts`.
- Boundary: this is a maintainer validation path and an example integration path. Do not import `@super-admin/api` or Hono types into `apps/admin`.

### 2. Signatures

For the users module:

```ts
listUsers(params: UserListParams): Promise<UserListResult>
normalizeReferenceUsersResponse(response: ReferenceUsersResponse, params: UserListParams): UserListResult
```

For reference-mode token resolution:

```ts
useAuthSessionStore().session?.token
VITE_SUPER_ADMIN_REFERENCE_TOKEN
```

For optional reference auth:

```ts
loginReferenceSession(input: ReferenceLoginInput, config: ReferenceAuthApiConfig): Promise<ReferenceSessionPayload>
```

### 3. Contracts

Default behavior:

- If `VITE_SUPER_ADMIN_USERS_API` is unset or `mock`, `listUsers()` must use `apps/admin/src/api/mock/users.mock.ts`.
- Mock scenarios such as `loading`, `empty`, and `error` apply only in mock mode.

Reference behavior:

```text
VITE_SUPER_ADMIN_USERS_API=reference
VITE_SUPER_ADMIN_API_BASE_URL=http://localhost:8787
VITE_SUPER_ADMIN_REFERENCE_TOKEN=reference-admin-token
```

- In reference mode, `listUsers()` calls `GET <baseUrl>/users`.
- Send `Authorization: Bearer <token>`, where `<token>` is the runtime login token from `auth-session.store` when present, otherwise `VITE_SUPER_ADMIN_REFERENCE_TOKEN`.
- The env token is a maintainer validation fallback; a browser login session should take precedence so `/auth/login` and `/users` validate the same bearer-session path.
- Normalize the backend `data` payload into the module's `UserListResult`.
- Keep backend error bodies inside the adapter and throw a normal `Error` with a useful message.

### 4. Validation & Error Matrix

| Condition | Correct behavior |
| --- | --- |
| Env mode absent or `mock` | Use mock adapter path. |
| Env mode `reference` with runtime login session | Use the runtime session token for `Authorization`. |
| Env mode `reference` without runtime session but with env token | Use `VITE_SUPER_ADMIN_REFERENCE_TOKEN` as the fallback `Authorization` token. |
| Env mode `reference` without base URL or any token | Throw a configuration error from the adapter. |
| Reference backend returns success | Normalize `data.items`, `total`, `page`, and `pageSize`. |
| Reference backend returns `{ error: { message } }` | Throw `Error(message)`. |
| Reference backend returns non-JSON error | Throw a status-based fallback error. |

### 5. Good/Base/Bad Cases

- Good: `users.api.ts` owns the mode switch and still exposes only `listUsers(params)`.
- Base: optional reference helpers under `api/reference/` may model backend response shapes because they are adapter-local.
- Bad: Vue pages import `fetch`, `@super-admin/api`, or backend response types directly.

### 6. Tests Required

- Assert the default mock path remains unchanged.
- Assert reference mode calls the expected URL and Authorization header.
- Assert the runtime login session token takes precedence over `VITE_SUPER_ADMIN_REFERENCE_TOKEN`.
- Assert backend success payloads normalize to module result types.
- Assert backend error payloads throw normal errors.
- Assert optional auth helper posts to `/auth/login` and returns the reference session payload.

### 7. Wrong vs Correct

#### Wrong

```ts
// UsersAllPage.vue
const response = await fetch('http://localhost:8787/users')
```

This bypasses query composables and makes the page depend on one backend.

#### Correct

```ts
// users.api.ts
export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const referenceConfig = readReferenceUsersApiConfig()

  if (referenceConfig) {
    return listReferenceUsers(params, referenceConfig)
  }

  return listMockUsers(params)
}
```

The page still calls the query composable, and the adapter owns the transport switch.
