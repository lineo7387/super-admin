# Changelog

All notable changes will be documented in this file.

This project is in active `0.x` development after its initial npm release. Package-level changelogs live in publishable package directories; this root changelog records repository-level changes.

## Unreleased

## 0.2.0 - 2026-07-18

- Added source-readable extension contracts through immutable module-manifest composition, typed layout/auth registries, duplicate detection, and neutral fallbacks.
- Made the generated `standard` starter quality baseline executable by default with ESLint, Vitest, typecheck/build/check scripts, capability-aware AI context, and an explicit `--minimal` opt-out.
- Published the dependency-aware npm release set and promoted it after registry smoke: `create-super-admin@0.2.0`, `@super-admin-org/core@0.2.0`, `@super-admin-org/ui@0.1.6`, `@super-admin-org/theme@0.1.5`, and all theme profile packages at `0.1.4`.

## 0.1.9 - 2026-07-12

- Fixed generated command-palette and keyboard-shortcut contracts so theme, display-mode, and locale actions remain available without intercepting ordinary input editing.
- Refactored `create-super-admin` to derive generated starters from `apps/admin` as the single source of truth, with equivalence checks across source, built template, and packed CLI output.
- Published `create-super-admin@0.1.9` to npm `next` and promoted the smoke-verified package to `latest`; package-specific details remain in `packages/cli/CHANGELOG.md`.
