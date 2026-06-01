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
