# Module API Adapter Examples Plan

## Scope

Plan and implement typed frontend API-adapter examples for Dashboard, Workbench, and Access. This task strengthens copyable frontend module boundaries without implying that real businesses must keep the example page or API shape.

## Phase 1: Planning

- [x] Create the Trellis task.
- [x] Link it to `05-31-roadmap-backend-api-scaffold-followups`.
- [x] Set scope to `frontend`.
- [x] Read the roadmap `prd.md`, `info.md`, and `plan.md`.
- [x] Read the archived UI Kit/admin primitives plan.
- [x] Read relevant frontend/shared specs.
- [x] Inspect current module files and existing Users API adapter/query pattern.
- [x] Confirm MVP scope with the user.
- [x] Write `prd.md`.
- [x] Write `info.md`.
- [x] Write this implementation plan.
- [x] Get user confirmation before activation.
- [x] Activate the task with `task.py start`.

## Phase 2: Implementation

- [x] Load `trellis-before-dev` before editing code.
- [x] Re-read the active task `prd.md`, `info.md`, this `plan.md`, and relevant specs.
- [x] Audit the existing Users module pattern for reusable conventions.
- [x] Implement Dashboard API adapter example:
  - [x] `dashboard.types.ts`
  - [x] `dashboard.mock.ts`
  - [x] `api/dashboard.api.ts`
  - [x] `dashboard.queries.ts`
  - [x] page integration
  - [x] tests if shaping/filtering/scenarios are non-trivial
- [x] Implement Workbench API adapter example:
  - [x] `workbench.types.ts`
  - [x] `workbench.mock.ts`
  - [x] `api/workbench.api.ts`
  - [x] `workbench.queries.ts`
  - [x] page integration
  - [x] tests for job list/action/state behavior where useful
- [x] Implement Access API adapter example:
  - [x] `access.types.ts`
  - [x] `access.mock.ts`
  - [x] `api/access.api.ts`
  - [x] `access.queries.ts`
  - [x] page integration
  - [x] tests for permission matrix/data shaping where useful
- [x] Keep Users changes limited to consistency fixes only.
- [x] Keep pages calling query composables, not API adapters or mock data directly.
- [x] Keep all backend/API/auth/database/AI/provider work out of scope.
- [x] Correct docs and UI copy so API-adapter-only replacement is presented as one path, not the only path.
- [x] Move mock data into `apps/admin/src/api/mock/`.
- [x] Move global Pinia stores into `apps/admin/src/stores/`.
- [x] Normalize mock API shapes inside API adapters instead of making `api/mock` import module types.
- [x] Remove `*.service.ts` files in favor of `apps/admin/src/api/*.api.ts`.

## Phase 3: Verification

- [x] Run targeted tests for changed API adapter/query modules.
- [x] Run `pnpm -r test`.
- [x] Run `pnpm -r typecheck`.
- [x] Run `pnpm -r lint`.
- [x] Start the local admin app.
- [x] Browser-check changed routes:
  - [x] Dashboard
  - [x] Workbench
  - [x] Access
  - [x] Users smoke check if touched
- [x] Verify representative profile/mode/layout combinations:
  - [x] Crypto dark
  - [x] Crypto light
  - [x] Industrial light
  - [x] Industrial dark
  - [x] tri-column
  - [x] dual-column
  - [x] top-header
- [x] Confirm loading/error/empty/normal states render cleanly where implemented.

## Phase 4: Finish

- [x] Load `trellis-check` before claiming implementation complete.
- [x] Review whether `.trellis/spec/` needs durable updates.
- [x] Keep `00-bootstrap-guidelines` active and unmodified unless the user explicitly requests otherwise.
- [ ] Prepare and confirm a commit plan after implementation and verification.

## Verification Evidence

- TDD red step passed: `pnpm --filter @super-admin/admin test` failed because the first adapter functions did not exist.
- Targeted green step passed: `pnpm --filter @super-admin/admin test`.
- Targeted typecheck passed: `pnpm --filter @super-admin/admin typecheck`.
- Full verification passed:
  - `pnpm -r test`
  - `pnpm -r typecheck`
  - `pnpm -r lint`
  - `pnpm --filter @super-admin/admin build`
- Browser QA passed on `http://127.0.0.1:5174/`:
  - `/examples/dashboard` with `crypto.dark` + `tri-column`
  - `/examples/workbench` with `crypto.light` + `tri-column`
  - `/examples/access` with `industrial.light` + `dual-column`
  - `/examples/dashboard` with `industrial.dark` + `top-header`
  - `/examples/users/all` smoke check with `crypto.dark` + `tri-column`
- Browser QA confirmed expected text present and no horizontal or major element overflow in the checked states.
- Spec update review first found no changes needed, then user feedback clarified a durable rule: example module types are not universal API/page contracts. Updated `.trellis/spec/frontend/api-adapters.md` and `.trellis/spec/frontend/data-and-query.md`.
- Review feedback follow-up corrected API-adapter-only replacement wording: examples now say users may reshape page/components, types, query params, and API adapter together when business workflows differ.
- Directory follow-up moved mock API data into `apps/admin/src/api/mock/` and global Pinia stores into `apps/admin/src/stores/`; updated frontend directory and API adapter specs to match.
- Normalization follow-up decoupled `api/mock` from module types. Mock files now own API-like field names, while API adapters normalize them into module frontend types.
- Service-layer follow-up removed module `*.service.ts` files and replaced them with `apps/admin/src/api/*.api.ts` adapters.
- Post-pivot verification passed after removing the service-layer concept:
  - `pnpm -r test` — 4 workspace projects, 9 test files, 36 tests passed.
  - `pnpm -r typecheck` — core, ui, theme, and admin passed.
  - `pnpm -r lint` — core, ui, theme, and admin passed.
  - `pnpm --filter @super-admin/admin build` — Vite production build passed.
  - Browser smoke check on `http://127.0.0.1:5174/` passed for `/examples/dashboard`, `/examples/workbench`, `/examples/access`, and `/examples/users/all`; checked page content, no horizontal overflow, and no console errors.

## Acceptance Criteria

- Dashboard, Workbench, and Access demonstrate typed API adapter/query/mock boundaries.
- Mock data is centralized under `apps/admin/src/api/mock/`.
- `api/mock` does not import module types; API adapters normalize mock records.
- Global Pinia stores live under `apps/admin/src/stores/`.
- Replacing each module API adapter with a real API call is obvious when the example screen fits.
- Reshaping a module page, components, types, query params, and API adapter together is explicitly allowed when real business workflows differ.
- Pages remain frontend-first composition surfaces.
- Shared UI primitives are consumed where appropriate.
- No backend/API/auth/database/AI/CLI requirement is introduced.
- Typecheck, lint, tests, and browser QA pass before completion.
