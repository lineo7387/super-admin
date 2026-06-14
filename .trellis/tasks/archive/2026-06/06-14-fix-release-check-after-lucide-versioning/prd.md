# Fix Release Check After Lucide Versioning

## Goal

Reproduce and fix the `pnpm release check` failure that appeared after versioning the lucide dependency migration release.

## What I Already Know

* The user already pushed the previous work, then ran release/versioning steps locally.
* Current working tree has release-version changes:
  * deleted `.changeset/soft-rockets-wink.md`
  * modified `packages/cli/CHANGELOG.md`
  * modified `packages/cli/package.json`
  * modified `packages/cli/src/package-version-ranges.generated.ts`
  * modified `packages/ui/CHANGELOG.md`
  * modified `packages/ui/package.json`
* No active Trellis task existed at the start of this debugging task.

## Requirements

* Re-run `pnpm release check` to capture the exact failure.
* Investigate root cause before changing files.
* Preserve the user's release-version changes unless the root cause requires an intentional update.
* Fix the release gate failure.
* Re-run `pnpm release check` and any targeted checks needed to prove the fix.
* Record findings and verification in this task.

## Acceptance Criteria

* [x] Failure is reproduced or enough evidence is captured to explain why it no longer reproduces.
* [x] Root cause is identified and recorded.
* [x] Fix is implemented if needed.
* [x] `pnpm release check` passes after the fix.
* [x] Working tree changes are clearly classified for commit.

## Definition of Done

* No speculative fixes.
* Release automation/spec constraints remain intact.
* Task notes contain failure, root cause, fix, and verification evidence.

## Out of Scope

* Publishing to npm.
* Running GitHub Actions.
* Reverting release-version changes unless they are proven to be the root cause and the user approves or the release flow requires it.

## Findings

`pnpm release check` reproduced the failure in `scripts/npm-registry-release-commands.test.mjs`.
The failing assertion expected `npm dist-tag add create-super-admin@0.1.2 latest`, but after `pnpm release version` the current `packages/cli/package.json` version is `0.1.3`, so the command printer correctly emitted `create-super-admin@0.1.3`.

Root cause: the test asserted a historical package version even though `scripts/npm-registry-release-commands.mjs` intentionally reads current publish candidate manifests.

## Fix

Updated `scripts/npm-registry-release-commands.test.mjs` so the CLI promote-latest assertion reads the current version from `packages/cli/package.json`.
This keeps the test focused on command shape and package selection while allowing normal release version bumps.

Updated `.trellis/spec/shared/monorepo.md` with the durable rule that release command output tests must derive mutable package versions from manifests or release plans.

## Verification

* `pnpm vitest run scripts/npm-registry-release-commands.test.mjs` passed.
* `pnpm release check` passed, including build, lint, typecheck, tests, and `validate:publish` starter smoke.
* After the spec note was added, `pnpm vitest run scripts/npm-registry-release-commands.test.mjs` passed again.

## Change Classification

* Release-version changes present before this fix are preserved: `.changeset/soft-rockets-wink.md`, `packages/cli/CHANGELOG.md`, `packages/cli/package.json`, `packages/cli/src/package-version-ranges.generated.ts`, `packages/ui/CHANGELOG.md`, and `packages/ui/package.json`.
* This task's code fix is `scripts/npm-registry-release-commands.test.mjs`.
* This task's spec update is `.trellis/spec/shared/monorepo.md`.
