# Data and Query Guidelines

## TanStack Query

Use TanStack Query for server/cache state:

- List and detail queries.
- Mutations.
- Loading, error, empty states.
- Cache invalidation.
- Background refetch when intentionally enabled.

Feature pages should call module query composables, not services or transport directly.

```text
Page -> module query composable -> module service -> mock data or user API
```

## Query Keys

Use stable, serializable keys:

```ts
['users', 'list', params]
['users', 'detail', id]
```

Normalize params before passing them into query keys when order or defaults could vary.

## Module Services

Query composables call module services such as `usersService.list(params)`.

The service is the user replacement point for real APIs.

## Anti-Patterns

- Calling `fetch`, Axios, Alova, Hono clients, or backend SDKs directly in Vue components.
- Duplicating server cache in Pinia.
- Making one global data-provider DSL mandatory for all modules.

