# Frontend Example Template Polish

## Goal

Polish the frontend example modules and default template guidance after the UI primitive and API adapter example tasks. The goal is to make the current scaffold feel coherent, learnable, and copyable for users who want a frontend-first admin template with replaceable API adapters, without introducing backend, auth, database, AI, API contract, or CLI requirements.

## What I Already Know

- The parent roadmap is `.trellis/tasks/05-31-roadmap-backend-api-scaffold-followups`.
- The completed UI Kit task added shared admin primitives in `packages/ui` and showcase routes under `apps/admin/src/modules/ui-kit/`.
- The completed module API adapter task established:
  - mock data under `apps/admin/src/api/mock/`
  - API adapters under `apps/admin/src/api/*.api.ts`
  - module queries under `apps/admin/src/modules/<module>/<module>.queries.ts`
  - module frontend types under `apps/admin/src/modules/<module>/<module>.types.ts`
- The intended data flow remains:

```text
Page -> module queries -> API adapter -> api/mock data or user API
```

- Example module types are frontend example contracts, not universal backend API schemas.
- Users may reshape page/components, types, query params, and API adapters together when their real business workflow differs.
- The default scaffold remains frontend-first and must not require backend, database, auth, AI provider, or fixed API response shape.
- Current example areas include Dashboard, Workbench, Access, Users, UI Kit, shell preferences, workspace tabs, and app layout presets.

## Assumptions

- This task should refine the current frontend examples and template experience before `template-integration-docs`.
- This task may add or adjust lightweight documentation where it directly supports the template entry experience, but it should not become a full documentation task.
- The next documentation task can build on the final wording and structure from this task.
- No backend/API contract/CLI implementation should happen in this task.

## Requirements

- Audit Dashboard, Workbench, Access, and Users examples for consistency with the module query/API adapter/mock boundary.
- Check whether example pages consistently consume shared UI primitives from `packages/ui` where appropriate.
- Reduce local duplicate UI patterns only when a shared primitive already exists and the change improves consistency without over-abstracting module-specific business UI.
- Improve template entry signals so a new user can quickly understand:
  - where mock data lives
  - where API adapters live
  - where module types and queries live
  - when they can replace only an adapter
  - when they should reshape the full module
- Keep business semantics inside example modules, not `packages/ui`.
- Keep `api/mock` decoupled from module types; adapters normalize mock/API shapes into frontend types.
- Preserve runtime profile, color mode, and layout switching.
- Preserve the frontend-first product boundary.

## Acceptance Criteria

- [ ] Example modules consistently follow `Page -> module queries -> API adapter -> api/mock`.
- [ ] Existing shared UI primitives are used where they fit naturally, without turning module-specific semantics into global UI.
- [ ] Template entry guidance makes API replacement and module reshaping boundaries clear.
- [ ] No backend, database, auth, AI, API contract validation, or CLI requirement is introduced.
- [ ] Frontend specs are updated only if implementation discovers a durable convention.
- [ ] Typecheck, lint, relevant tests, and browser QA pass before completion.

## Out of Scope

- Building a reference backend or live API.
- Choosing Zod vs Valibot or defining formal API contracts.
- Adding auth provider, database, AI provider, or server-side code.
- Starting CLI scaffold work.
- Turning examples into a generic CRUD DSL.
- Requiring user APIs to match the example module types.
- Archiving or modifying `00-bootstrap-guidelines`.

## Technical Notes

- Relevant specs:
  - `.trellis/spec/frontend/index.md`
  - `.trellis/spec/frontend/api-adapters.md`
  - `.trellis/spec/frontend/directory-structure.md`
  - `.trellis/spec/frontend/data-and-query.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/spec/frontend/components.md`
  - `.trellis/spec/frontend/quality.md`
  - `.trellis/spec/shared/code-quality.md`
- Relevant completed plans:
  - `.trellis/tasks/archive/2026-05/05-31-ui-kit-admin-console-primitives/plan.md`
  - `.trellis/tasks/archive/2026-06/05-31-module-service-examples/plan.md`
- Initial implementation focus should stay under:
  - `apps/admin/src/modules/`
  - `apps/admin/src/api/`
  - `apps/admin/src/api/mock/`
  - `packages/ui/`
  - root or app-level lightweight docs if needed
