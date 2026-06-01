# Template Integration Docs with VitePress Plan

## Scope

Install and configure a first VitePress documentation site for the frontend-first Super Admin template. The docs should describe the current runnable template and integration seams, not implement backend/API/CLI work.

## Phase 1: Planning

- [x] Create the Trellis task.
- [x] Link it to `05-31-roadmap-backend-api-scaffold-followups`.
- [x] Set scope to `frontend`.
- [x] Inspect current package/docs state.
- [x] Write `prd.md`.
- [x] Write `info.md`.
- [x] Write this implementation plan.
- [x] Activate the task with `task.py start`.

## Phase 2: Implementation

- [x] Load `trellis-before-dev` before editing code.
- [x] Re-read active task docs and relevant specs.
- [x] Install VitePress as a root dev dependency.
- [x] Add root scripts:
  - [x] `docs:dev`
  - [x] `docs:build`
  - [x] `docs:preview`
- [x] Add `docs/.vitepress/config.ts`.
- [x] Add docs homepage and guide pages:
  - [x] `docs/index.md`
  - [x] `docs/guide/getting-started.md`
  - [x] `docs/guide/project-structure.md`
  - [x] `docs/guide/api-adapters.md`
  - [x] `docs/guide/themes-layouts.md`
  - [x] `docs/guide/examples.md`
  - [x] `docs/guide/optional-backend.md`
- [x] Keep all docs aligned with current repository facts.
- [x] Do not add backend/API contract/auth/database/AI/CLI implementation.
- [x] Do not document nonexistent CLI commands as available.

## Phase 3: Verification

- [x] Run `pnpm docs:build`.
- [x] Run relevant repo checks after dependency/script changes.
- [x] Start `pnpm docs:dev`.
- [x] Browser-check the docs homepage and key guide pages.
- [x] Confirm no docs copy introduces a hidden backend/auth/database/AI/CLI requirement.

## Phase 4: Finish

- [x] Load `trellis-check` before claiming implementation complete.
- [x] Review whether `.trellis/spec/` needs durable updates.
- [x] Keep `00-bootstrap-guidelines` active and unmodified unless the user explicitly requests otherwise.
- [ ] Prepare and confirm a commit plan after implementation and verification.

## Verification Evidence

- Installed VitePress as a root dev dependency with `pnpm add -D vitepress -w`.
- `pnpm docs:build` passed.
- Repository checks passed:
  - `pnpm -r test`
  - `pnpm -r typecheck`
  - `pnpm -r lint`
  - `pnpm build`
- Browser QA passed on `http://127.0.0.1:5174/` for:
  - `/`
  - `/guide/getting-started`
  - `/guide/project-structure`
  - `/guide/api-adapters`
  - `/guide/themes-layouts`
  - `/guide/examples`
  - `/guide/optional-backend`
- Browser QA confirmed no horizontal overflow or console errors on checked docs pages.
- Spec update review found one durable convention and updated `.trellis/spec/shared/monorepo.md` to include `docs/` and root docs scripts.

## Acceptance Criteria

- VitePress docs site exists and builds.
- Docs give a new user a clear path to run and understand the frontend template.
- Docs explain API adapter replacement without forcing a backend schema.
- Docs clearly mark backend/auth/database/AI/CLI as optional or future surfaces.
- Repository checks pass before completion.
