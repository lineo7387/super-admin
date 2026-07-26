# 示例

示例展示模板里的各个部分如何组合。

## Manifest Composition

每个 feature 的 `*.manifest.ts` 是 nav、routes、route meta 和 permissions 的唯一事实源。`src/modules/examples/examples.manifest.ts` 使用 `mountModuleManifest` 把这些定义无损挂载到 `/examples/*`，再用 `composeModuleManifest` 生成 Examples tree。

`src/modules/examples/examples.registration.ts` 为 Examples 声明默认入口和旧路径兼容 redirects；`src/modules/module-registry.ts` 只负责 app-local composition，通用校验位于 `src/modules/app-module-registry.ts`。因此，把 Users 从 Examples 提升为真实项目的一层业务模块时，应复用 `usersManifest`，而不是复制 route/nav object。registry 会拒绝重复 module ID、top-level nav path、route path、route name 或冲突 redirect。

## 完整删除 Examples

创建新项目时优先让 CLI 完成裁剪：

```bash
pnpm dlx create-super-admin@latest my-admin --theme base --no-examples --pm pnpm
```

`--no-examples` 会同步移除下面列出的 source、registration、dependency 和 AI context，且不能与 `--charts echarts` 同时使用。对于已经生成或已经修改过的项目，再按以下步骤人工删除。

按一个切片一起删除以下内容：

1. 删除 `src/modules/examples/`、`src/modules/access/`、`src/modules/dashboard/`、`src/modules/users/` 和 `src/modules/workbench/`。
2. 删除对应的 `src/api/access.api.ts`、`dashboard.api.ts`、`users.api.ts`、`workbench.api.ts`，以及 `src/api/mock/` 下同名 mock files。
3. 从 `src/modules/module-registry.ts` 删除 `examplesRegistration` 的 import 和 registration entry。不要在 router、auth guard 或 workspace 组件中另写 fallback。
4. 更新 `ai-context/extension-points.md`：移除 `src/modules/examples/examples.manifest.ts`、`src/modules/examples/examples.registration.ts` 和“删除 Examples”任务说明，并记录 Examples 已省略，避免 AI context 指向已删除文件。
5. 如果项目生成了 ECharts，继续删除 `src/modules/charts/`、`src/shared/charts/`、`echarts` / `vue-echarts` dependencies 和 `ai-context/charts.md`，从 `AGENTS.md` 移除对应 import，并把 `super-admin.config.ts` 的 chart provider 改回 `none`。
6. Standard 项目运行 `pnpm check`；minimal 项目运行 `pnpm typecheck && pnpm build`。

默认入口由剩余 registrations 自动派生。保留 UI Kit 时会进入 `/ui-kit/foundations`；没有任何 module 时会进入 `/workspace`。Examples registration 被删除后，旧的 `/dashboard`、`/users*` 等兼容路径也会按预期消失。

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
