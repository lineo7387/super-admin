# Backend Example Guidelines

This project is frontend-first. Backend code is optional and exists only for maintainer validation or examples.

## Boundary

Default generated/published projects must not require:

- A backend service.
- A database.
- An auth provider.
- A specific API protocol.

Users connect their own systems by editing API adapter files in the frontend app.

## If Backend Examples Are Added

- Keep them outside the default scaffold path.
- Do not import backend-specific types into feature pages.
- Do not make generated modules depend on Prisma, Hono, Better Auth, or any backend package.
- Use backend examples only to verify that mock API adapters can be replaced when the example page semantics still fit.
- Document examples as one possible integration path, not the recommended or required backend.

## Preferred Example Shape

If maintainers need a validation backend, keep it small and separate:

```text
examples/api/
  README.md
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
