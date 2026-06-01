# Backend Reference Guidelines

This project is frontend-first. Backend code is optional and exists for maintainer validation, reference implementation, and future CLI/template confidence. The backend may become a serious long-term reference app, but it must not become a required dependency for users who only want the UI.

## Boundary

Default generated/published projects must not require:

- A backend service.
- A database.
- An auth provider.
- A specific API protocol.

Users connect their own systems by editing API adapter files in the frontend app.

## Documentation Files

| File | When to Read |
| --- | --- |
| [hono-reference.md](./hono-reference.md) | Planning or implementing the optional Hono reference API |

## If Backend Reference Code Is Added

- Keep them outside the default scaffold path.
- Do not import backend-specific types into feature pages.
- Do not make generated modules depend on Prisma, Hono, Better Auth, or any backend package.
- Use backend reference code to verify that mock API adapters can be replaced when the example page semantics still fit.
- Document examples as one possible integration path, not the recommended or required backend.

## Preferred Reference Shape

If maintainers need a validation backend, prefer a separate workspace app:

```text
apps/api/
  src/
```

The frontend integration point should still be an API adapter such as:

```text
apps/admin/src/api/users.api.ts
```

## Anti-Patterns

- Adding backend client calls directly inside Vue components.
- Requiring users to run a database before seeing the template.
- Leaking ORM model types into frontend modules.
- Treating auth examples as the template's required permission system.
- Recreating NestJS patterns by hand inside Hono.
- Adding backend scaffolding to CLI output before a real vertical slice proves the runtime template.
