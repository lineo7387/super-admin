# Fix registry smoke for Stage Manager starter release set

## Goal

Repair the `create-super-admin@next` release after registry smoke showed that the published CLI starter depends on an already-published `@super-admin-org/core@0.1.2` contract that does not include `stageManager.railEnabled`. Publish a forward patch release to `next` only, then rerun registry smoke before any `latest` promotion.

## Requirements

- Do not unpublish or mutate `latest`.
- Do not reuse `create-super-admin@0.1.5`; npm versions are immutable.
- Version the package set that owns the Stage Manager preference contract, not only the CLI.
- Keep generated starter dependency ranges package-specific and aligned with current package manifests.
- Keep generated starter output frontend-first, mock-backed, and free of maintainer tooling.
- Trigger GitHub `Publish next` only after local release checks pass and commits are pushed.

## Acceptance Criteria

- [ ] `pnpm release plan --changed @super-admin-org/core,create-super-admin` selects `@super-admin-org/core`, `@super-admin-org/theme`, all `@super-admin-org/theme-*` packages, and `create-super-admin`.
- [ ] `packages/cli/src/package-version-ranges.generated.ts` uses the new package-specific `@super-admin-org/*` ranges.
- [ ] CLI generator tests do not hard-code stale package versions that should follow manifests.
- [ ] `pnpm release check` passes locally.
- [ ] GitHub `Publish next` workflow succeeds for the corrected release set.
- [ ] Registry smoke from `create-super-admin@next` succeeds before any `latest` promotion.

## Definition of Done

- Changeset/version/changelog/lockfile updates are committed and pushed.
- `next` points to a smoke-verified fixed release.
- `latest` remains unchanged until separately approved.
- Any learned release guardrail is captured in `.trellis/spec/` if not already documented.

## Out of Scope

- Promoting `latest`.
- Unpublishing or deprecating `create-super-admin@0.1.5`.
- Refactoring Stage Manager UI behavior.
- Changing generated starter runtime beyond version/range metadata needed for the fix.

## Technical Notes

- Failed command:
  `pnpm dlx create-super-admin@next starter-default --theme base --pm pnpm` followed by `node scripts/validate-generated-starter.mjs <starter> --theme base --pm pnpm`.
- Failure:
  `Property 'railEnabled' does not exist on type '{ enabled: boolean; presentationMode: StageManagerPresentationMode; }'.`
- Root cause:
  local `pnpm release check` validated the packed local core artifact, while registry smoke installed npm `@super-admin-org/core@0.1.2`, whose published declaration contract is older.
- Relevant specs:
  `.trellis/spec/shared/monorepo.md`
  `.trellis/spec/shared/public-delivery.md`
  `.trellis/spec/shared/cli-starter-contract.md`
  `.trellis/spec/frontend/app-shell.md`
