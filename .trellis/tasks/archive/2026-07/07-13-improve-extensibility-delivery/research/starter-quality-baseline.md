# Starter quality baseline research

## Question

How should `create-super-admin` expose lint, unit tests, browser tests, and lightweight output without weakening the default developer experience?

## Comparable tools and conventions

### create-vue 3.22.4

Official `create-vue` exposes independent feature flags for `--vitest`, `--playwright`, `--eslint`, and `--prettier`, plus `--bare` for minimal boilerplate. Its generated quality-enabled project includes separate `test:unit`, `test:e2e`, `lint`, `type-check`, and build scripts.

Sources:

- https://github.com/vuejs/create-vue
- Local verification on 2026-07-13: `npx create-vue@latest --help`
- Local generated-project inspection with TypeScript, Router, Pinia, Vitest, Playwright, ESLint, and Prettier flags

### Vitest component testing

Vitest recommends behavior-focused component testing. Browser Mode is the most accurate option for focus, browser APIs, CSS behavior, events, and accessibility; component tests complement rather than replace end-to-end flows.

Source:

- https://main.vitest.dev/guide/browser/component-testing

### Current Super Admin

- The source repository already has strict TypeScript, ESLint, Prettier, Vitest, package tests, packed-starter validation, and an optional Playwright reference smoke.
- Generated starters intentionally remove all tests and do not generate lint or test scripts.
- The default generated app is already substantial (roughly 102 files and 9,246 TS/Vue/CSS lines), so calling it “minimal” because quality tooling is omitted is misleading.
- The CLI source and generated starter are kept equivalent through a strong source-derived transformation pipeline; any quality profile should extend this pipeline rather than add a parallel static template.

## Feasible approaches

### A. Standard quality by default, explicit minimal opt-out (recommended)

- Default generates ESLint + Vitest + representative behavior tests.
- `--minimal` or `--quality minimal` omits them.
- Playwright remains optional (`--e2e`) until browser install/runtime cost is acceptable.

Pros:

- Matches the project’s “extremely high code quality” positioning.
- Gives AI and humans executable feedback immediately after generation.
- The default app size already justifies a real quality baseline.

Cons:

- More dependencies and generated config files.
- Existing snapshots and publish validation expand.

### B. Minimal by default, opt-in quality flags

- Preserve current output.
- Add `--lint`, `--test`, and `--e2e` flags similar to create-vue.

Pros:

- Lowest migration risk and smallest default dependency set.

Cons:

- Most users never opt in and receive a starter inconsistent with the quality promise.
- AI-assisted changes have no generated test command.

### C. Named presets only

- `--preset minimal|standard|full` controls quality and feature payload together.

Pros:

- Easy to explain at product level.

Cons:

- Coarse presets reduce freedom unless individual overrides are also supported.
- More CLI matrix complexity immediately.

## Recommendation

Adopt Approach A with an internal typed `quality` generation model that can later accept named presets. For the first implementation:

- default: ESLint, Vitest, `lint`, `test`, `check`;
- `--minimal`: omit lint/test tooling but retain typecheck/build;
- Playwright: keep repository/reference smoke first, then add an explicit starter flag in a later release;
- generated tests should exercise real pure/component behavior, not copy the repository’s source-string contract tests.

## Validation implications

- Packed starter validation must install and run `lint`, `test`, `typecheck`, and `build` for default variants.
- A minimal variant must prove quality dependencies/config/tests are absent and typecheck/build remain green.
- README, CLI help, AI context, and package README must describe the selected quality profile accurately.

