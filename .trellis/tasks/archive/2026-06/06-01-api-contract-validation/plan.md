# API Contract Validation Plan

## Scope

Plan and implement frontend-facing API contract validation for the existing Super Admin template. This task defines the contract vocabulary and optional helper surfaces that later reference backend and CLI work can validate or generate from.

## Phase 1: Planning

- [x] Create the Trellis task.
- [x] Link it to `05-31-roadmap-backend-api-scaffold-followups`.
- [x] Set scope to `frontend`.
- [x] Read the parent roadmap `prd.md` and `info.md`.
- [x] Read current API adapter/data/type specs.
- [x] Inspect current adapter tests and module types.
- [x] Write `prd.md`.
- [x] Write `info.md`.
- [x] Write this implementation plan.
- [x] Research Zod vs Valibot vs TypeScript-only helpers.
- [x] Confirm MVP direction with the user before activation.
- [x] Activate the task with `task.py start`.

## Phase 2: Research

- [x] Compare Zod, Valibot, and TypeScript-only helper contracts for:
  - [x] bundle/dependency weight
  - [x] ecosystem compatibility
  - [x] OpenAPI/form resolver fit
  - [x] adapter normalization ergonomics
  - [x] suitability before reference backend exists
- [x] Persist findings under `research/`.
- [x] Update `info.md` with the chosen first-pass approach.

## Phase 3: Implementation

- [x] Load `trellis-before-dev` before editing code.
- [x] Re-read active task docs, research, and relevant specs.
- [x] Define contract vocabulary in `.trellis/spec/`:
  - [x] list result
  - [x] page pagination
  - [x] cursor pagination
  - [x] filters and sorting
  - [x] mutation result
  - [x] field errors
  - [x] adapter errors
  - [x] permission/capability metadata
  - [x] unavailable/not-configured states
- [x] Add typed helpers/tests only if they improve consistency without creating a generic CRUD DSL.
- [x] Align current example adapters with contract guidance where useful.
- [x] Update VitePress docs if user-facing guidance changes.
- [x] Keep backend/auth/database/AI/CLI out of scope.
- [x] Keep real user API shapes flexible; adapters normalize into frontend module types.
- [x] Preserve open-source extensibility and UI-only adoption in the written contract guidance.

## Phase 4: Verification

- [x] Run targeted tests for changed helpers/adapters/spec examples.
- [x] Run `pnpm -r test`.
- [x] Run `pnpm -r typecheck`.
- [x] Run `pnpm -r lint`.
- [x] Run relevant build/docs checks if docs or package scripts change.
- [x] Browser-check docs only if user-facing docs change.
- [x] Confirm no hidden backend requirement was introduced.

## Phase 5: Finish

- [x] Load `trellis-check` before claiming implementation complete.
- [x] Review whether additional `.trellis/spec/` updates are needed.
- [x] Keep `00-bootstrap-guidelines` active and unmodified unless the user explicitly requests otherwise.
- [x] Prepare and confirm a commit plan after implementation and verification.

## Acceptance Criteria

- Contract validation strategy is documented.
- Durable API adapter contract guidance exists in `.trellis/spec/`.
- Any helper code is typed, tested, and small.
- Existing examples remain frontend-first and mock-backed.
- Docs stay honest about backend/API/CLI availability.
- Verification passes before completion.
