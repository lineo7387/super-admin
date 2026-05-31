# Module API Adapter Examples Handoff

## Decision

Proceed with a frontend-only MVP covering Dashboard, Workbench, and Access. Use the existing Users module as the reference pattern for typed module API adapter boundaries.

## Product Boundary

Default scaffold remains:

- Vue admin app.
- UI primitives from `packages/ui`.
- Examples pages.
- Mock API data under `apps/admin/src/api/mock/`.
- Module-owned API adapters that can be replaced or reshaped with the rest of the module.
- Query composables as the page-facing data layer.

Still out of the default scaffold:

- Backend/reference API.
- Database or ORM.
- Auth provider.
- AI provider.
- CLI scaffold.

## Intended Data Flow

```text
Page -> query composable -> API adapter -> api/mock data or user API
```

Implementation should make the API adapter file the obvious data-source replacement point when the example screen fits. If a real business workflow needs a different screen, users should reshape the module page/components, types, query params, and API adapter together. Pages should not import mock datasets or call network clients directly.

Mock datasets should live in `apps/admin/src/api/mock/` so they read as a simulated data source rather than page-local implementation details.

Mock datasets may use their own API-like field names. API adapters normalize that data into frontend module types so users can freely change mock fields or replace the source with real APIs.

## MVP Modules

1. Dashboard
   - Move metric and activity data behind typed mock/API adapter/query files.
   - Preserve current operations-console copy and UI shape.
   - Add API adapter tests if data shaping is more than direct return.

2. Workbench
   - Move job data and job actions/state behind typed mock/API adapter/query files.
   - Keep workflow semantics local to the module.
   - Demonstrate loading/error/empty states if the page can do so without becoming noisy.

3. Access
   - Move role/permission matrix data behind typed mock/API adapter/query files.
   - Keep permissions as frontend metadata, not provider-backed auth.
   - Avoid introducing a full RBAC backend contract.

4. Users
   - Use as reference pattern.
   - Make only small consistency updates if required by shared conventions discovered during this task.

## Implementation Guardrails

- Do not create backend-specific folders or packages.
- Keep mock data in `api/mock/`, not inside module page directories.
- Keep `api/mock/` independent from module types; adapt in API adapters.
- Do not add `fetch`, Axios, Hono clients, Prisma, or auth/AI provider clients to feature pages.
- Do not force all modules into one generic CRUD abstraction.
- Use page pagination for ordinary CRUD-style lists and cursor pagination only for stream-like examples.
- Keep API adapter functions small and module-specific.
- Do not present example module types as universal API contracts.
- Do not imply that API-adapter-only replacement is enough for every business integration.
- Prefer explicit exported types and exported return types.

## Verification Expectations

- Run relevant module tests while developing.
- Run full `pnpm -r test`, `pnpm -r typecheck`, and `pnpm -r lint` before completion.
- Start the admin app and browser-check changed routes.
- Verify at least representative theme/profile/layout combinations when UI state rendering changes.

## `00-bootstrap-guidelines`

Do not archive or modify `00-bootstrap-guidelines` in this task unless the user explicitly asks.
