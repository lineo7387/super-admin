# Migrate Lucide Vue Dependency

## Goal

Replace deprecated `lucide-vue-next` usage with the maintained `@lucide/vue` package across the source admin app, shared UI package, and generated starter output so new `create-super-admin` users no longer see the npm deprecation warning during install.

## What I Already Know

* The post-release public acceptance audit found that a real generated starter installs successfully, but `pnpm install` warns: `lucide-vue-next@0.555.0` is deprecated and recommends `@lucide/vue`.
* `npm view @lucide/vue` reports `latest: 1.18.0`.
* `npm view lucide-vue-next` reports a deprecation message: `Package deprecated. Please use @lucide/vue instead.`
* Current repository usage includes:
  * `apps/admin/package.json`
  * `packages/ui/package.json`
  * `packages/cli/src/templates.ts`
  * `scripts/validate-generated-starter.test.mjs`
  * Vue imports in `apps/admin/src/**`
  * Vue imports in `packages/ui/src/**`
  * generated starter template import strings in `packages/cli/src/templates.ts`
  * `pnpm-lock.yaml`

## Requirements

* Replace `lucide-vue-next` dependencies with `@lucide/vue`.
* Replace all source and starter-template imports from `lucide-vue-next` to `@lucide/vue`.
* Update generated starter expected dependency tests.
* Refresh the lockfile with pnpm.
* Verify the admin app, UI package, CLI templates, generated starter validation, and normal workspace checks still pass.
* Validate local packed starter generation no longer emits the `lucide-vue-next` deprecation warning.
* Add a changeset so the published `@super-admin-org/ui` and `create-super-admin` packages can move together in the next patch release; the live registry starter path will keep warning until that patch is published.

## Acceptance Criteria

* [x] `rg "lucide-vue-next"` finds no remaining runtime/template/test dependency usage, except historical task/archive notes if any.
* [x] `apps/admin`, `packages/ui`, and generated starter package dependencies use `@lucide/vue`.
* [x] Workspace `pnpm lint` passes.
* [x] Workspace `pnpm typecheck` passes.
* [x] Workspace `pnpm test` passes.
* [x] CLI/starter validation passes.
* [x] Local packed starter validation installs without the `lucide-vue-next` deprecation warning.
* [x] A direct registry-backed starter smoke is documented as expected to keep warning until the next patch release publishes the migrated `@super-admin-org/ui`.

## Definition of Done

* Code and template changes are committed in a focused work commit.
* Any task/archive/journal bookkeeping is committed separately by Trellis finish flow.
* If the migration reveals a new durable project rule, `.trellis/spec/` is updated; otherwise the decision to skip spec update is recorded.

## Technical Approach

Use a direct package rename and import-source replacement. Keep icon component names unchanged unless `@lucide/vue` exposes a different symbol, which will be caught by typecheck/build. Use pnpm to refresh lockfile and then run both workspace checks and registry-like generated starter smoke.

## Decision (ADR-lite)

**Context**: `lucide-vue-next` is deprecated and visibly affects first-run generated starter installation.

**Decision**: Move to the upstream replacement package `@lucide/vue` rather than suppressing warnings or pinning a newer deprecated package version.

**Consequences**: This should remove the deprecation warning for new starters and keep the repo on the maintained icon package. It touches manifests, lockfile, source imports, and starter templates, so generated starter validation is required.

## Out of Scope

* Changing icon choices, UI layout, or visual design.
* Publishing a new npm release in this task.
* Reworking package manager policy or pnpm build-script approval behavior.
* Removing historical references from archived Trellis task notes.

## Technical Notes

* Relevant specs: `.trellis/spec/shared/public-delivery.md`, `.trellis/spec/shared/monorepo.md`, `.trellis/spec/frontend/index.md`, and docs/AI collaboration rules when generated starter boundaries are involved.
* Public delivery boundary: generated starter must remain frontend-first and must not include maintainer workflow files.
