# Admin Chart Template Option

## Goal

Add an optional chart template path to `create-super-admin` so generated projects can opt into ECharts-backed chart examples that automatically follow the active Super Admin design profile, while keeping the default starter lightweight and chart-library-agnostic.

## What I Already Know

- Super Admin should provide design-profile-aware chart defaults, but users must be free to use them, override them, or ignore them.
- ECharts and `vue-echarts` must not become required dependencies for users who do not choose the chart template.
- The core chart recipe should describe Super Admin visual semantics and must not import ECharts, `vue-echarts`, or ECharts-specific types.
- The ECharts adapter belongs in generated app/example integration or a future optional package, not in `packages/ui` core primitives.
- Current CLI already supports explicit flags plus interactive prompting for theme selection.
- Generated starter validation already checks package dependencies, generated source boundaries, selected theme packages, and forbidden maintainer/reference tooling.

## Requirements

- Add a chart template option to starter generation.
- Interactive generation must directly ask whether to use ECharts, with copy that says selecting it will generate an ECharts theme-adapted example page.
- When users choose the chart template:
  - Generated `package.json` includes `echarts` and `vue-echarts`.
  - Generated source includes a chart page/example wired into Examples navigation.
  - Generated chart examples use Super Admin chart recipe defaults that follow the active design profile and light/dark mode.
  - Users can still pass raw ECharts options or replace the chart implementation.
- When users do not choose the chart template:
  - Generated `package.json` does not include `echarts` or `vue-echarts`.
  - Generated source does not import ECharts or chart-specific Vue wrappers.
  - App remains frontend-first, mock-backed, and fully usable.
- Keep `packages/theme` chart recipe code free of concrete chart-library imports.
- Keep `packages/ui` free of ECharts dependencies. If needed, only add dependency-free shell primitives such as chart panel, empty, loading, or legend surfaces.
- Keep generated starter docs and help text clear that charts are optional.

## Acceptance Criteria

- [ ] CLI parsing supports a non-interactive way to include or exclude chart templates.
- [ ] Interactive generation asks whether to use ECharts after theme selection.
- [ ] Interactive ECharts copy explains that selecting it generates an ECharts theme-adapted example page.
- [ ] `generateStarter` can materialize both no-chart and ECharts-chart variants.
- [ ] No-chart generated starter static validation fails if ECharts dependencies or imports leak in.
- [ ] Chart-enabled generated starter static validation expects ECharts dependencies and chart page files.
- [ ] Chart-enabled generated starter exposes the chart page under Examples, not as a first-level module.
- [ ] Chart page does not overflow when Stage Rail appears with exactly two workspace tabs.
- [ ] Existing theme/i18n generation behavior remains unchanged.
- [ ] `pnpm --filter create-super-admin test` passes.
- [ ] Project-level starter validation covers at least the default no-chart path and one chart-enabled path.

## Definition of Done

- Tests added or updated for CLI args, package generation, conditional source output, and generated starter validation.
- Lint, typecheck, and relevant tests pass.
- Generated starter docs/help text are updated if user-visible behavior changes.
- Optional chart dependencies remain outside default generated output.

## Technical Approach

- Extend `StarterGenerationInput` with a chart/template selection field, likely `charts: { provider: 'none' | 'echarts' }`.
- Add CLI flags for non-interactive usage:
  - `--charts echarts` installs ECharts and generates the theme-adapted chart example page.
  - `--no-charts` keeps the starter lightweight and excludes ECharts dependencies and chart example source.
- Extend interactive `runCreateSuperAdmin` flow to ask `是否使用 ECharts？选择后会生成 ECharts 适配当前主题的案例页面。` or an equivalent English copy after theme selection when no chart flag is passed.
- Add dependency injection in `createPackageJson` only when `input.charts.provider === 'echarts'`.
- Add conditional source copy or transform rules so chart-specific files are included only for the chart-enabled variant.
- Add Super Admin chart recipe helpers in the theme/runtime layer without importing ECharts.
- Add app-local ECharts adapter/helpers in the generated source path only when charts are enabled.
- Wire the chart page into module navigation only when charts are enabled.

## Decision (ADR-lite)

**Context**: Super Admin wants high-quality chart examples that match design profiles, but the starter must stay flexible and not force a heavy chart library on every user.

**Decision**: Provide chart recipe defaults as Super Admin theme semantics, and make ECharts an optional generated-template feature selected during installation.

**Consequences**: This adds some CLI/template complexity, but preserves the frontend-first and user-choice boundaries. Future Chart.js, AntV, or Unovis adapters can reuse or ignore the same recipe layer.

## Out of Scope

- Do not make ECharts a dependency of `@super-admin-org/ui`, `@super-admin-org/theme`, or the default generated starter.
- Do not add Hono/backend data endpoints for chart examples in this task.
- Do not build a generic chart abstraction that hides all ECharts capabilities.
- Do not add Chart.js, AntV, Unovis, or multiple chart providers in the MVP.
- Do not publish a new optional `@super-admin-org/charts-echarts` package in the MVP unless implementation discovers a strong need.

## Research References

- [`research/echarts-template-boundary.md`](research/echarts-template-boundary.md) — current package facts and repository constraints for optional ECharts starter generation.

## Technical Notes

- Relevant CLI files:
  - `packages/cli/src/parse-args.ts`
  - `packages/cli/src/run-create-super-admin.ts`
  - `packages/cli/src/generate-starter.ts`
  - `packages/cli/src/templates.ts`
  - `packages/cli/src/generate-starter.test.mjs`
- Relevant validation files:
  - `scripts/validate-generated-starter.mjs`
  - `scripts/validate-starter-smoke.mjs`
- Relevant theme files:
  - `packages/core/src/design-profile.ts`
  - `packages/theme/src/apply-profile.ts`
  - `packages/theme/src/index.ts`
  - `packages/theme-*/src/index.ts`
- Relevant frontend/module files:
  - `apps/admin/src/modules/examples/examples.manifest.ts`
  - `apps/admin/src/modules/dashboard/DashboardPage.vue`
  - `apps/admin/src/modules/module-registry.ts`
