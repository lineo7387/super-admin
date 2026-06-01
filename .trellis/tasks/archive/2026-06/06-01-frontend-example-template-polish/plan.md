# Frontend Example Template Polish Plan

## Scope

Plan and implement a frontend-only polish pass for the example modules and default template entry experience. This task should make the completed UI primitives and API adapter examples feel coherent as a template, while preserving the frontend-first boundary.

## Phase 1: Planning

- [x] Create the Trellis task.
- [x] Link it to `05-31-roadmap-backend-api-scaffold-followups`.
- [x] Set scope to `frontend`.
- [x] Read the roadmap `prd.md`, `info.md`, and `plan.md`.
- [x] Read the archived UI Kit/admin primitives plan.
- [x] Read the archived module API adapter examples plan.
- [x] Read relevant frontend/shared specs.
- [x] Inspect current frontend module/API/UI file structure.
- [x] Write `prd.md`.
- [x] Write `info.md`.
- [x] Write this implementation plan.
- [x] Get user confirmation before activation.
- [x] Activate the task with `task.py start`.

## Phase 2: Implementation

- [x] Load `trellis-before-dev` before editing code.
- [x] Re-read the active task `prd.md`, `info.md`, this `plan.md`, and relevant specs.
- [x] Audit Dashboard, Workbench, Access, and Users data flow:
  - [x] pages call query composables
  - [x] query composables call API adapters
  - [x] API adapters normalize `api/mock`
  - [x] pages do not import mock data or transport directly
- [x] Audit shared UI primitive usage:
  - [x] use existing `packages/ui` primitives where they fit naturally
  - [x] keep module-specific UI and business semantics inside modules
  - [x] avoid broad new abstractions unless duplication is real and domain-neutral
- [x] Improve template entry signals:
  - [x] explain mock data location
  - [x] explain API adapter replacement point
  - [x] explain full module reshaping when business workflows differ
  - [x] keep backend/auth/database/AI optional and out of the default path
- [x] Keep all backend/API contract/auth/database/AI/provider/CLI work out of scope.
- [x] Update frontend specs only if implementation discovers a durable convention.

## Phase 3: Verification

- [x] Run targeted tests for changed modules/adapters/helpers.
- [x] Run `pnpm -r test`.
- [x] Run `pnpm -r typecheck`.
- [x] Run `pnpm -r lint`.
- [x] Start the local admin app.
- [x] Browser-check changed routes.
- [x] If UI changes are made, verify representative combinations:
  - [x] Crypto dark
  - [x] Crypto light
  - [x] Industrial light
  - [x] Industrial dark
  - [x] tri-column
  - [x] dual-column
  - [x] top-header
- [x] Confirm no feature page depends on backend-specific implementation details.

## Phase 4: Finish

- [x] Load `trellis-check` before claiming implementation complete.
- [x] Review whether `.trellis/spec/` needs durable updates.
- [x] Keep `00-bootstrap-guidelines` active and unmodified unless the user explicitly requests otherwise.
- [ ] Prepare and confirm a commit plan after implementation and verification.

## Verification Evidence

- TDD red step passed: `pnpm --filter @super-admin/admin test -- apps/admin/src/modules/examples/template-guide.test.ts` failed because `./template-guide` did not exist.
- Targeted green step passed: `pnpm --filter @super-admin/admin test -- apps/admin/src/modules/examples/template-guide.test.ts` passed.
- Targeted static checks passed:
  - `pnpm --filter @super-admin/admin typecheck`
  - `pnpm --filter @super-admin/admin lint`
- Full verification passed:
  - `pnpm -r test`
  - `pnpm -r typecheck`
  - `pnpm -r lint`
  - `pnpm --filter @super-admin/admin build`
- Browser QA passed on `http://127.0.0.1:5174/`:
  - `/examples/template-guide`
  - `/examples/dashboard`
  - `/examples/workbench`
  - `/examples/access`
  - `/examples/users/all`
- Browser QA confirmed the Template Guide content under these representative combinations:
  - `crypto.dark` + `tri-column`
  - `crypto.light` + `tri-column`
  - `industrial.light` + `dual-column`
  - `industrial.dark` + `top-header`
- Browser QA confirmed no horizontal overflow, no console errors, and no overflowing `code` labels on the Template Guide page.
- Spec update review found no durable `.trellis/spec/` changes needed: the implementation applies the existing API adapter, data/query, directory, component, and frontend-first boundary specs.

## Acceptance Criteria

- Example modules consistently demonstrate the intended frontend data boundary.
- Existing shared UI primitives are consumed where they fit without erasing module-specific semantics.
- Template entry guidance makes replacement seams clear.
- The default scaffold stays frontend-first.
- No backend, database, auth, AI, API contract validation, or CLI dependency is introduced.
- Typecheck, lint, tests, and browser QA pass before completion.
