# Add unified release automation

## Goal

Make Super Admin's publish workflow easier and safer to run by automating lockstep package versioning, unifying pre-release checks behind one command family, adding lightweight npm publish guards, and documenting the future maintainer release path.

## What I Already Know

- The user approved the recommended direction: Changesets for version/changelog automation, a unified `pnpm release ...` entrypoint, lightweight `prepublishOnly` guards, and a release guide.
- Publish candidates remain:
  - `@super-admin-org/core`
  - `@super-admin-org/ui`
  - `@super-admin-org/theme`
  - `@super-admin-org/theme-base`
  - `@super-admin-org/theme-crypto`
  - `@super-admin-org/theme-cyberpunk`
  - `@super-admin-org/theme-industrial`
  - `@super-admin-org/theme-newsprint`
  - `create-super-admin`
- Root `super-admin`, `@super-admin/admin`, and `@super-admin/api` are not published.
- Prior work added pack/install validation, bootstrap tarball prep, command printing, and GitHub Actions publish-to-next workflow.
- Registry-mutating actions must remain explicit and phase-approved.
- The current workflow confirmation text is hard-coded to `0.1.0`; future releases should not require editing the workflow just to change that string.

## Research References

- [`research/release-automation.md`](research/release-automation.md) — npm lifecycle hooks are useful for lightweight publish guards; Changesets is a better fit for monorepo version/changelog automation; dist-tag promotion remains a separate explicit phase.

## Requirements

- Add Changesets configuration for the 9 publish candidates.
- Keep publish candidates lockstep-versioned.
- Ignore private/non-publish workspaces in release automation.
- Add a unified `pnpm release ...` command surface:
  - `pnpm release check` runs the full non-registry release gate.
  - `pnpm release version` runs version/changelog automation and updates lockfile metadata.
  - `pnpm release bootstrap:prepare` runs the release check and prepares bootstrap tarballs.
  - `pnpm release commands <phase>` prints registry-mutating commands for `bootstrap`, `trust`, `publish-next`, `promote-latest`, or `all`.
  - `pnpm release assert-workflow-confirm <text>` validates GitHub Actions manual confirmation text against the current package version.
- Keep `pnpm validate:publish` available as the lower-level pack/install validation command.
- Add package-level `prepublishOnly` guards for publish candidates.
- The guard must allow the explicit local bootstrap publish path for `0.0.0-bootstrap.0` with `--tag bootstrap`.
- The guard must block normal local publishes outside GitHub Actions.
- The guard must permit normal publishes only from the expected GitHub Actions workflow with `--tag next`.
- The guard must verify required build artifacts exist before publish.
- The guard must reject publish candidate manifests that expose `workspace:` dependency ranges.
- Update `.github/workflows/publish-next.yml` to use the unified release check and dynamic confirmation validation.
- Add user-facing release documentation under `docs/guide/`.
- Tests must cover the release guard and version/confirmation helpers.

## Acceptance Criteria

- [x] A maintainer can run a single local command to execute the full non-registry release gate.
- [x] A maintainer can run one command to apply Changesets-managed package version/changelog updates.
- [x] GitHub Actions no longer hard-codes the release version in the job-level condition.
- [x] Normal local `npm publish` for publish candidates is blocked by `prepublishOnly` guard.
- [x] Explicit bootstrap publish path remains possible after tarball preparation.
- [x] Release command printer still does not execute registry-mutating commands.
- [x] Release docs explain first-time bootstrap/trust/publish/promote and later update releases.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and release validation pass.

## Verification Evidence

Fresh verification on 2026-06-07:

- `pnpm exec vitest run scripts/release.test.mjs scripts/prepublish-guard.test.mjs`
- `pnpm release assert-workflow-confirm publish-super-admin-next-0.1.0`
- `pnpm release commands promote-latest`
- `pnpm release commands next`
- `pnpm release check`
- `pnpm docs:build`
- `node scripts/prepare-npm-bootstrap.mjs`

## Definition Of Done

- Changesets config and package manager scripts are added.
- Unified release scripts are tested.
- Publish candidate package scripts include the lightweight guard.
- GitHub workflow uses the unified release check and dynamic confirmation validation.
- Release docs are written.
- No registry-mutating commands are executed during implementation.

## Out Of Scope

- Actually publishing to npm.
- Actually configuring Trusted Publishing.
- Actually promoting `latest`.
- Replacing GitHub Trusted Publishing with token-based publishing.
- Automating rollback/unpublish.
- Supporting npm/yarn/bun generated starter release validation parity in this task.

## Technical Notes

- Existing implementation files:
  - `scripts/publish-readiness.mjs`
  - `scripts/prepare-npm-bootstrap.mjs`
  - `scripts/npm-registry-release-commands.mjs`
  - `.github/workflows/publish-next.yml`
  - package manifests under `packages/*/package.json`
- Relevant specs:
  - `.trellis/spec/shared/cli-starter-contract.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/shared/typescript.md`
  - `.trellis/spec/shared/code-quality.md`
