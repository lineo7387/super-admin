# Module API Adapter Examples

## Goal

Expand the frontend Examples modules into realistic, typed API-adapter examples that demonstrate the intended integration seam:

```text
Page -> query composable -> API adapter -> api/mock data or user API
```

This task should make the module boundary copyable without implying that real businesses must keep the example page or API shape. Users can replace mock data in an API adapter when the screen fits, or reshape the module page, types, queries, and API adapter together when their business workflow differs.

## What I Already Know

- The roadmap follow-up sequence puts `module-service-examples` immediately after `ui-kit-admin-console-primitives`.
- The UI Kit/admin primitives task is complete and archived, so Examples should consume shared primitives from `packages/ui` instead of inventing local equivalents.
- The default scaffold must not require a backend, database, auth provider, AI provider, or fixed API response shape.
- Existing frontend specs already define the desired module shape:
  - `<module>.types.ts`
  - `api/<module>.api.ts`
  - `<module>.queries.ts`
- User feedback clarified that mock data should live under `apps/admin/src/api/mock/` as a simulated API source, not inside module/page folders.
- Existing Users module already has typed users files, API adapter tests, query composable, table components, and validation helpers.
- Dashboard, Workbench, and Access currently use inline static arrays in page components and should be the primary modules expanded in this task.
- Feature pages should call query composables, not API adapters, mock data, fetch, Axios, backend SDKs, Prisma, or provider clients directly.
- TanStack Query is the server/cache state layer; Pinia remains for client/app state only.
- User feedback clarified that real business modules may need different pages and interfaces, so examples must be framed as copyable patterns rather than fixed shapes.

## Assumptions

- The MVP should cover Dashboard, Workbench, and Access using the current Users module as the reference pattern.
- Users may receive small polish updates if needed for consistency, but this task should not rework Users broadly.
- Mock API behavior can include small artificial delays or scenario switches only where they help demonstrate loading, empty, or error states.
- Domain-specific table columns, validation rules, workflow states, and business copy belong in module folders, not `packages/ui`.
- Shared UI additions are allowed only if a genuinely reusable primitive gap is discovered; otherwise this task should consume existing UI primitives.

## Requirements

- Add typed API adapter/query/mock boundaries for Dashboard, Workbench, and Access.
- Place mock data under `apps/admin/src/api/mock/`.
- Let mock data use simulated API field names and normalize it inside API adapters.
- Keep each module's API adapter small, specific, and easy to point at user API calls.
- Make clear that module pages, components, types, query params, and API adapters may all be changed for different business workflows.
- Keep pages as composition surfaces that consume query composables and present states through UI primitives.
- Demonstrate realistic admin-console states where useful:
  - loading
  - error
  - empty
  - normal/list/detail summary states
- Use `packages/ui` primitives created by the UI Kit task for generic cards, status, alerts, tables, forms, feedback, and actions where appropriate.
- Preserve frontend-only behavior. The app must still run with mock data and no backend.
- Avoid defining a universal CRUD framework, global data-provider DSL, or backend contract package.
- Avoid implying that users only edit API adapter files for every integration.
- Add or update tests for non-trivial API adapter/query logic, especially filtering, pagination, scenario handling, or state normalization.
- Update frontend specs only if implementation reveals a durable convention that should guide future modules.

## Acceptance Criteria

- Dashboard, Workbench, and Access each expose typed module files matching the local pattern:
  - `<module>.types.ts`
  - `<module>.queries.ts`
- Dashboard, Workbench, Access, and Users each expose `api/<module>.api.ts`.
- Dashboard, Workbench, Access, and Users mock data lives under `apps/admin/src/api/mock/`.
- `api/mock` does not import module types; API adapters normalize mock API shapes into module frontend types.
- Pages call query composables rather than raw mock data or transport clients.
- API adapters are the clear data-source replacement points when the example business screen still fits.
- Task docs and UI copy do not imply that real business pages must keep the example page or API shape.
- No default scaffold code requires backend, database, auth, AI, or provider setup.
- Examples consume shared UI primitives where applicable and keep domain behavior module-local.
- Relevant tests pass for API adapter/query behavior.
- Full repo typecheck, lint, and tests pass before completion.
- Browser QA covers the changed Examples routes across representative profile/mode/layout combinations.

## Out of Scope

- Creating `apps/api` or any reference backend.
- Adding database, ORM, auth provider, AI provider, or backend SDK dependencies.
- Finalizing global API contract validation.
- Creating CLI scaffold commands.
- Reworking the UI Kit beyond small shared primitive fixes discovered during implementation.
- Archiving or modifying `00-bootstrap-guidelines`.

## Technical Notes

- Parent roadmap task: `.trellis/tasks/05-31-roadmap-backend-api-scaffold-followups`.
- Prior foundation task: `.trellis/tasks/archive/2026-05/05-31-ui-kit-admin-console-primitives`.
- Relevant specs:
  - `.trellis/spec/frontend/index.md`
  - `.trellis/spec/frontend/api-adapters.md`
  - `.trellis/spec/frontend/data-and-query.md`
  - `.trellis/spec/frontend/directory-structure.md`
  - `.trellis/spec/frontend/components.md`
  - `.trellis/spec/frontend/type-safety.md`
  - `.trellis/spec/frontend/quality.md`
  - `.trellis/spec/shared/typescript.md`
  - `.trellis/spec/shared/code-quality.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/guides/cross-layer-thinking-guide.md`

## Definition of Done

- Requirements above are implemented and verified.
- Tests, typecheck, lint, and relevant browser QA pass.
- Spec update review is performed; specs are updated only for durable new conventions.
- Work is committed before `/trellis:finish-work`.
