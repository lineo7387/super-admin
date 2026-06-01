# Frontend Example Template Polish Handoff

## Current Decision

The next task after UI primitives and module API adapter examples should polish the frontend example/template layer before moving to broader integration docs, API contract validation, reference backend validation, or CLI scaffold work.

## Why This Comes Next

- UI primitives now exist and module examples now use API adapters.
- The next risk is not missing backend code; it is that the default frontend template may not yet tell a clear enough story for users copying or replacing examples.
- A focused frontend polish task can stabilize the shape that `template-integration-docs` will document.

## Product Boundary

This task remains frontend-first.

Default scaffold may include:

- Vue admin app.
- UI Kit/admin primitives.
- Example modules.
- Mock data through replaceable API adapters.
- Lightweight template entry guidance.

Default scaffold must not require:

- backend/API server
- database/ORM
- auth provider
- AI provider
- formal shared API schema
- CLI generation

## Expected Implementation Shape

- Pages remain composition surfaces.
- Pages call module query composables.
- Query composables call API adapters.
- API adapters normalize `api/mock` or user API shapes into module frontend types.
- Mock data stays in `apps/admin/src/api/mock/`.
- Global Pinia stores stay in `apps/admin/src/stores/`.
- Module-specific copy, columns, validation rules, and workflow states stay in module folders.
- Reusable, domain-neutral admin primitives stay in `packages/ui`.

## Suggested MVP

1. Audit Dashboard, Workbench, Access, and Users for boundary consistency.
2. Align example modules with existing shared primitives where the fit is obvious.
3. Add or refine a minimal template entry surface that explains the replacement seams.
4. Avoid creating a full docs pass; leave broader how-to documentation for `template-integration-docs`.

## Verification Expectations

- Run relevant tests.
- Run full typecheck.
- Run lint.
- Start the admin app.
- Browser-check changed example/template routes.
- Verify representative profile/mode/layout combinations when UI changes are made.

## Follow-up

After this task, the roadmap should continue to `template-integration-docs`, using the polished frontend examples as the source of truth for user-facing documentation.
