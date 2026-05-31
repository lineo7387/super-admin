# Data and Query Guidelines

## TanStack Query

Use TanStack Query for server/cache state:

- List and detail queries.
- Mutations.
- Loading, error, empty states.
- Cache invalidation.
- Background refetch when intentionally enabled.

Feature pages should call module query composables, not API adapters or transport directly.

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

## Query Keys

Use stable, serializable keys:

```ts
['users', 'list', params]
['users', 'detail', id]
```

Normalize params before passing them into query keys when order or defaults could vary.

## API Adapters

Query composables call API adapter functions such as `listUsers(params)`.

The API adapter is the replacement point when the module's page semantics still fit. It should normalize `api/mock` or user API responses into the module's frontend types. If the user's business screen is different, reshape the module page/components, types, query params, and API adapter together instead of forcing the API into the example shape.

## Anti-Patterns

- Calling `fetch`, Axios, Alova, Hono clients, or backend SDKs directly in Vue components.
- Duplicating server cache in Pinia.
- Making one global data-provider DSL mandatory for all modules.
- Treating example module types as a universal backend API contract.
