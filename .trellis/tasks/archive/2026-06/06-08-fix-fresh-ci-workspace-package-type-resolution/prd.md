# Fix Fresh CI Workspace Package Type Resolution

## Goal

Make GitHub CI and `pnpm release check` pass from a fresh checkout after publishable workspace packages switched to package exports that point at generated `dist` artifacts.

## What I Already Know

- GitHub Actions run `27126330865` failed on the `CI` workflow after a push to `main`.
- The failed job was `checks`; the `Lint` step failed before typecheck, test, build, and docs build ran.
- The reported failure was `Cannot find module '@super-admin-org/core' or its corresponding type declarations.`
- Local `pnpm lint` can pass after a previous build because `packages/core/dist/index.d.ts` exists locally.
- Publish candidate manifests export package types from `./dist/index.d.ts`, so fresh checkouts need package build artifacts before cross-package lint/type resolution.

## Assumptions

- The CI failure is caused by validation order, not by npm registry state.
- Registry-mutating commands remain out of scope for this task.
- Keeping publish manifests pointed at `dist` is intentional because package consumers should receive built artifacts.

## Requirements

- CI must build publishable workspace packages before running lint/typecheck in a fresh checkout.
- `pnpm release check` must use the same fresh-checkout-safe ordering as CI and `Publish next`.
- Release/monorepo spec must capture the rule so future edits do not reintroduce a local-cache-only check.
- Avoid unrelated package manifest or dependency policy changes.

## Acceptance Criteria

- [ ] A fresh checkout can run install, build, and lint without `@super-admin-org/core` type resolution failures.
- [ ] `pnpm release check` passes.
- [ ] `.github/workflows/ci.yml` no longer runs lint before build.
- [ ] `.trellis/spec/shared/monorepo.md` documents the build-before-static-checks requirement for release automation.

## Out of Scope

- Running `npm publish`, `npm trust`, `npm dist-tag`, `npm stage`, or other registry-mutating commands.
- Changing release channel/version policy.
- Publishing the `0.1.0` release.

## Technical Notes

- Relevant files: `.github/workflows/ci.yml`, `scripts/release.mjs`, `.trellis/spec/shared/monorepo.md`.
- `publish-next.yml` runs `pnpm release check`, so fixing the release check order also protects the manual publish workflow.
