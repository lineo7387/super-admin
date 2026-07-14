# Examples

Examples show how the template pieces fit together.

## Manifest Composition

Each feature's `*.manifest.ts` is the single source for nav, routes, route metadata, and permissions. `src/modules/examples/examples.manifest.ts` uses `mountModuleManifest` to mount those definitions under `/examples/*` without mutation, then uses `composeModuleManifest` to build the Examples tree. `src/modules/module-registry.ts` registers only the resulting top-level manifests.

When promoting Users from Examples into a real project's first-level business module, reuse `usersManifest` instead of copying route/nav objects. `createModuleRegistry` rejects duplicate module IDs, top-level nav paths, route paths, and route names.

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
