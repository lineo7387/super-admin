# Vite 8 Rolldown Monorepo Migration

## Goal

Execute a focused Vite 8/Rolldown migration for the Super Admin monorepo's direct Vite usage, while keeping VitePress/docs tooling on its current stable line until upstream support is clearer. Vite+ remains deferred until it is stable enough for this project.

## What I Already Know

- The user wants to prioritize Vite 8 first because Vite+ is not stable enough yet.
- The user initially preferred to postpone the actual migration because moving immediately created an awkward trade-off.
- The maintainer later explicitly resumed the migration on 2026-06-19, after deciding that docs tooling should not block direct app/package Vite 8 work.
- `main` branch protection is now enabled on GitHub: PR required, `checks` status required, administrators included, force push/delete disabled.
- This is a monorepo with `apps/admin`, `packages/*`, docs under `docs/`, and root workspace scripts.
- Root and `apps/admin` currently declare `vite ^7.3.5`.
- `vitest` is already `^4.1.9`.
- `@vitejs/plugin-vue@6.0.7` and `@tailwindcss/vite` support Vite 8 by peer dependency.
- Package publishing builds use `scripts/build-publish-package.mjs`, which calls Vite's JavaScript `build()` API and sets `build.rollupOptions.external`.
- VitePress remains a separate docs-tooling constraint: `vitepress@1.6.4` currently pulls `vite@5.4.21`.
- Current open PRs are #5 and #7. #5 is green but broad; #7 is failing and should not be merged as part of this task.
- Current open Dependabot alerts are grouped as:
  - High: root `vite <=6.4.2` in `pnpm-lock.yaml`.
  - Medium: root `vite`, `esbuild`, and `js-yaml` alerts.
  - Low: root `esbuild` and `.agents/skills/vite-plus/docs` `esbuild`.

## Assumptions

- Vite+ is out of scope for this task except as future context.
- TypeScript 6 / `@types/node` 25 migration remains separate from Vite 8.
- Vue Router 5 should not be pulled into the Vite 8 MVP unless it becomes technically necessary.
- Protected `main` and PR+CI workflow still apply.

## Requirements

- Produce a complete migration plan before touching dependency files.
- Start implementation now for Stage 1: direct Vite usage only.
- Define concrete resume triggers so future work does not restart from scratch.
- Upgrade direct Vite usage to Vite 8 in the narrowest practical scope when implementation starts.
- Keep unrelated major upgrades out of the first implementation PR.
- Keep VitePress at the current stable line unless install or docs build requires a minimal compatible adjustment.
- Treat any remaining VitePress-linked Dependabot alert as docs-tooling risk, not a blocker for generated starters.
- Verify the admin app build, publish-package builds, root tests, typecheck, lint, docs build, and starter validation where relevant.
- Record which Dependabot alerts are resolved, still blocked, or accepted as temporary docs/maintainer-tooling risk.
- Do not merge #5 or #7 directly unless a future task treats them as independent migrations with complete validation.

## Acceptance Criteria

- [x] Current GitHub PR, Dependabot alert, and local git status are recorded.
- [x] Research notes capture the Vite 8, VitePress, #5, and #7 trade-offs.
- [x] A planning-only migration plan exists in `plan.md`.
- [x] The task records that Vite 8 implementation was postponed initially.
- [x] The task records the 2026-06-19 resume decision and Stage 1 scope.
- [x] Resume triggers are documented.
- [x] Direct Vite dependencies in root and `apps/admin` are updated to Vite 8 when the implementation phase starts, or the PRD explicitly records why not.
- [x] `pnpm install --frozen-lockfile` succeeds after the dependency change.
- [x] `pnpm build` succeeds, including publishable package builds that use Vite's JS API.
- [x] `pnpm lint`, `pnpm typecheck`, and `pnpm test` succeed.
- [x] `pnpm docs:build` succeeds or any VitePress-specific blocker is recorded with a follow-up decision.
- [x] `pnpm validate:starter` succeeds if the lockfile/package changes affect generated starter behavior.
- [ ] Dependabot alert status is rechecked after the PR branch is pushed.
- [ ] CI is green before merge.

## Definition of Done

- For Stage 1: direct Vite usage is migrated to Vite 8, VitePress remains stable unless a separate docs-tooling decision is made, and the remaining alert state is explicitly summarized.
- Tests and verification commands are run before claiming completion.
- Public docs or Trellis spec are updated only if the migration changes durable user-facing or maintainer-facing workflow.
- A focused branch and PR are used; `main` is not pushed directly.
- Remaining security risks are summarized by severity and dependency path.

## Technical Approach

Run the staged migration plan instead of merging broad Dependabot major PRs:

- Stage 0: deferred planning state; completed.
- Stage 1: focused Vite 8 toolchain PR for root and `apps/admin` direct Vite usage.
- Stage 2: docs/VitePress security decision after Stage 1 results are known.
- Stage 3: optional TypeScript 6 / `@types/node` 25 migration from #7 as a separate task.
- Stage 4: optional Vue Router 5 migration from #5 as a separate task only if product/runtime code needs it.

## Decision (ADR-lite)

**Context**: Vite 8 is the desired next migration target, but existing Dependabot PRs combine unrelated majors. #5 mixes Vite 8 with Vue Router 5 and Vue ecosystem bumps; #7 moves TypeScript and Node types to major versions and already fails CI. VitePress still pulls an older Vite chain.

**Decision**: The task resumed on 2026-06-19. Implementation starts with a focused Vite 8 PR for direct Vite usage. Do not merge #5 or #7 directly.

**Consequences**: This keeps the migration reviewable and avoids coupling Vite 8 with router/types/docs framework risk. The high Dependabot alert may remain until the VitePress path is handled separately.

## Resume Triggers

Stage 1 is now active because the maintainer explicitly decided that direct Vite 8 app/package migration is valuable even if VitePress risk remains separate. Future resume triggers for later stages remain:

- VitePress has a stable release path that no longer pulls the old vulnerable Vite chain.
- Dependabot or npm metadata shows a clean patch/minor path that removes the high alert without adopting alpha docs tooling.
- The maintainer explicitly decides that direct Vite 8 app/package migration is valuable even if VitePress risk remains separate.
- Vite+ stabilizes enough to reconsider the broader toolchain direction, after Vite 8 compatibility is understood.

## Out of Scope

- Vite+ migration.
- TypeScript 6 / `@types/node` 25 migration from PR #7.
- Vue Router 5 migration unless a Vite 8 compatibility issue forces it.
- Replacing VitePress with another docs framework.
- Publishing npm packages.

## Research References

- [`research/vite8-migration.md`](research/vite8-migration.md) — current Vite 8, npm, GitHub PR, and Dependabot context for this migration.

## Technical Notes

- Vite migration guide: https://vite.dev/guide/migration
- Vite 8 announcement: https://vite.dev/blog/announcing-vite8
- Stage 1 local verification on 2026-06-19:
  - `pnpm install --frozen-lockfile` passed.
  - `pnpm build` passed with direct package builds using `vite v8.0.16`.
  - `pnpm lint` passed.
  - `pnpm typecheck` passed.
  - `env NPM_CONFIG_CACHE=/private/tmp/super-admin-npm-cache pnpm test` passed.
  - `pnpm docs:build` passed with `vitepress v1.6.4`.
  - `env NPM_CONFIG_CACHE=/private/tmp/super-admin-npm-cache pnpm validate:starter` passed; generated starters installed `vite 8.0.16`.
  - `pnpm audit --prod --json` reported 0 production vulnerabilities.
- Remaining local dev-only audit findings after Stage 1:
  - `vitepress@1.6.4 -> vite@5.4.21 -> esbuild@0.21.5`.
  - `@changesets/cli -> @manypkg/get-packages -> read-yaml-file -> js-yaml@3.14.2`.
  - `vite@8.0.16` peer path resolved `esbuild@0.28.0`; `0.28.1` is patched, but a lockfile-only `pnpm update esbuild@0.28.1` made no change and no global override was added.
- Vite 8/Rolldown emits non-fatal `INVALID_ANNOTATION` warnings from `@vueuse/core` in generated starter builds and keeps the existing large chunk warning.
- Relevant repo files inspected:
  - `package.json`
  - `apps/admin/package.json`
  - `apps/admin/vite.config.ts`
  - `packages/ui/package.json`
  - `packages/core/package.json`
  - `scripts/build-publish-package.mjs`
  - `docs/.vitepress/config.ts`
  - `.github/workflows/ci.yml`
  - `.github/workflows/docs-pages.yml`
  - `.trellis/spec/shared/public-delivery.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/shared/git-conventions.md`
  - `.trellis/spec/frontend/quality.md`

## Open Questions

- None for the deferred planning step. Implementation should begin only after the maintainer explicitly chooses to resume.
