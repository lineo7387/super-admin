# API Adapters

The default data flow is:

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

This keeps pages free from transport details and keeps server/cache state in TanStack Query instead of Pinia.

## Files

```text
apps/admin/src/api/
  users.api.ts
  dashboard.api.ts
  workbench.api.ts
  access.api.ts
  mock/
    users.mock.ts
    dashboard.mock.ts
    workbench.mock.ts
    access.mock.ts

apps/admin/src/modules/users/
  users.queries.ts
  users.types.ts
```

## Adapter-Only Replacement

When an example screen already fits your business workflow, replace the module API adapter with your own API call and normalize the response into the module frontend type.

```ts
export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const response = await fetch('/api/users')
  const rows = await response.json()

  return {
    items: rows.map(normalizeUser),
    total: rows.length,
    page: params.page,
    pageSize: params.pageSize
  }
}
```

The exact transport is your choice. REST, RPC, GraphQL, or a custom SDK can all sit behind the adapter as long as pages keep calling module queries.

Super Admin is designed for open-source, partial adoption. You can use only the UI primitives, copy one example module, or replace every API adapter without adopting future backend, CLI, auth, database, or provider work.

## Full Module Reshape

If your business workflow is different, do not force your API into the example shape. Reshape these together:

- page and module components
- module types
- query params
- query composables
- API adapter

Example module types are frontend example contracts, not universal backend schemas.

## Contract Helpers

`@super-admin/core` exposes small TypeScript-first contract helpers for common adapter shapes:

- `createPageListResult` for page-based admin tables
- `createCursorListResult` for stream-like lists
- `createMutationSuccess` and `createMutationFailure` for structured mutation feedback
- `normalizeAdapterError` for small UI-facing error payloads

These helpers are optional. They do not add a runtime schema library and they do not require your backend to match the example modules.

## Mock Data

Mock data belongs in `apps/admin/src/api/mock/`. Mock files can use simulated API field names. API adapters adapt those shapes into module frontend types.

Do not make `api/mock` import module types. That separation keeps mock data feeling like an external source and keeps the adapter boundary honest.
