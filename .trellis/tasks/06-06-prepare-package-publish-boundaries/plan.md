# Prepare Package Publish Boundaries Plan

## Goal

Make the current package boundary explicit enough that follow-up tasks can split packages, adjust exports, and build `create-super-admin` without re-litigating the CLI starter contract.

## Inventory Findings

- [x] Read task PRD and parent CLI starter contract.
- [x] Read relevant specs:
  - `.trellis/spec/shared/cli-starter-contract.md`
  - `.trellis/spec/shared/typescript.md`
  - `.trellis/spec/shared/code-quality.md`
  - `.trellis/spec/shared/monorepo.md`
  - `.trellis/spec/frontend/directory-structure.md`
- [x] Inspect current workspace package manifests and exports.
- [x] Inspect `apps/admin` package dependencies, tsconfig aliases, and app-local directories.
- [x] Record package boundary inventory in `inventory.md`.

## Follow-Up Work Plan

### 1. Package Publish Hygiene

- [ ] Add real build output for `packages/core`, `packages/theme`, and `packages/ui` instead of `noEmit` publish builds.
- [ ] Point package exports to emitted ESM and declarations rather than `./src/*.ts`.
- [ ] Add publish metadata and package file allowlists.
- [ ] Decide versioning/release flow for first publishable `@super-admin/*` packages.
- [ ] Replace workspace dependency specifiers in publishable package manifests with semver ranges.
- [ ] Split source/test TypeScript configs so package builds do not rely on test globals.

### 2. Theme Runtime And Independent Theme Packages

- [ ] Re-scope `@super-admin/theme` to runtime/core APIs such as `applyDesignProfile` and registry helper types.
- [ ] Create independent theme packages for selected built-in profiles, starting with `@super-admin/theme-base`.
- [ ] Move profile constants out of the required runtime package and into theme packages.
- [ ] Remove generated-app reliance on `builtInDesignProfiles` and `getBuiltInDesignProfile`.
- [ ] Decide whether `crypto` remains a first-class installable package and, if so, name it consistently as `@super-admin/theme-crypto`.
- [ ] Loosen core-owned theme id typing so core does not need to know every installable theme package.

### 3. Generated App Theme Config And Registry

- [ ] Define `super-admin.config.ts` shape for installed themes, default theme, switcher mode, default locale, and i18n switcher.
- [ ] Define generated `src/super-admin/theme-registry.generated.ts` shape.
- [ ] Update the app consumption pattern so selected profiles are composed by the generated registry.
- [ ] Define single-theme mode with no runtime theme switcher and multi-theme mode with switcher enabled.

### 4. UI Package Consumption Contract

- [ ] Decide whether `@super-admin/ui` publishes package CSS, requires generated app CSS, or both.
- [ ] Move or duplicate `.super-scroll*` CSS so `AdminScrollArea` works for npm consumers.
- [ ] Replace workspace-only Tailwind `@source "../../../../packages/ui/src"` with a generated-app-safe strategy.
- [ ] Decide dependency policy for `vue` and `lucide-vue-next` as peer/runtime dependencies.
- [ ] Remove generated build artifacts such as `tsconfig.tsbuildinfo` from publishable package contents.

### 5. Generated Template Extraction Boundary

- [ ] Define a filtered generated `package.json` with only `dev`, `build`, `typecheck`, and `preview` scripts.
- [ ] Remove workspace package aliases from generated `tsconfig.json`.
- [ ] Exclude `*.test.ts`, VitePress docs, optional Hono reference API, Playwright/reference smoke tooling, lint scripts, and backend packages from default output.
- [ ] Remove or gate `apps/admin/src/api/reference/*` and reference auth/env wiring from the default generated starter.
- [ ] Keep app-local modules, API adapters, mock data, i18n, shell/workspace, stores, router, styles, and future `src/super-admin/*` user-owned.

### 6. Validation Harness For Published Consumption

- [ ] Validate packages using packed artifacts, not workspace source aliases.
- [ ] Generate a default app and verify install, typecheck, build, and startup smoke.
- [ ] Assert generated `package.json` has no `workspace:*` dependencies.
- [ ] Assert default generated theme dependencies are exactly `@super-admin/theme` plus `@super-admin/theme-base`.
- [ ] Assert multi-theme generation installs exactly the selected theme packages.
- [ ] Assert default generated output excludes backend/docs/test/lint/e2e/reference tooling.

## Suggested Task Split

1. Publish hygiene for `@super-admin/core`, `@super-admin/ui`, and `@super-admin/theme`.
2. Split theme runtime and `@super-admin/theme-base`.
3. Add generated theme config and registry shape.
4. Extract a CLI-safe app template filter.
5. Add generated starter validation with packed package consumption.

## Non-Goals For This Task

- Do not implement `create-super-admin`.
- Do not publish packages.
- Do not split theme packages yet.
- Do not change the generated starter template yet.
- Do not archive the parent task.
