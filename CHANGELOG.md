# Changelog

All notable changes will be documented in this file.

This project is in active `0.x` development after its initial npm release. Package-level changelogs live in publishable package directories; this root changelog records repository-level changes.

## Unreleased

- Aligned public repository docs with the current post-initial-release state.
- Added public repository delivery guardrails for future AI-assisted work.
- Improved maintainer starter/reference validation entry points.
- Added open-source project governance docs.
- Added project-level CodeGraph MCP configuration for maintainers.
- Continued reference backend and admin adapter validation work.

## 0.1.9 - 2026-07-12

- Fixed generated command-palette and keyboard-shortcut contracts so theme, display-mode, and locale actions remain available without intercepting ordinary input editing.
- Refactored `create-super-admin` to derive generated starters from `apps/admin` as the single source of truth, with equivalence checks across source, built template, and packed CLI output.
- Published `create-super-admin@0.1.9` to npm `next` and promoted the smoke-verified package to `latest`; package-specific details remain in `packages/cli/CHANGELOG.md`.
