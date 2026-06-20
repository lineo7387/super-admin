# ECharts Template Boundary Research

Date: 2026-06-20

## Package Facts

Checked with:

```bash
npm view echarts version license peerDependencies dependencies --json
npm view vue-echarts version license peerDependencies dependencies --json
```

Current results:

- `echarts@6.1.0`
  - License: `Apache-2.0`
  - Dependencies: `zrender@6.1.0`, `tslib@2.3.0`
- `vue-echarts@8.0.1`
  - License: `MIT`
  - Peer dependencies: `vue ^3.3.0`, `echarts ^6.0.0`

## Repository Constraints

- `create-super-admin` already supports explicit CLI flags plus an interactive theme selector.
- Generated starters must stay frontend-first, mock-backed, and user-modifiable.
- Default generated starters must not include optional backend, maintainer tooling, tests, docs, or heavy optional capabilities.
- Generated package dependencies are assembled in `packages/cli/src/templates.ts`.
- Source copying and conditional transforms are handled in `packages/cli/src/generate-starter.ts`.
- Static starter validation already checks selected theme package dependencies and can be extended to check chart dependency leakage.
- `@super-admin-org/theme` currently exports runtime helpers without bundling built-in profiles.
- Theme profile packages export `DesignProfile` objects with semantic colors, shell, shape, effects, typography, and motion tokens.

## Recommended Boundary

Use three layers:

1. `packages/theme` or another dependency-light Super Admin runtime layer exposes chart recipe helpers that use only Super Admin design profile types.
2. Generated app-local chart integration converts chart recipes into ECharts options only when the chart template is selected.
3. Generated chart page and navigation entries are included only for chart-enabled starters.

Avoid:

- `echarts` imports in `packages/theme`, `packages/core`, or `packages/ui`.
- ECharts option types in the core recipe contract.
- Generated no-chart output containing ECharts dependencies, imports, routes, or page files.

## Feasible CLI UX

Recommended:

- `--charts echarts` includes ECharts dependencies and chart template source.
- `--no-charts` explicitly excludes chart template source.
- Interactive mode asks a yes/no chart template question after theme selection when neither chart flag is passed.
- Default answer should likely be no, preserving lightweight starter output.

Alternative:

- `--charts none|echarts` only, without `--no-charts`.
- This is compact but less familiar for boolean opt-out flows.

