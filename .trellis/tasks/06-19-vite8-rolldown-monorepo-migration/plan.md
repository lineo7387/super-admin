# Vite 8 Rolldown Monorepo Migration Plan

Status: Stage 1 active as of 2026-06-19. The maintainer explicitly resumed implementation after deciding that docs tooling should not block direct app/package Vite 8 work.

## Guiding Decisions

- Migrate to Vite 8 before considering Vite+.
- Treat Vite+ as future context only.
- The initial postponement is complete; proceed with Stage 1 now.
- Keep VitePress on the current stable line unless install/build proves impossible.
- Treat VitePress-linked alerts as docs-tooling risk for a separate decision.
- Do not directly merge Dependabot PR #5 or #7.
- Split unrelated major upgrades into separate PRs.
- Keep `main` protected: use a `codex/*` branch, PR, and CI before merge.

## Later Stage Resume Triggers

Stage 1 is already resumed. Only resume later stages when at least one of these conditions is met:

- VitePress has a stable release path away from the old vulnerable Vite chain.
- Dependabot or npm metadata shows a safe patch/minor path for the remaining high alert.
- The maintainer explicitly decides to revisit docs-tooling risk or broader ecosystem upgrades.
- The Vite+/Vite 8 ecosystem stabilizes enough that the broader direction is less ambiguous.

## Target PR Sequence

### PR 1: Focused Vite 8 Direct Toolchain Migration

Goal: move the repo's direct Vite usage from Vite 7 to Vite 8 while avoiding unrelated major upgrades.

Scope:

- Update root `devDependencies.vite` from `^7.3.5` to `^8.0.16`.
- Update `apps/admin/devDependencies.vite` from `^7.3.5` to `^8.0.16`.
- Update `pnpm-lock.yaml`.
- Replace deprecated Vite 8 `build.rollupOptions` usage with `build.rolldownOptions` where the repo calls Vite's JavaScript build API directly.
- Keep `vue-router` on the current major.
- Keep `typescript` on `5.9.x`.
- Keep `@types/node` on `24.x`.
- Keep VitePress unchanged unless install/build proves impossible.

Suggested commands when implementation starts:

```bash
git checkout main
git pull --ff-only origin main
git status --short --branch
gh pr list --state open
gh api repos/lineo7387/super-admin/dependabot/alerts --paginate --jq '.[] | select(.state=="open") | {number, severity:.security_advisory.severity, package:.dependency.package.name, manifest:.dependency.manifest_path, vulnerable:.security_vulnerability.vulnerable_version_range, patched:.security_vulnerability.first_patched_version.identifier}'
git checkout -b codex/vite8-rolldown-migration
pnpm add -Dw vite@^8.0.16
pnpm --filter @super-admin/admin add -D vite@^8.0.16
pnpm install --frozen-lockfile
```

Verification:

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm docs:build
pnpm validate:starter
```

Extra checks:

- Inspect `pnpm why vite --depth 10` and confirm direct app/root Vite usage resolves to Vite 8.
- Inspect `pnpm why esbuild --depth 10` to understand whether old esbuild exposure remains through VitePress or other tools.
- If `scripts/build-publish-package.mjs` fails, isolate whether Vite 8's Rolldown path rejects any previous `rollupOptions` shape.
- If only docs fail, do not hide it; record whether the blocker is VitePress-specific.

Expected output:

- One focused branch and PR.
- CI must be green before merge.
- Summary of Dependabot alerts after the branch is pushed.

Rollback:

- Revert only the focused PR if Vite 8 causes unresolved build/runtime regressions.
- Do not revert unrelated security or governance changes from previous tasks.

### PR 2: VitePress / Docs Tooling Security Decision

Goal: decide how to handle the remaining root high alert if VitePress keeps the old Vite chain after PR 1.

Possible paths:

- Wait for a stable VitePress release that removes the Vite 5 dependency chain.
- Evaluate `vitepress@next` in a separate branch if alpha risk is acceptable.
- Record a temporary docs-only dev-dependency risk acceptance if no stable path exists.

Verification:

```bash
pnpm docs:build
pnpm build
pnpm test
```

Decision rules:

- Do not move public docs infrastructure to alpha tooling unless the docs build and GitHub Pages workflow are verified.
- Do not replace VitePress with another docs framework inside this migration unless a separate task approves that larger change.
- Keep any remaining high/medium alert summary explicit in the PR body.

### PR 3: TypeScript 6 / Node Types 25 Migration

Goal: handle the scope currently represented by Dependabot PR #7 as a separate migration.

Scope:

- `typescript 5.9.x -> 6.x`.
- `@types/node 24.x -> 25.x`.
- Any `vue-tsc`, `@vue/tsconfig`, or TS config adjustments required by the compiler.

Starting point:

- Do not merge #7 directly while it is failing CI.
- Reproduce the CI failure locally first.
- Use the `systematic-debugging` workflow if errors are unclear.

Verification:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### PR 4: Vue Router 5 / Broader Vue Ecosystem Migration

Goal: handle the non-Vite parts of Dependabot PR #5 only if needed.

Scope:

- `vue-router 4 -> 5`.
- Vue patch updates.
- `@vue/tsconfig` updates.
- `vue-tsc` patch updates.

Decision rules:

- Keep this separate from Vite 8 unless a Vite 8 compatibility issue requires it.
- Review route definitions and navigation behavior before merge.

Verification:

```bash
pnpm --filter @super-admin/admin typecheck
pnpm --filter @super-admin/admin build
pnpm --filter @super-admin/admin test
pnpm build
pnpm test
```

## Dependabot Risk Matrix

High:

- `vite <=6.4.2` in root `pnpm-lock.yaml`: likely remains tied to the VitePress dependency path until docs tooling moves.

Medium:

- Root `vite` alerts: should improve for direct root/admin Vite after PR 1, but may remain if VitePress keeps `vite@5.4.21`.
- Root `esbuild <0.24.2`: likely tied to Vite 5 through VitePress.
- Root `js-yaml <=4.1.1`: tied to `@changesets/cli -> @manypkg/get-packages -> read-yaml-file`; handle as a separate tooling dependency task unless a safe patch/minor path appears.

Low:

- Root `esbuild >=0.27.3 <0.28.1`: may be reduced by Vite 8, but verify lockfile after PR 1.
- `.agents/skills/vite-plus/docs` `esbuild >=0.27.3 <0.28.1`: Vite+ docs tooling remains maintainer-only and should stay separate from the app migration.

## Implementation Checklist For Later

- [ ] Reconfirm open PRs and Dependabot alerts with `gh`.
- [x] Reconfirm local branch state and branch protection.
- [x] Create `codex/vite8-direct-migration`.
- [x] Update only direct Vite dependencies for PR 1.
- [x] Run install and full verification commands.
- [x] Inspect dependency paths with `pnpm why`.
- [x] Replace remaining direct `build.rollupOptions` usage with `build.rolldownOptions`.
- [x] Record the Vite 8 / Rolldown build-config convention in `.trellis/spec/shared/monorepo.md`.
- [ ] Push branch and open a focused PR.
- [ ] Wait for CI and summarize results.
- [ ] Merge only after CI passes.
- [ ] Sync local `main` after merge.
- [ ] Recheck Dependabot alerts and classify remaining risk.

## Stop Conditions

- `pnpm install --frozen-lockfile` cannot resolve without pulling unrelated major upgrades.
- `pnpm build` fails in package publishing builds due to Vite JS API or Rolldown incompatibility.
- `pnpm docs:build` fails for reasons tied to VitePress compatibility and cannot be fixed without an alpha docs-framework migration.
- CI fails with TypeScript 6 / Node types 25 scope leakage.

If a stop condition occurs, keep the branch open as draft or close it with notes, then split the blocker into its own Trellis task.

## Stage 1 Verification Notes

Passed locally on 2026-06-19:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm typecheck
env NPM_CONFIG_CACHE=/private/tmp/super-admin-npm-cache pnpm test
pnpm docs:build
env NPM_CONFIG_CACHE=/private/tmp/super-admin-npm-cache pnpm validate:starter
```

Observed but non-blocking:

- `pnpm build` and generated starter builds keep the existing large chunk warning.
- Vite 8/Rolldown reports non-fatal `INVALID_ANNOTATION` warnings from `@vueuse/core` during generated starter builds.
- `pnpm audit --prod --json` has 0 production vulnerabilities.
- `pnpm audit --json` still reports dev-only VitePress, Changesets/js-yaml, and Vite/esbuild findings.
- `scripts/build-publish-package.mjs` now uses `build.rolldownOptions` instead of the deprecated `build.rollupOptions` alias.
- `.trellis/spec/shared/monorepo.md` records that future Vite 8 package build scripts should use `build.rolldownOptions` and avoid direct `rollup`/`esbuild` dependencies unless a script explicitly needs them.
