# Hono Architecture Practices

Date: 2026-06-01

## Question

How should Super Admin structure a Hono backend without accidentally creating a low-quality NestJS clone or a route-handler script pile?

## Sources

- Hono Best Practices: `https://hono.dev/docs/guides/best-practices`
- Hono RPC: `https://hono.dev/docs/guides/rpc`
- Hono Basic Getting Started: `https://hono.dev/docs/getting-started/basic`
- Installed skill: `.agents/skills/hono/SKILL.md`
- Skills page: `https://skills.sh/yusukebe/hono-skill/hono`

## Important Hono Guidance

Hono's official best-practices page says Hono is flexible, but there are patterns worth following.

The most important point for this task:

- Do not create Ruby on Rails-like controllers when possible.
- Write handlers directly after path definitions so Hono can infer path params.
- Use `app.route()` to split larger apps into feature route files.
- If handlers must be extracted, use `factory.createHandlers()` so inference remains correct.
- For RPC type inference, route definitions should be chained and exported as a route/app type.

The installed Hono skill repeats the same key practices:

- inline handlers in route definitions for path-param inference
- `app.route()` for larger apps by feature
- `createFactory()` to share `Env` across app, middleware, and handlers
- `c.set()` / `c.get()` for request-scoped data
- validators for request parts
- `app.request()` for tests without starting a server

## Architecture Implication

The previous draft directory shape was too Nest-like:

```text
modules/users/
  users.routes.ts
  users.schemas.ts
  users.service.ts
  users.repository.ts
  users.types.ts
```

That is not automatically wrong, but if every feature gets a fixed controller/service/repository/schema/type set, the project becomes a hand-written NestJS clone. If that is the desired architecture, NestJS would be more honest.

For Hono, the structure should be Hono-native:

- route files own HTTP paths and inline handlers
- `app.route()` mounts route files
- services are extracted only when business logic is non-trivial or reused
- data access can live in `db/queries` first, and move behind repositories only when persistence abstraction is actually needed
- schemas live close to the route or feature when they validate route inputs
- shared middleware/helpers live in `lib/`

## Compared Architecture Options

### 1. MVC

Typical shape:

```text
controllers/
models/
views/
```

Fit:

- Poor fit for API-only Hono.
- "View" is irrelevant for this backend.
- Controller extraction fights Hono's type inference unless done carefully.

Verdict: do not use MVC as the backend architecture.

### 2. Nest-like Feature Modules

Typical shape:

```text
modules/users/
  users.controller.ts
  users.service.ts
  users.repository.ts
  users.module.ts
  dto/
```

Fit:

- Good if using NestJS.
- Awkward if copied into Hono without DI/module tooling.
- Adds ceremony while losing Nest's framework support.

Verdict: if this is what we want, choose NestJS instead of Hono.

### 3. Hono-native Lightweight Layered

Typical shape:

```text
apps/api/src/
  app.ts
  server.ts

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
    session.ts
    permissions.ts
    validation.ts

  tests/
    app.test.ts
```

Fit:

- Matches Hono's route-first style.
- Keeps structure familiar to Express/Fastify/Hono users.
- Avoids forced service/repository files for every feature.
- Keeps auth/session/RBAC and response/error conventions centralized.
- Can grow into repositories or ports when database/external integrations demand it.

Verdict: best current fit.

## Recommendation

Use **Hono-native lightweight layered architecture**, not "Nest-like Hono".

Rules:

- Routes are first-class and may contain inline handlers.
- Keep handlers small; extract business logic to `services/` when it becomes meaningful.
- Keep data access in `db/queries/` initially; introduce repositories/ports only when persistence abstraction is needed.
- Use `lib/` for framework-adjacent shared utilities: env, errors, responses, validation, session context, permissions.
- Use `createFactory<Env>()` when shared Env typing is needed across app, middleware, and handlers.
- Use `app.request()` and/or `npx hono request` for route tests.
- Keep frontend adapter contracts separate; do not force `apps/admin` to import Hono RPC types unless a future task explicitly chooses that integration mode.

## Open Design Point

The next planning step should define whether the first vertical slice starts with:

1. `auth/session + current user + users list`, or
2. `health + users list + permission metadata`, with auth stubbed but structurally present.

My recommendation is option 1 if login/auth is the strategic priority, even if the first auth implementation is still deliberately small.
