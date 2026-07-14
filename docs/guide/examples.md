# 示例

示例展示模板里的各个部分如何组合。

## Manifest Composition

每个 feature 的 `*.manifest.ts` 是 nav、routes、route meta 和 permissions 的唯一事实源。`src/modules/examples/examples.manifest.ts` 使用 `mountModuleManifest` 把这些定义无损挂载到 `/examples/*`，再用 `composeModuleManifest` 生成 Examples tree；`src/modules/module-registry.ts` 只注册 top-level manifests。

因此，把 Users 从 Examples 提升为真实项目的一层业务模块时，应复用 `usersManifest`，而不是复制 route/nav object。`createModuleRegistry` 会拒绝重复 module ID、top-level nav path、route path 或 route name。

## Template Guide

打开 admin app 并访问：

```text
/examples/template-guide
```

这个页面会标出当前可替换边界：

- mock API data
- API adapters
- module queries
- module frontend types
- adapter-only replacement
- full module reshape

## Dashboard

`/examples/dashboard` 展示由 Dashboard API adapter 支撑的 metrics 和 activity surface。

## Workbench

`/examples/workbench` 展示 operational job cards 和 queue states。

## Users

`/examples/users/all` 展示更完整的 CRUD-style table，包括 filters、pagination、drawer forms 和 mock API scenarios。

## Access

`/examples/access` 展示 frontend-level permission metadata。它不要求真实 auth backend。

## Charts

`/examples/charts` 是可选 ECharts 模板页面。只有安装时选择 ECharts 或传入 `--charts echarts` 时，生成项目才会安装 `echarts`、`vue-echarts` 并在 Examples 下包含这个页面。

## UI Kit

`/ui-kit/foundations` 以及相关 UI Kit routes 展示来自 `packages/ui` 的 reusable admin primitives。

使用 UI Kit 查看 primitives。使用 Examples 查看 module composition。
