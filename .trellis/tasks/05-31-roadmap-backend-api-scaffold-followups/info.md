# Roadmap Handoff

## Current Decision

The next implementation task should be `ui-kit-admin-console-primitives`.

UI Kit/admin primitives are part of the backend/admin console UI foundation. They should be implemented before module service examples, API contracts, reference backend validation, or CLI scaffold work.

## Product Boundary

Default scaffold:

- Vue admin app.
- Runtime layout/profile/theme switching.
- UI Kit/admin primitives.
- Examples pages.
- Mock data through replaceable module services.
- Frontend-facing integration contracts and docs.

Reference validation only:

- `apps/api` or other live backend examples.
- Database/ORM examples.
- Real auth provider examples.
- AI provider examples.

Reference validation must prove the frontend seams work without making backend/auth/database/AI mandatory for generated projects.

## Follow-up Task Queue

1. `ui-kit-admin-console-primitives`
   - Expand UI Kit into realistic admin-console primitive coverage.
   - Cover forms, validation, tables, table states, overlays, feedback states, and profile/mode QA.

2. `module-service-examples`
   - Expand Examples into typed service/query/mock/page patterns.
   - Make replacing mock services with real APIs obvious.

3. `template-integration-docs`
   - Document how users run, customize, and connect the template to their own APIs.

4. `api-contract-validation`
   - Define framework-neutral contracts for pagination, filtering, mutation results, errors, permissions, and validation.

5. `reference-api-validation`
   - Optional maintainer-side backend validation, likely Hono-first unless a future task decides otherwise.

6. `cli-theme-first-scaffold`
   - Scaffold from stable runtime contracts; keep backend/reference packages out of the default output.

7. `release-acceptance-qa`
   - Repeatable release checks for UI profiles/layouts, module scenarios, API replacement seams, and CLI smoke tests.

## Bootstrap Guidelines

Do not archive `00-bootstrap-guidelines` yet. It remains useful until specs reflect the actual frontend UI/service conventions and either intentionally-light backend boundaries or real reference backend conventions.
