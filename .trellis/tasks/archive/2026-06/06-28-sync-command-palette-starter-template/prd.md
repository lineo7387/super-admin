# Sync Command Palette Starter Template

## Goal

Keep the `create-super-admin` generated starter aligned with the source admin app after the command palette feature landed, so generated projects typecheck and publish validation can pass again.

## Requirements

* The generated preferences store exposes the command palette runtime state and open/close actions used by generated shell files.
* Command palette locale actions must typecheck when the generated starter includes only the default `zh-CN` locale.
* Add or update CLI regression coverage so template drift is caught before `validate:starter`.
* Preserve the frontend-first generated starter boundary; do not add backend, auth provider, AI provider, or maintainer workflow requirements.

## Acceptance Criteria

* [x] `pnpm --filter create-super-admin test` fails before the template fix and passes after the fix.
* [x] `pnpm --filter create-super-admin test` passes.
* [x] `pnpm validate:starter` passes.
* [x] `pnpm validate:publish` passes or any remaining failure is unrelated and documented.
* [x] No generated starter maintainer workflow files are introduced.

## Definition of Done

* Focused code and test changes only.
* Relevant Trellis/frontend/shared public delivery guidelines consulted.
* Lint/typecheck/test coverage run for the affected package and starter validation path.
* Worktree state reviewed before final summary.

## Technical Approach

Mirror the source admin preferences store command palette state in `packages/cli/src/templates.ts`, then make the generated command palette locale action list derive from installed locales instead of assuming `en-US` is always part of the generated locale union. Add tests around generated source content or generated starter typecheck-sensitive output so this drift is caught earlier.

## Decision (ADR-lite)

**Context**: `pnpm validate:starter` fails on current `main` because generated starter files reference command palette APIs that exist in `apps/admin` but are missing from the CLI template. It also fails when the command palette tries to call `setLocale('en-US')` in a starter whose `Locale` type is only `'zh-CN'`.

**Decision**: Keep the generated starter behavior aligned with the source app, but make locale command actions conditional on installed locale support.

**Consequences**: The generated default starter remains small and single-locale, while i18n-enabled starters can still expose locale switching actions.

## Out of Scope

* CI workflow changes.
* Dependency audit fixes.
* Chunk splitting or performance optimization.
* Broader command palette UX changes.

## Technical Notes

* Failing commands from prior analysis: `pnpm validate:starter`, `pnpm validate:publish`.
* Likely source app reference: `apps/admin/src/stores/preferences.store.ts`.
* Likely template target: `packages/cli/src/templates.ts`.
* Public delivery rule: generated starters must not include maintainer-only AI workflow files or optional backend requirements.
* Verification after fix: `pnpm --filter create-super-admin test`, `pnpm --filter create-super-admin typecheck`, `pnpm --filter create-super-admin lint`, `pnpm validate:starter`, `pnpm validate:publish`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
* Known remaining warnings outside this task: generated starter and admin builds still report large chunk warnings; generated starter builds also report Rolldown `INVALID_ANNOTATION` warnings from transitive `@vueuse/core`.
* Spec update: `.trellis/spec/shared/monorepo.md` now calls out generator tests for copied/transformed shell files across default and i18n variants.
