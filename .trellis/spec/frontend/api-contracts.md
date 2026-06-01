# API Contract Guidelines

## Purpose

API contracts describe the small frontend-facing vocabulary that API adapters normalize into. They are not a backend framework, transport protocol, CLI scaffold, schema generator, or required platform agreement.

The open-source default must stay flexible enough for users who:

- only adopt the UI kit or selected primitives
- copy one example module and reshape it
- connect REST, RPC, GraphQL, SDK, or custom APIs
- ignore future optional backend, CLI, auth, database, or AI provider work

Use contracts to make examples consistent and future reference integrations verifiable. Do not use them to make Super Admin a mandatory full-stack platform.

## Data Flow Boundary

Keep the existing flow:

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

Pages call module query composables. Query composables call API adapters. API adapters normalize mock data or user API responses into frontend module types.

## Contract Vocabulary

Use these concepts consistently when they fit the module. They are vocabulary, not a generic CRUD DSL.

- `ListResult<T>`: `{ items, total }` for simple list counts.
- `PageListResult<T>`: `{ items, total, page, pageSize }` for ordinary admin tables.
- `CursorListResult<T>`: `{ items, hasMore, nextCursor? }` for stream-like lists such as logs, events, or jobs.
- `SortParam<Field>`: `{ field, direction }` when a module actually supports sorting.
- `FieldErrors<Field>`: field-keyed validation messages for forms.
- `MutationResult<Result, Field>`: discriminated success/failure result for mutations that need structured UI feedback.
- `AdapterErrorPayload`: small normalized error payload for shared UI helpers when thrown errors are not enough.
- `CapabilityState`: frontend metadata for available, not-configured, and unavailable integrations.

Shared definitions live in `packages/core/src/api-contracts.ts`.

## Rules

- Keep runtime schema libraries optional in the default scaffold.
- Do not add Zod, Valibot, OpenAPI, backend SDK, database, auth, AI, or CLI requirements to frontend examples.
- Do not require real user APIs to match example module types.
- Do not make every module implement the same list/filter/sort/mutation surface.
- Do not introduce universal filter operator types unless a real module needs them.
- Use page pagination for normal tables.
- Use cursor pagination only for stream-like modules.
- Keep `api/mock` free from module type imports.
- Keep shared helpers small and dependency-light.

## Runtime Validation

Use TypeScript-first contracts by default. Add runtime validation only at untrusted boundaries where it pays for itself:

- user-provided config
- CLI input once CLI work exists
- optional example API responses
- local storage parsing

If a later task needs a TypeScript reference backend, OpenAPI generation, or schema-driven validation examples, prefer evaluating Zod first. If a client-only runtime validation slice is bundle-sensitive, evaluate Valibot for that slice. If validator-pluggability matters, design around Standard Schema-compatible extension points instead of library-specific helper APIs.

## Adapter Guidance

An adapter may use shared helpers when they clarify intent:

```ts
export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const rows = await loadRows()
  const users = rows.map(normalizeUser)

  return createPageListResult(users, users.length, params)
}
```

This helper is optional. If a module has a domain-specific result shape, keep that shape. The contract should make the boundary easier to understand, not harder to adapt.

## Scenario: Frontend API Contract Helpers

### 1. Scope / Trigger

- Trigger: adding or changing frontend-facing API adapter result shapes, mutation feedback, adapter error normalization, or provider/capability metadata.
- Scope: `packages/core/src/api-contracts.ts`, module types under `apps/admin/src/modules/*`, API adapters under `apps/admin/src/api/*`, and docs that explain adapter replacement.
- Boundary: these helpers normalize the frontend adapter surface only. They do not define the user's backend API.

### 2. Signatures

```ts
export type PagePaginationParams = {
  page: number
  pageSize: number
}

export type ListResult<Item> = {
  items: Item[]
  total: number
}

export type PageListResult<Item> = ListResult<Item> & PagePaginationParams

export type CursorPaginationParams = {
  cursor?: string
  limit: number
}

export type CursorListResult<Item> = {
  items: Item[]
  nextCursor?: string
  hasMore: boolean
}

export type SortParam<Field extends string = string> = {
  field: Field
  direction: 'asc' | 'desc'
}

export type FieldErrors<Field extends string = string> = Partial<Record<Field, string>>

export type MutationResult<Result = undefined, Field extends string = string> =
  | { ok: true; message?: string; data?: Result }
  | { ok: false; message: string; fieldErrors?: FieldErrors<Field> }

export type AdapterErrorPayload = {
  code: 'unknown' | 'network' | 'unauthorized' | 'forbidden' | 'not-found' | 'validation'
  message: string
  status?: number
}
```

### 3. Contracts

- `items`: frontend module records after adapter normalization.
- `total`: total count for the filtered list when the source can provide or derive it.
- `page` and `pageSize`: one-based page pagination for ordinary admin tables.
- `cursor`, `nextCursor`, and `hasMore`: cursor pagination for streams only.
- `field`: module-specific sort field, not a global enum.
- `direction`: `asc` or `desc`.
- `fieldErrors`: keyed by the module form/input field names that the UI can render.
- `ok`: mutation discriminator. Check it before reading success data or failure errors.
- `code`: small UI-facing adapter error category. Keep backend-specific error bodies inside the adapter.
- `CapabilityState`: use `available`, `not-configured`, or `unavailable` for provider/integration surfaces.

### 4. Validation & Error Matrix

| Condition | Correct behavior |
| --- | --- |
| User API returns a different response shape | Normalize it in the module API adapter. |
| User API cannot provide exact `total` | Use a module-specific result shape or cursor contract instead of faking precision. |
| Module has no sorting | Omit `SortParam`; do not add placeholder params. |
| Mutation has field-specific validation errors | Return `ok: false` with `fieldErrors`. |
| Adapter receives an unknown thrown value | Use `normalizeAdapterError` only when a small UI payload is needed. |
| Provider is optional or absent | Represent it as capability metadata; do not require provider setup. |
| Runtime schemas are desired | Add them at the untrusted boundary in a later task; keep default helpers schema-free. |

### 5. Good/Base/Bad Cases

- Good: a Users table keeps `PageListResult<UserRecord>` and normalizes a backend response inside `users.api.ts`.
- Base: a Dashboard overview keeps its own aggregate result type because it is not a list.
- Bad: every module is forced into `CrudListParams<TFilter, TSort>` before the domain needs it.

### 6. Tests Required

- Add unit tests for any new helper in `packages/core/src/*.test.ts`.
- When an adapter uses a helper, keep or add adapter tests that assert the module result shape.
- When field errors or mutation results are introduced, assert both success and failure discriminator branches.
- When docs change, run `pnpm docs:build`.

### 7. Wrong vs Correct

#### Wrong

```ts
export async function listUsers(): Promise<BackendUsersResponse> {
  return fetch('/api/users').then((response) => response.json())
}
```

This leaks the backend payload into the frontend module and makes the page depend on a specific transport shape.

#### Correct

```ts
export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const response = await fetch('/api/users')
  const rows: BackendUser[] = await response.json()
  const users = rows.map(normalizeUser)

  return createPageListResult(users, users.length, params)
}
```

The adapter owns transport and payload normalization. The page still sees the module's frontend contract.
