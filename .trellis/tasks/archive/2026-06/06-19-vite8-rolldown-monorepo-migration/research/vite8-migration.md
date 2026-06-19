# Vite 8 / Rolldown migration research

Date: 2026-06-19

## Sources Checked

- Vite migration guide: https://vite.dev/guide/migration
- Vite 8 announcement: https://vite.dev/blog/announcing-vite8
- npm metadata via `pnpm view` for `vite`, `vitepress`, `@vitejs/plugin-vue`, and `@tailwindcss/vite`
- GitHub state via `gh pr list`, `gh pr view`, and Dependabot alerts API

## Current Repo State

- Root and `apps/admin` currently resolve direct `vite` at `7.3.5`.
- Latest `vite` from npm is `8.0.16`.
- `@vitejs/plugin-vue@6.0.7` supports `vite` peer range `^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0`.
- `@tailwindcss/vite@4.3.1` supports `vite` peer range `^5.2.0 || ^6 || ^7 || ^8`.
- `vitest` is already on `4.1.9`, so it is aligned with the Vite+ prerequisite direction but still needs verification under Vite 8.
- `scripts/build-publish-package.mjs` calls Vite's JavaScript `build()` API and passes `build.rollupOptions.external`; this must be verified under Vite 8 compatibility behavior.
- `docs` uses `vitepress@1.6.4`, whose published latest dependency is `vite: ^5.4.14`, pulling `vite@5.4.21` and `esbuild@0.21.5` into the root lockfile.
- `vitepress@next` is `2.0.0-alpha.17` and depends on `vite: ^7.3.1`, not Vite 8. It may reduce some Vite 5 exposure but is pre-stable and does not by itself complete a Vite 8 docs migration.

## Official Vite 8 Notes Relevant Here

- Vite 8 uses Rolldown and Oxc-based tools instead of the previous esbuild and Rollup split.
- Vite 8 keeps compatibility layers for existing `rollupOptions` and `esbuild` config, but those are migration paths rather than long-term targets.
- Vite 8 keeps the Node requirement at Node.js `20.19+` or `22.12+`, matching Vite 7.
- Official guidance allows a direct upgrade for many projects; larger or more complex projects may first test Rolldown-specific behavior separately. For this repo, direct Vite 8 can be reasonable if we keep the first PR focused and verification-heavy.

## Current GitHub / Dependabot Context

- Open PR #5 updates the broad `vue-vite` group, including `vite 7.3.5 -> 8.0.16`, `vue-router 4.6.4 -> 5.1.0`, Vue patch updates, and tsconfig/vue-tsc updates. It is green but behind `main`.
- Open PR #7 updates `typescript 5.9.3 -> 6.0.3` and `@types/node 24.12.4 -> 25.9.3`. It is failing CI and behind `main`.
- Current open Dependabot alerts:
  - High: alert #35, root `pnpm-lock.yaml`, `vite <=6.4.2`, patched `6.4.3`.
  - Medium: alerts #37, #31 on root `vite`; #30 on root `esbuild`; #33 on root `js-yaml`.
  - Low: alert #32 on root `esbuild`; alert #19 on `.agents/skills/vite-plus/docs/pnpm-lock.yaml` `esbuild`.

## Risk / Scope Interpretation

- Merging #5 as-is is too broad for a controlled migration because it includes `vue-router` major upgrade and multiple Vue ecosystem changes in addition to Vite 8.
- A safer Vite 8 PR should likely update only:
  - root `vite`
  - `apps/admin` `vite`
  - lockfile resolution
  - maybe small compatible patch bumps such as `@tailwindcss/vite` or `vue-tsc` if required by install/build
- TypeScript 6 and `@types/node` 25 belong in a separate migration because #7 already shows CI risk.
- VitePress is the main unresolved security wrinkle. `vitepress@1.6.4` still brings Vite 5; `vitepress@next` is alpha and still does not target Vite 8. The docs path may need either:
  - a separate VitePress 2 alpha risk decision,
  - waiting for stable VitePress support,
  - or a temporary repository-level risk acceptance for docs-only dev dependency exposure.

## Feasible Approaches

### Approach A: Focused Vite 8 App/Package Toolchain PR

Update direct Vite usage in root and `apps/admin` to Vite 8, keep Vue Router and TypeScript majors out, verify root CI gates, and leave VitePress high alert documented as separate docs-tooling risk.

Pros:
- Lowest blast radius for actual app/build toolchain migration.
- Avoids coupling Vite 8 with Vue Router 5 and TypeScript 6.
- Fits protected main + focused PR flow.

Cons:
- May not close the root high Dependabot alert if VitePress keeps `vite@5.4.21` in the lockfile.

### Approach B: Vite 8 Plus VitePress 2 Alpha Evaluation

Do Approach A and also test replacing `vitepress@1.6.4` with `vitepress@next`.

Pros:
- Directly attacks the VitePress/Vite 5 dependency path.
- Tests whether docs can move away from the old Vite chain now.

Cons:
- Uses an alpha docs framework in public docs infrastructure.
- `vitepress@next` currently depends on Vite 7, not Vite 8, so security closure is not guaranteed.

### Approach C: Adopt Dependabot PR #5 After Rebase and Full Migration Review

Use #5 as the migration branch but treat it as a manually reviewed migration, not an automatic security PR.

Pros:
- CI was previously green.
- Dependabot already generated the dependency graph update.

Cons:
- Includes Vue Router major upgrade and other unrelated ecosystem changes.
- More difficult to reason about if failures appear later.
- Less aligned with the earlier governance rule to keep major migrations scoped.

## Recommended MVP

Approach A first. If it passes, decide separately whether VitePress 2 alpha is acceptable or whether the docs-tooling alert should remain a documented temporary risk until VitePress has a stable line that removes the old Vite chain.
