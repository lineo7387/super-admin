# Implementation Plan

- [x] Update `publish-next.yml`.
  - [x] Add pnpm cache settings under the existing `actions/setup-node` step.
  - [x] Add an overall `timeout-minutes` to the `publish-next` job.
  - [x] Add `timeout-minutes` to the `Publish selected packages` step.

- [x] Filter unregistered standalone manifests from generated starters.
  - [x] Add the four unregistered manifest paths to `packages/cli/src/generate-starter.ts` skip logic.
  - [x] Mirror the same skip list in `scripts/build-cli-template.mjs` so packed runtime templates match source-root generation.
  - [x] Rebuild or otherwise refresh `packages/cli/dist/starter-template/admin` if the repository expects generated dist/template artifacts to be committed.

- [x] Strengthen tests/validation.
  - [x] Update `packages/cli/src/generate-starter.test.mjs` default starter assertions so the four dead manifest files are absent.
  - [x] Assert `examples.manifest.ts` and `ui-kit.manifest.ts` remain present.
  - [x] Add validator coverage only if it fits the existing static contract without broad refactor.

- [x] Verify.
  - [x] Run `pnpm --filter create-super-admin test`.
  - [x] Run `pnpm validate:starter` if feasible.
  - [x] Report any skipped verification with the exact reason.

- [x] Return implementation evidence for audit.
  - [x] Changed file list.
  - [x] Test/validation commands and results.
  - [x] Any deviations from the PRD or plan.
