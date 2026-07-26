# Examples

Examples show how the template pieces fit together.

## Manifest Composition

Each feature's `*.manifest.ts` is the single source for nav, routes, route metadata, and permissions. `src/modules/examples/examples.manifest.ts` uses `mountModuleManifest` to mount those definitions under `/examples/*` without mutation, then uses `composeModuleManifest` to build the Examples tree.

`src/modules/examples/examples.registration.ts` owns the Examples default entry and legacy compatibility redirects. `src/modules/module-registry.ts` is app-local composition, while `src/modules/app-module-registry.ts` contains generic validation. When promoting Users into a real top-level business module, reuse `usersManifest` instead of copying route/nav objects. The registry rejects duplicate module IDs, top-level nav paths, route paths, route names, and conflicting redirects.

## Remove Examples Completely

For a new project, prefer having the CLI apply the complete pruning:

```bash
pnpm dlx create-super-admin@latest my-admin --theme base --no-examples --pm pnpm
```

`--no-examples` removes the source, registration, dependency, and AI-context surfaces listed below together, and cannot be combined with `--charts echarts`. Use the manual recipe for projects that have already been generated or customized.

Remove the following as one feature slice:

1. Delete `src/modules/examples/`, `src/modules/access/`, `src/modules/dashboard/`, `src/modules/users/`, and `src/modules/workbench/`.
2. Delete the corresponding `src/api/access.api.ts`, `dashboard.api.ts`, `users.api.ts`, and `workbench.api.ts` files, plus their matching mock files under `src/api/mock/`.
3. Remove the `examplesRegistration` import and registration entry from `src/modules/module-registry.ts`. Do not add replacement fallbacks to the router, auth guard, or workspace components.
4. Update `ai-context/extension-points.md`: remove `src/modules/examples/examples.manifest.ts`, `src/modules/examples/examples.registration.ts`, and the “Remove Examples” task guidance, then record that Examples were omitted so AI context cannot point to deleted files.
5. If ECharts was generated, also remove `src/modules/charts/`, `src/shared/charts/`, the `echarts` and `vue-echarts` dependencies, and `ai-context/charts.md`; remove that context import from `AGENTS.md` and set the chart provider in `super-admin.config.ts` back to `none`.
6. Run `pnpm check` in a standard project. In a minimal project, run `pnpm typecheck && pnpm build`.

The default entry is derived from the remaining registrations. Keeping UI Kit routes the app to `/ui-kit/foundations`; registering no modules uses `/workspace`. Removing the Examples registration also intentionally removes legacy paths such as `/dashboard` and `/users*`.

## Template Guide

Open the admin app and visit:

```text
/examples/template-guide
```

This page maps the current replacement seams:

- mock API data
- API adapters
- module queries
- module frontend types
- adapter-only replacement
- full module reshape

## Dashboard

`/examples/dashboard` shows a metric and activity surface backed by a Dashboard API adapter.

## Workbench

`/examples/workbench` shows operational job cards and queue states.

## Users

`/examples/users/all` shows a richer CRUD-style table with filters, pagination, drawer forms, and mock API scenarios.

## Access

`/examples/access` shows frontend-level permission metadata. It does not require a real auth backend.

## Charts

`/examples/charts` is the optional ECharts template page. Generated projects include this page under Examples and install `echarts` plus `vue-echarts` only when ECharts is selected during setup or `--charts echarts` is passed.

## UI Kit

`/ui-kit/foundations` and related UI Kit routes demonstrate reusable admin primitives from `packages/ui`.

Use UI Kit for primitives. Use Examples for module composition.
