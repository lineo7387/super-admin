# Implementation Plan

- [x] Add regression tests for generated `AI_CONTEXT.md`, README linkage, and starter validation.
- [x] Implement generated `AI_CONTEXT.md` in CLI templates and root writer.
- [x] Update generated `vite.config.ts` template and monorepo admin Vite config with low-risk chunk grouping.
- [x] Dynamic-load heavy shell runtime surfaces from `AppShell.vue` without changing visible behavior.
- [x] Run focused tests and full quality gates: `pnpm lint`, `pnpm test`, `pnpm validate:starter`, `pnpm build`, `pnpm docs:build`.
- [x] Review whether any spec updates are needed after implementation.

## Audit Follow-up: Release Hardening

- [x] Add regression coverage for release-version preflight and CI starter-contract enforcement.
- [x] Add the pending `create-super-admin` patch changeset for the generated AI context release.
- [x] Fail publish planning early when a selected package version already exists on npm.
- [x] Run `pnpm validate:starter` in CI so packed starter regressions cannot merge unnoticed.
- [x] Run focused and full release verification, update durable specs, and prepare the hardening work for commit.
