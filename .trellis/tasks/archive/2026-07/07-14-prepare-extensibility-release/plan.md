# Implementation plan

## 1. Prepare branch and baseline

- [x] Create `codex/release-extensibility-0-2` from synchronized `main`.
- [x] Confirm the pending Changeset bump set and current registry versions.
- [x] Record baseline release selection for `@super-admin-org/core,@super-admin-org/ui,create-super-admin`.

## 2. Generate release artifacts

- [x] Run `pnpm release version` once.
- [x] Verify all nine package versions match the approved matrix.
- [x] Verify internal dependency ranges, lockfile metadata, and generated CLI starter dependency ranges.
- [x] Audit generated changelog prose and confirm the pending Changeset was consumed.
- [x] Confirm no public docs falsely claim the unpublished versions are already available.

## 3. Verify release readiness

- [x] Run the post-version dependency-aware release plan and record its confirmation text.
- [x] Run the unpublished-version preflight for the changed roots.
- [x] Run `pnpm release check`.
- [x] Run `pnpm format:check` and `pnpm docs:build` if not already covered by the release gate.
- [x] Inspect `git diff --check`, final diff scope, and worktree artifacts.

## 4. Review and delivery

- [x] Load `trellis-check`, fix any findings, and repeat affected gates.
- [x] Review whether the release task produced reusable spec knowledge; update specs only when needed.
- [ ] Commit release artifacts using project Conventional Commit rules.
- [ ] Archive the Trellis task and record the session.
- [ ] Run the project push/PR flow, create the release-prep PR, and wait for CI.
- [ ] Stop without triggering `Publish next`, npm publish, registry smoke, or `latest` promotion.

## Verification evidence

- Versions: core/CLI `0.2.0`; UI `0.1.6`; theme runtime `0.1.5`; every theme profile `0.1.4`.
- Dependency propagation: theme runtime/profiles require `@super-admin-org/core@^0.2.0`; generated CLI ranges match every target package version.
- Changelogs: direct releases contain one readable prose entry; propagated theme releases contain only the expected core dependency update.
- Release roots: `@super-admin-org/core,@super-admin-org/ui,create-super-admin` expand to all nine intended publish candidates.
- Workflow confirmation: `publish-super-admin-next-core-0.2.0-theme-0.1.5-theme-base-0.1.4-theme-crypto-0.1.4-theme-cyberpunk-0.1.4-theme-industrial-0.1.4-theme-newsprint-0.1.4-ui-0.1.6-create-super-admin-0.2.0`.
- Unpublished-version preflight passed on 2026-07-18.
- Full non-registry gate: `pnpm release check` passed on 2026-07-18, including build, lint, typecheck, 342 repository tests, package packing, and default/multi-theme+i18n/ECharts/minimal starter validation.
- Supplemental gates: `pnpm format:check`, `pnpm docs:build`, and `git diff --check` passed.
- Post-version `pnpm changeset status` exits with the expected consumed-changeset diagnostic; no empty Changeset was added.
- Trellis spec review: no new reusable rule was discovered. `.trellis/spec/shared/monorepo.md` already captures version propagation, changelog audit, unpublished preflight, full release gate, and the expected post-version Changesets diagnostic.
