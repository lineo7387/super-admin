# Data Integration Contract

## Purpose

Keep backend integration simple for template users. The generated project should not ask users to learn a large generic data-provider framework before they can connect their own API.

## Revised Direction

Use module-level data services and composables as the primary integration point.

Instead of exposing a broad generic contract like:

```ts
dataProvider.list('users', filters, sort, meta)
```

Prefer a shape users can understand immediately:

```ts
listUsers(params)
getUser(id)
updateUser(id, input)
```

Each module owns its own small data service. Users replace or edit that file to connect their real backend.

## Core Principles

- Default generated projects use small local mock datasets.
- Feature pages do not call transport code directly.
- Feature pages call module composables, such as `useUsersQuery()`.
- Module composables call module services, such as `usersService.list()`.
- Users integrate real APIs by replacing module service functions.
- Avoid forcing a universal resource/filter/operator/action DSL on users.
- Keep advanced/reference adapters internal or optional, not part of the default mental model.

## Recommended Flow

```text
page -> module composable -> module service -> mock data or user API
```

Example:

```text
UsersPage.vue -> useUsersQuery(params) -> usersService.list(params)
```

## Example Module Service

```ts
export type UserListParams = {
  page: number
  pageSize: number
  keyword?: string
  status?: 'active' | 'disabled'
}

export type UserListResult = {
  items: User[]
  total: number
}

export type UsersService = {
  list(params: UserListParams): Promise<UserListResult>
  get(id: string): Promise<User>
  update(id: string, input: UpdateUserInput): Promise<User>
}
```

Mock implementation:

```ts
export const usersService: UsersService = {
  async list(params) {
    return listMockUsers(params)
  },
  async get(id) {
    return getMockUser(id)
  },
  async update(id, input) {
    return updateMockUser(id, input)
  },
}
```

User replacement:

```ts
export const usersService: UsersService = {
  async list(params) {
    const response = await fetch('/api/users?' + new URLSearchParams({
      page: String(params.page),
      size: String(params.pageSize),
      q: params.keyword ?? '',
    }))

    const result = await response.json()

    return {
      items: result.data,
      total: result.total,
    }
  },
  async get(id) {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  },
  async update(id, input) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
    return response.json()
  },
}
```

This is easier to explain than a universal adapter: "replace this module service with your API calls."

## Pagination Guidance

Keep the concept, simplify the API:

- Normal CRUD tables use page pagination: `page`, `pageSize`, `total`.
- Logs, events, notifications, and job streams can use cursor pagination in their own module service types.

Example for logs:

```ts
export type AuditLogListParams = {
  cursor?: string
  limit: number
}

export type AuditLogListResult = {
  items: AuditLog[]
  nextCursor?: string
  hasMore: boolean
}
```

Do not force every module to support both pagination styles.

## Query Hooks

TanStack Query should still own server-state caching, but query hooks should be module-specific:

```ts
export function useUsersQuery(params: MaybeRef<UserListParams>) {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => usersService.list(toValue(params)),
  })
}
```

This gives the template consistent caching without making users interact with a generic provider layer.

## Provider Mode

Provider mode can still exist for maintainers and examples:

```ts
type ProviderMode = 'mock' | 'reference'
```

Default generated projects use `mock`.

Maintainers can switch to `reference` to validate Hono/Prisma/Better Auth examples, but this should not be the primary user-facing concept.

## Error Handling

Keep this simple:

- Module services may throw normal errors.
- Shared helpers can normalize errors for UI display.
- Do not require users to construct a custom `ProviderError` class for basic integration.

Optional helper:

```ts
throw createAppError({
  code: 'VALIDATION_ERROR',
  message: 'Invalid user input',
})
```

But plain thrown errors should still be supported.

## CLI Implication

The CLI should generate module files that are easy to replace:

```text
modules/users/
  users.types.ts
  users.mock.ts
  users.service.ts
  users.queries.ts
  UsersPage.vue
```

The comments should say:

> To connect your backend, edit `users.service.ts`.

This is the main integration story.

## What We Avoid

- No large generic `DataProvider` DSL in the default scaffold.
- No required universal filter-operator system.
- No requirement that users reshape their backend globally.
- No long adapter tutorial before the first real API call works.

## Optional Advanced Layer

Later, the project can include optional helpers for teams that want a generic REST adapter, but the default template should stay module-service first.
