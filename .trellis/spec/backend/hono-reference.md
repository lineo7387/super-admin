# Hono Reference API Guidelines

## Purpose

The optional reference API should validate Super Admin's frontend adapter contracts and provide a long-term backend foundation for auth, permissions, and future CLI confidence. It should use Hono in a Hono-native way, not imitate NestJS or Rails MVC.

## Architecture Decision

Use **Hono-native lightweight layered architecture**.

This means:

- Hono owns routing, middleware, request context, and tests through `app.request()`.
- Route files are first-class and mounted with `app.route()`.
- Handlers may stay inline when that preserves Hono type inference and keeps the code readable.
- Services are extracted only for meaningful business logic, not because every route needs a matching service file.
- Data access starts in `db/queries/`; introduce repository/port abstractions only when a real persistence or external-service boundary needs it.
- Shared HTTP, validation, auth/session, permission, env, and testing helpers live under `lib/`.

## Expected Shape

The exact shape can evolve, but the first reference API should bias toward:

```text
apps/api/src/
  app.ts                 # create and compose the Hono app
  server.ts              # Node server adapter only

  routes/
    health.ts
    auth.ts
    users.ts

  services/
    auth.ts
    users.ts

  db/
    client.ts
    schema.ts
    queries/
      users.ts
      sessions.ts

  lib/
    env.ts
    http.ts
    errors.ts
    validation.ts
    session.ts
    permissions.ts

  tests/
    app.test.ts
    auth.test.ts
    users.test.ts
```

Do not create a fixed `modules/<name>/{routes,service,repository,schema,types}` template until real code proves that shape is useful. If the project wants that much structure, re-evaluate NestJS instead of building a private framework.

## Routing

Use `app.route()` for feature route files:

```ts
const app = new Hono()
app.route('/health', healthRoutes)
app.route('/auth', authRoutes)
app.route('/users', usersRoutes)
```

Route files should:

- define Hono routes close to the handlers
- use validators for `param`, `query`, and `json` inputs
- call services only when logic is non-trivial or reused
- return shared response helpers where useful
- avoid direct database calls once business rules appear

Avoid Rails-style controller classes and Nest-style controller/service boilerplate. If handlers are extracted for reuse, use Hono factory helpers so Env and route inference stay intact.

## Env And Request Context

Define a shared Hono `Env` type before middleware or handlers need request-scoped values.

Use Hono request variables for session/auth context:

```ts
type ApiEnv = {
  Variables: {
    session: SessionContext | null
  }
}
```

Rules:

- No global mutable auth state.
- Middleware may set `session`, request IDs, or capability metadata.
- Handlers read request-scoped values through `c.var` or typed `c.get()`.
- Keep provider-specific auth details behind `lib/session.ts` or future auth adapters.

## Validation

Validate untrusted inputs at the route boundary:

- path params
- query params
- JSON bodies
- headers only when they drive behavior

Runtime validation is appropriate for the backend. The exact validator can be chosen during implementation, but Hono supports Zod through `@hono/zod-validator` and Standard Schema-compatible validators through `@hono/standard-validator`.

Do not leak backend validation schemas into frontend pages. Frontend API adapters may normalize reference API responses, but `apps/admin` should remain able to use any user API.

## Responses And Errors

Define a small response/error convention before the first real endpoint.

Recommended success shape:

```ts
type ApiSuccess<T> = {
  data: T
  meta?: Record<string, unknown>
}
```

Recommended error shape:

```ts
type ApiError = {
  error: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}
```

Rules:

- Use Hono `app.notFound()` for unknown routes.
- Use `app.onError()` for unexpected failures.
- Keep internal errors out of public responses.
- Map validation errors into field errors when the UI can render them.
- Keep HTTP status semantics correct.

## Auth And Permissions

Plan auth/session/RBAC from the start, even if the first implementation is small.

Recommended boundaries:

- `lib/session.ts`: session parsing, current user/session context, auth middleware.
- `lib/permissions.ts`: permission names and checks.
- `routes/auth.ts`: login/logout/session endpoints.
- `services/auth.ts`: auth use cases.
- `db/queries/sessions.ts`: session persistence once database work begins.

Rules:

- Do not make frontend route meta the backend permission source of truth.
- Do not require an auth provider in the default frontend scaffold.
- Keep frontend permission metadata replaceable by user systems.
- Reference backend permissions should validate integration, not define the only valid model.

## Data Access

Start with `db/queries/` for real data access functions. Introduce repositories or ports only when one of these becomes true:

- persistence implementation must be swapped in tests or generated projects
- a use case coordinates multiple data sources
- database schema no longer maps directly to the route/service need
- auth/provider/database choices become pluggable

Do not call Prisma or other database clients directly from route handlers once business rules exist.

## Testing

Use Hono-native request tests:

- `app.request()` for route behavior without starting a server.
- `npx hono request` for quick manual endpoint checks once Hono is installed.
- service tests for business rules that do not need HTTP.
- query tests only when database or persistence logic exists.

Minimum first-slice tests:

- health route returns success
- invalid input returns validation error shape
- session/current-user route handles anonymous and authenticated states
- users route returns a shape the admin adapter can normalize

## Scenario: First Reference API Vertical Slice

### 1. Scope / Trigger

- Trigger: adding or changing the optional Hono reference API's first auth-aware endpoints.
- Scope: `apps/api/src/app.ts`, route files under `apps/api/src/routes/`, backend helpers under `apps/api/src/lib/`, data access under `apps/api/src/db/queries/`, and optional frontend adapter examples under `apps/admin/src/api/reference/`.
- Boundary: this validates the reference backend and adapter-normalization path only. The default admin app must keep using mock adapters unless a future task explicitly switches it.

### 2. Signatures

Backend endpoints:

```text
GET /health
GET /session/current-user
GET /users?page=<number>&pageSize=<number>&keyword=<string?>&status=all|active|review|paused
```

Reference authentication for tests and local validation:

```text
Authorization: Bearer reference-admin-token
```

Frontend optional normalizer:

```ts
normalizeReferenceUsersResponse(response: ReferenceUsersResponse, params: UserListParams): UserListResult
```

### 3. Contracts

Success responses use the shared envelope:

```ts
type ApiSuccess<T> = {
  data: T
  meta?: Record<string, unknown>
}
```

`GET /health` returns:

```ts
{
  data: {
    service: 'super-admin-api'
    status: 'ok'
  }
}
```

`GET /session/current-user` returns:

```ts
{
  data: {
    authenticated: boolean
    user: null | {
      id: string
      name: string
      email: string
      role: 'Owner' | 'Operator' | 'Auditor' | 'Analyst'
    }
    permissions: Array<'users:read'>
  }
}
```

`GET /users` returns a page-list payload that the admin users adapter can normalize:

```ts
{
  data: {
    items: Array<{
      id: string
      name: string
      email: string
      role: 'Owner' | 'Operator' | 'Auditor' | 'Analyst'
      status: 'active' | 'review' | 'paused'
      region: string
      notes?: string
    }>
    total: number
    page: number
    pageSize: number
  }
}
```

The first implementation may use temporary reference data, but it must still flow through `db/queries/users.ts` and `lib/session.ts`. Do not hide temporary data directly inside route handlers.

### 4. Validation & Error Matrix

| Condition | Response |
| --- | --- |
| Unknown route | `404 { error: { code: 'not_found', message: 'Route not found.' } }` |
| Unexpected server error | `500 { error: { code: 'internal_server_error', message: 'Internal server error.' } }` |
| Anonymous request to `GET /users` | `401 { error: { code: 'unauthorized', message: 'Authentication is required.' } }` |
| Authenticated request without `users:read` | `403 { error: { code: 'forbidden', message: 'Permission is required.' } }` |
| Invalid users query | `400 { error: { code: 'validation_failed', message: 'Request validation failed.', fields } }` |

Validation details:

- `page` must be an integer at least `1`.
- `pageSize` must be an integer between `1` and `100`.
- `status` must be `all`, `active`, `review`, or `paused`.
- `keyword` is optional and trimmed at the route boundary.

### 5. Good/Base/Bad Cases

- Good: `/users` is protected by permission middleware, validates query params with a Hono validator, calls `services/users.ts`, and reads reference data through `db/queries/users.ts`.
- Base: `/health` can keep an inline route handler because there is no business logic.
- Bad: `routes/users.ts` imports mock frontend data, embeds session token maps in the route handler, or makes `apps/admin/src/api/users.api.ts` depend on `@super-admin/api`.

### 6. Tests Required

- Use `app.request()` for all route behavior.
- Assert `/health` success envelope.
- Assert anonymous and authenticated `/session/current-user` behavior.
- Assert `/users` rejects anonymous requests with the shared error shape.
- Assert `/users` rejects authenticated sessions without `users:read`.
- Assert invalid users query params return field-level validation errors.
- Assert `/users` returns the page-list shape expected by the optional admin reference normalizer.
- Add admin adapter tests only under optional reference adapter files; do not change default mock adapter behavior unless explicitly scoped.

### 7. Wrong vs Correct

#### Wrong

```ts
usersRoutes.get('/', (context) => {
  return context.json(mockUsers)
})
```

This bypasses the response envelope, permission middleware, validation, service/data boundary, and adapter-normalizable page-list contract.

#### Correct

```ts
usersRoutes.get(
  '/',
  requirePermission('users:read'),
  zValidator('query', usersListQuerySchema, validationHook),
  async (context) => context.json(apiSuccess(await listUsers(context.req.valid('query'))))
)
```

This keeps Hono routing first-class while preserving validation, auth, response, and data-access boundaries.

## Wrong Vs Correct

### Wrong: Nest-like Hono

```text
modules/users/
  users.controller.ts
  users.service.ts
  users.repository.ts
  users.module.ts
```

This copies NestJS ceremony without NestJS framework support.

### Correct: Hono-native

```text
routes/users.ts
services/users.ts
db/queries/users.ts
lib/permissions.ts
```

This keeps routing close to Hono, extracts business/data logic only where useful, and stays easy for open-source users to inspect.
