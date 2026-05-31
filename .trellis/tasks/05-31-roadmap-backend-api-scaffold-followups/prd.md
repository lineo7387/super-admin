# Roadmap Backend API and Scaffold Follow-ups

## Goal

Turn the archived Super Admin architecture decisions into an executable follow-up roadmap for backend/API validation, module API adapter examples, integration documentation, and scaffold/CLI work. The outcome of this task is a planning artifact, not implementation code: a clear sequence of future Trellis tasks with boundaries, dependencies, and acceptance criteria.

## What I Already Know

- The project is an open-source, frontend-first admin template.
- The default generated scaffold should not require a backend, database, auth service, AI provider, or fixed API response shape.
- Backend/Auth/AI examples may exist in this repository for maintainer-side validation, but they should stay separate from the default scaffold output.
- The intended integration path is:

```text
Page -> query/composable -> API adapter -> api/mock data or user API
```

- Users should be able to connect real APIs by editing small API adapter files, such as `apps/admin/src/api/users.api.ts`, when the example screen semantics still fit.
- Archived research already recommends a monorepo with:
  - `apps/admin` for the Vue admin app
  - optional `apps/api` for real API validation
  - future `packages/cli` for scaffold commands once contracts stabilize
  - `packages/core`, `packages/ui`, and `packages/theme` as runtime contracts and primitives
- Archived backend decision: Hono-style lightweight API is preferred for optional maintainer/reference validation; NestJS remains a heavier enterprise-flavored alternative.
- Archived database decision: PostgreSQL + Prisma can be used for optional validation examples, but should not leak into the frontend scaffold contract.
- Archived auth decision: Better Auth + RBAC/permission-point model may be useful for optional validation examples, but generated projects should expose simple replaceable frontend hooks/metadata.
- Archived API contract direction: Zod first if ecosystem compatibility and OpenAPI/form resolver support matter most; Valibot is a lightweight alternative.
- Archived CLI direction: theme-first scaffold flow, with later commands such as `super-admin theme add ...` and `super-admin module add orders`; module generation should come after runtime contracts stabilize.
- The first frontend foundation task deferred several follow-ups:
  - `module-service-examples`
  - `template-integration-docs`
  - release-style browser acceptance across module scenarios

## Assumptions (Temporary)

- This task should produce a roadmap and task decomposition only; it should not start implementing backend, API contracts, docs, or CLI code.
- `00-bootstrap-guidelines` should remain active until project specs are sufficiently real and useful; this roadmap may define when it is safe to close, but should not archive it directly.
- The next implementation wave should strengthen frontend integration seams before adding a reference backend.
- Optional reference backend work should validate replacement boundaries, not redefine the template as a full-stack framework.

## Open Questions

- None. The user confirmed that the next implementation task should start with `ui-kit-admin-console-primitives`.

## Requirements (Evolving)

- Consolidate archived architecture decisions into a current roadmap.
- Preserve the frontend-first product boundary:
  - default scaffold uses mock data and replaceable API adapters
  - backend/database/auth/AI are optional/reference validation only
- Define a staged task sequence covering:
  - UI Kit/admin console primitives
  - typed API adapter/query/mock examples
  - integration documentation
  - API contract validation
  - optional reference backend validation
  - theme-first CLI scaffold
  - release/acceptance QA
- For each proposed follow-up task, specify:
  - purpose
  - scope
  - dependencies
  - definition of done
  - out-of-scope boundaries
- Identify which tasks must update `.trellis/spec/` and which should only create user-facing docs or code.
- Clarify where `00-bootstrap-guidelines` fits:
  - what spec gaps remain
  - what evidence is needed before archive
  - whether backend specs should remain intentionally light until reference backend work starts
- Avoid creating a parallel roadmap outside `.trellis/`.
- Do not create `docs/superpowers` or `.superpowers` artifacts.

## Decision

The next implementation task should be `ui-kit-admin-console-primitives`.

This means the project should continue strengthening the backend/admin UI foundation before moving into module API adapter examples, API contracts, reference backend validation, or CLI scaffolding. UI Kit work is not a backend/API phase; it is the admin-console primitive layer that Examples and later API-backed screens will consume.

## Proposed Roadmap Shape

## Product Boundary Matrix

| Capability | Default scaffold | Maintainer/reference validation | Why |
| --- | --- | --- | --- |
| Admin UI shell, layouts, profiles | Yes | Yes | This is the product's primary value. |
| UI Kit/admin primitives | Yes | Yes | Users need copyable table/form/drawer/status primitives before API integration. |
| Examples pages | Yes | Yes | Examples teach composition and realistic backend-console patterns. |
| API adapters with mock data | Yes | Yes | This is the default integration seam users replace with their own APIs when example screens fit. |
| API contract normalization | Yes, as frontend-facing types/helpers/docs | Yes, with optional live API checks | Contracts must guide integration without forcing one backend. |
| Reference backend | No | Yes | It validates replacement seams for maintainers but should not ship as required scaffold. |
| Database/ORM | No | Optional | Useful only if backend validation needs persistence. |
| Auth provider | No | Optional | Frontend permission metadata should be replaceable by user auth. |
| AI provider | No | Optional | AI remains a configurable capability, not a required dependency. |
| CLI scaffold | Yes, once stable | Yes | CLI should generate the default frontend template from runtime contracts. |

## Dependency Order

```text
UI Kit/admin primitives
  -> Module API adapter examples
    -> Integration docs
      -> API contract validation
        -> Optional reference API validation
          -> CLI scaffold
            -> Release acceptance QA
```

Why this order:

- UI Kit comes first because Examples should consume showcased reusable primitives instead of inventing local UI.
- Module API adapter examples come before docs/API validation because docs and contracts need concrete module seams to describe.
- API contract validation comes before reference backend so the backend validates existing frontend-facing contracts instead of driving them.
- CLI comes after runtime/module/theme/API adapter contracts stabilize, so it does not invent a parallel schema.
- Release acceptance QA becomes more valuable after the major user-facing and optional validation surfaces exist.

### 1. `ui-kit-admin-console-primitives`

Purpose: continue the backend/admin UI foundation before deeper API/backend work.

Expected scope:

- Expand the current UI Kit skeleton into a stronger admin-console component reference.
- Cover realistic states for:
  - foundations/tokens
  - actions/buttons
  - inputs
  - forms and validation
  - tables and table states
  - overlays/drawers
  - feedback/loading/error/empty states
- Verify components across Crypto/Industrial and light/dark modes.
- Keep reusable admin UI in `packages/ui`, showcase it in UI Kit, then let Examples consume it.

Definition of done:

- UI Kit demonstrates the reusable primitives needed by the next Examples/API adapter work.
- The admin UI system has enough table/form/drawer/feedback coverage for realistic backend management screens.
- Browser QA covers the affected UI Kit routes across relevant layout/theme combinations.

### 2. `module-service-examples`

Purpose: make Examples modules demonstrate the intended replaceable data seam.

Expected scope:

- Expand Dashboard, Workbench, Users, and Access into typed API adapter/query/mock examples.
- Keep feature pages calling query/composable layers, not raw mock data or direct network calls.
- Keep module-owned business copy, table columns, validation rules, and workflow state inside Examples.
- Ensure reusable UI used by examples flows through `packages/ui` and UI Kit first.

Definition of done:

- Example modules have clear type/API adapter/mock/query boundaries.
- Replacing an API adapter with a real API call is obvious when the example screen fits.
- Tests cover API adapter/query behavior where useful.
- Relevant frontend specs are updated if API adapter boundaries change.

### 3. `template-integration-docs`

Purpose: explain how users run, customize, and integrate the template.

Expected scope:

- Add README guidance for:
  - running the admin app
  - switching theme/profile/layout
  - replacing mock API adapters
  - connecting REST/RPC/GraphQL/custom APIs
  - why backend/auth/AI are optional
  - where future CLI work fits

Definition of done:

- A new developer can identify where to edit for API integration without reading archived Trellis research.
- Documentation reinforces the frontend-first boundary.

### 4. `api-contract-validation`

Purpose: define the request/response, error, pagination, filtering, validation, and permission contracts that let frontend examples connect to real systems predictably.

Expected scope:

- Decide Zod vs Valibot for shared validation examples.
- Define reusable contract patterns for:
  - list pagination
  - filters/sorting
  - mutation results
  - field errors
  - permission/capability metadata
  - not-configured/unavailable states
- Keep contracts framework-neutral enough for REST/RPC/GraphQL/custom APIs.

Definition of done:

- Contracts are documented in `.trellis/spec/` and represented in code/tests where appropriate.
- API adapters can normalize real API responses without leaking backend framework details into pages.

### 5. `reference-api-validation`

Purpose: build an optional maintainer-side backend reference to prove that API adapters can be replaced with real API calls.

Expected scope:

- Prefer Hono-style lightweight API unless planning finds a stronger reason for NestJS.
- Keep reference backend outside the default generated scaffold.
- Add only enough endpoints/data to validate representative module flows.
- Consider PostgreSQL + Prisma only if database-backed validation is needed for acceptance.

Definition of done:

- Reference API can validate at least one realistic module path end to end.
- Default scaffold still runs without backend/database/auth.
- Docs clearly mark the backend as optional/reference.

### 6. `cli-theme-first-scaffold`

Purpose: create the first CLI scaffold surface after runtime contracts are stable.

Expected scope:

- Theme-first create flow.
- Opinionated defaults for framework choices.
- Future extension points for `theme add` and `module add`.
- CLI generation uses runtime contracts, not a parallel schema.

Definition of done:

- CLI can scaffold the default frontend template from current runtime contracts.
- The generated project does not require optional backend/reference packages.

### 7. `release-acceptance-qa`

Purpose: turn current manual quality checks into a repeatable release acceptance path.

Expected scope:

- Browser QA for layout/profile/theme combinations.
- Module scenario checks for Examples and UI Kit.
- Contract tests for API adapter replacement and API normalization.
- CLI scaffold smoke test once CLI exists.

Definition of done:

- A maintainer can verify release readiness without reconstructing checks from chat history.

## `00-bootstrap-guidelines` Relationship

`00-bootstrap-guidelines` should not absorb this roadmap. Its role is to make `.trellis/spec/` accurately describe current project conventions.

Keep it active while:

- Backend specs are still mostly placeholders or intentionally light.
- The frontend specs are still changing due to UI Kit, Examples, and API adapter boundary work.
- There are not enough real backend/reference examples to document backend conventions honestly.

Archive it only after:

- Frontend specs reflect the actual UI Kit, shell, API adapter, and theme conventions.
- Backend specs either document the intentional "no default backend" boundary, or a reference backend exists with real conventions.
- Shared specs cover monorepo, TypeScript, quality, and git/session expectations.

Do not archive `00-bootstrap-guidelines` as part of this roadmap task.

## Acceptance Criteria (Evolving)

- [ ] PRD consolidates the archived backend/API/CLI decisions accurately.
- [ ] Roadmap distinguishes default scaffold from optional maintainer/reference validation.
- [ ] Roadmap explicitly includes the admin UI / UI Kit second stage before backend/API validation.
- [ ] Follow-up task list has clear order and dependencies.
- [ ] Each follow-up task has an explicit definition of done.
- [ ] `00-bootstrap-guidelines` handling is described without archiving or modifying it.
- [x] User confirms the task sequence before implementation tasks are created.
- [ ] No implementation code is changed in this planning task.

## Definition of Done

- PRD is accepted by the user.
- Follow-up task names and order are agreed.
- Any needed `research/*.md` or `info.md` summary is added if the roadmap needs durable consolidation beyond this PRD.
- `implement.jsonl` and `check.jsonl` are curated if this planning task proceeds into an executable documentation/update phase.
- No code implementation is started from this task unless the user explicitly changes scope.

## Out of Scope (Explicit)

- Do not implement `apps/api`.
- Do not add CLI code.
- Do not add or rewrite README files.
- Do not refactor API adapters from this roadmap planning task.
- Do not archive `00-bootstrap-guidelines`.
- Do not introduce backend/database/auth dependencies into the default scaffold.
- Do not create Superpowers artifacts.

## Technical Notes

- Source archive: `.trellis/tasks/archive/2026-05/05-29-open-source-super-admin-template/info.md`
- Source research: `.trellis/tasks/archive/2026-05/05-29-open-source-super-admin-template/research/admin-template-ai-architecture.md`
- Source research: `.trellis/tasks/archive/2026-05/05-29-open-source-super-admin-template/research/technical-decision-map.md`
- Source implementation boundary: `.trellis/tasks/archive/2026-05/05-29-open-source-super-admin-template/plan.md`
- Current active bootstrap task: `.trellis/tasks/00-bootstrap-guidelines`
