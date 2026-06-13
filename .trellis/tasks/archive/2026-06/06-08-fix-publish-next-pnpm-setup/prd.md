# Fix Publish Next pnpm Setup

## Goal

Make the `Publish next` GitHub Actions workflow install dependencies successfully after upgrading npm for Trusted Publishing.

## What I Already Know

- The approved `Publish next` workflow dispatch was accepted by GitHub.
- Run `27137076615` failed before any npm publish step.
- The failed step was `Install dependencies`.
- Logs show `corepack prepare pnpm@10.33.0 --activate` ran, but the next step failed with `pnpm: command not found`.
- All publish steps were skipped, so no `0.1.0` packages were published by that run.

## Requirements

- Ensure `pnpm@10.33.0` is available in `publish-next.yml` before `pnpm install --frozen-lockfile`.
- Keep modern npm installation for Trusted Publishing.
- Do not run local `npm publish`, `npm trust`, `npm dist-tag`, or other registry-mutating commands.
- After the workflow fix is pushed, require explicit human approval before triggering another publish workflow run.

## Acceptance Criteria

- [ ] `publish-next.yml` installs or sets up `pnpm@10.33.0` in a way that survives the modern npm upgrade.
- [ ] Local release gate still passes.
- [ ] CI passes after pushing the workflow fix.
- [ ] No publish workflow is retried without explicit approval.

## Out of Scope

- Changing release version/tag policy.
- Publishing locally from this machine.
- Promoting `latest`.

## Technical Notes

- Relevant file: `.github/workflows/publish-next.yml`.
- Existing CI workflow uses a separate pnpm setup action successfully; publish workflow currently relies on Corepack after npm is replaced.
