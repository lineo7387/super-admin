# 示例

示例展示模板里的各个部分如何组合。

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

## UI Kit

`/ui-kit/foundations` 以及相关 UI Kit routes 展示来自 `packages/ui` 的 reusable admin primitives。

使用 UI Kit 查看 primitives。使用 Examples 查看 module composition。
