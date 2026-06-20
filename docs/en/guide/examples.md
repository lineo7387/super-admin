# Examples

Examples show how the template pieces fit together.

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
