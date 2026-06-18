# Publish GitHub Release Notes For Latest Npm Release

## Goal

Publish the public GitHub release announcement for the smoke-verified npm `latest` release and update repository-facing presentation docs so GitHub visitors see the real package state.

## Requirements

- Update public presentation docs in both Chinese and English.
- Replace stale `0.1.2` public state guidance with the 2026-06-18 release state:
  - `create-super-admin@0.1.6` on `latest` and `next`.
  - `@super-admin-org/core@0.1.3` on `latest` and `next`.
  - `@super-admin-org/theme` and theme profile packages at `0.1.3` on `latest` and `next`.
  - `@super-admin-org/ui@0.1.4` remains the current UI package line.
- Add release copy suitable for GitHub Release `v0.1.6`.
- Create the GitHub Release after docs are committed and pushed.
- Do not change npm package versions or dist-tags in this task.

## Acceptance Criteria

- [ ] `docs/guide/public-presentation.md` reflects the current npm latest state and suggested release copy.
- [ ] `docs/en/guide/public-presentation.md` matches the Chinese doc semantically.
- [ ] A GitHub Release exists for `v0.1.6`.
- [ ] Release notes mention registry smoke verification for default and multi-theme/i18n starters.
- [ ] Local docs validation passes.
- [ ] Working tree is clean after commit, push, release creation, and Trellis wrap-up.

## Definition of Done

- Docs updated in both locales.
- Relevant docs build/check command passes.
- Work commit is pushed to `origin/main`.
- GitHub Release is created with accurate release notes.
- Trellis task is archived and journal records the session.

## Technical Approach

Update the public presentation guide as the source of truth for GitHub repository polish and release-note copy. Then create a `v0.1.6` GitHub Release from the current `main` after the docs commit.

## Decision (ADR-lite)

**Context**: npm `latest` has moved past the existing GitHub `v0.1.2` release, so GitHub visitors currently see stale release announcements.

**Decision**: Publish `v0.1.6` as the GitHub Release for the current default starter line, while documenting the mixed package versions explicitly because this monorepo uses independent package versions.

**Consequences**: Release notes stay truthful without forcing unrelated packages into artificial lockstep.

## Out of Scope

- Further npm publish or dist-tag changes.
- New GitHub workflow automation for `latest` promotion.
- New screenshots, GIFs, or social preview assets.
- Package code or starter template changes.

## Technical Notes

- `gh release list --limit 20` currently shows only `v0.1.2`.
- `create-super-admin@latest` registry smoke passed for default base starter and `base,cyberpunk` with i18n.
- Relevant specs:
  - `.trellis/spec/shared/public-delivery.md`
  - `.trellis/spec/shared/git-conventions.md`
