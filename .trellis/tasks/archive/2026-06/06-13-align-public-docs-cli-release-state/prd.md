# Align public docs with CLI release state

## Goal

Update public-facing project documentation so it reflects the current `create-super-admin` CLI and release automation state after the independent, dependency-aware release model work. The docs should no longer describe CLI generation or release validation as future-only when the repository already contains those packages, scripts, and release docs.

## What I already know

- Git is on `main`, aligned with `origin/main`, and the working tree was clean before task creation.
- There was no active Trellis task before this task was created.
- Recent journal Session 28 records the independent release model work with commits `b318d40` and `d6d3e4a`.
- Recent journal Session 29 records the Chinese communication rule with commits `f09b643` and `b6373f9`.
- The independent release model work is part of the archived `06-08-fix-publish-next-pnpm-setup` task, which is completed.
- `docs/guide/releasing.md` and `.trellis/spec/shared/monorepo.md` already describe the dependency-aware release model and registry mutation safety rules.
- `package.json` exposes release scripts including `release:check`, `release:version`, `release:bootstrap:prepare`, and `release:commands`.
- Publish candidates exist under `packages/*` and are currently versioned at `0.1.2`.
- The user explicitly prohibited registry-mutating commands: no `npm publish`, `npm trust`, `npm dist-tag`, `npm stage`, and no `Publish next` workflow trigger without explicit approval.

## Requirements

- Align stale public docs with the current CLI and release automation state.
- Keep the default scaffold boundary clear: frontend-first, mock-backed, no backend/database/auth/AI/generated schema required.
- Present `create-super-admin` as an available maintained package/CLI surface without implying users must adopt it to use the repository.
- Keep release documentation safety intact: release commands may print registry-mutating commands, but this task must not run any registry-mutating command.
- Preserve the Chinese communication rule for user-facing session communication; documentation language may remain consistent with existing docs unless the touched page already uses Chinese.

## Acceptance Criteria

- [x] `README.md` no longer says CLI generation and release validation are future-only.
- [x] `docs/index.md` no longer describes CLI scaffolding as only optional/future when it is now present.
- [x] `docs/guide/open-source-workflow.md` no longer says the project is simply "not npm-ready yet" with a stale pre-CLI release path.
- [x] `docs/guide/optional-backend.md` no longer says the CLI is planned but unavailable.
- [x] Updated docs continue to say backend, database, auth provider, AI provider, and optional reference backend are not required for the default scaffold.
- [x] No npm registry-mutating commands or GitHub publish workflows are run.
- [x] Documentation checks are run where appropriate, at minimum `pnpm docs:build`.

## Definition of Done

- Public docs are internally consistent with current CLI/release state.
- Trellis task files describe the scope and constraints.
- Relevant documentation build/check command has been run and reported.
- No publish, trust, dist-tag, stage, or `Publish next` action was executed.

## Technical Approach

Make a focused docs-only pass across the stale status pages found during repo inspection:

- `README.md`
- `docs/index.md`
- `docs/guide/open-source-workflow.md`
- `docs/guide/optional-backend.md`

Use `docs/guide/releasing.md`, `.trellis/spec/shared/monorepo.md`, current `package.json` scripts, and `packages/*/package.json` manifests as the source of truth. Avoid duplicating the full release guide in overview docs; link or summarize instead.

## Decision (ADR-lite)

**Context**: The release system has moved from future planning to implemented CLI/release automation, but several public overview docs still carry pre-release wording.

**Decision**: Update public overview docs to describe the CLI/release surface as available maintainer infrastructure while keeping the default scaffold optional and frontend-first.

**Consequences**: The docs become less misleading for users and future AI sessions. This task intentionally does not publish packages, trigger workflows, or change release policy.

## Out of Scope

- Running `npm publish`, `npm trust`, `npm dist-tag`, `npm stage`, or any other registry-mutating command.
- Triggering the GitHub `Publish next` workflow.
- Changing release policy, package versions, Changesets config, publish workflow behavior, or package code.
- Rewriting the full documentation site structure.
- Claiming that users must use the CLI or release tooling for normal local development.

## Technical Notes

- Relevant task: `.trellis/tasks/archive/2026-06/06-08-fix-publish-next-pnpm-setup/`
- Relevant docs/spec sources:
  - `docs/guide/releasing.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/shared/git-conventions.md`
  - `.trellis/spec/frontend/index.md`
  - `.trellis/spec/guides/index.md`
- Stale text found in:
  - `README.md`
  - `docs/index.md`
  - `docs/guide/open-source-workflow.md`
  - `docs/guide/optional-backend.md`
- User confirmed the recommended next step with "ok" before this task was created.
- Verification run: `pnpm docs:build` passed.
- Verification run: `pnpm lint` passed.
- Verification run: `pnpm typecheck` passed.
- Verification run: `pnpm test` passed.
- Verification run: `git diff --check` passed.
- Spec update review: no `.trellis/spec/` update needed because this task only aligns public docs with existing CLI/release facts and does not introduce a new reusable implementation contract or convention.
