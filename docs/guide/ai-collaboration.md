# AI 协作

Super Admin 适合和 AI coding tools 一起使用，但这些工具需要先理解项目边界。

## 核心规则

默认 scaffold 是前端优先、mock-backed 的。AI agents 不应让后端、数据库、auth provider、AI provider、generated schema 或维护者专用工具成为普通使用的必需条件。

## 数据流

Data-backed features 使用这条路径：

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

告诉 AI tools：

- Vue pages 不应直接调用 `fetch`、Axios、Hono clients 或 backend SDKs。
- Query composables 调用 API adapters。
- API adapters 把 mock data 或 user API responses 归一化成 module frontend types。
- Mock data 位于 `apps/admin/src/api/mock/`。
- Reference backend helpers 只应存在于 optional reference adapter files 下。

## State Ownership

- Pinia 负责 client state：preferences、shell layout、workspace tabs、runtime auth session。
- TanStack Query 负责 server/cache state。
- 不要在 Pinia 中重复 server cache。
- 不要把 bearer tokens 或 secrets 持久化到 local storage。

## 用户可见文案

Super Admin 以 `zh-CN` 作为默认 locale，并提供 `en-US` 文档。AI agents 新增或修改用户可见 UI 文案时，应提供默认中文消息，避免新增 English-only copy。

不要翻译 internal route names、API fields、test IDs、package names 或 maintainer-only tool names。

## 只换 Adapter vs 完整重塑

当 screen 已经符合业务工作流时，使用 adapter-only replacement。

当 workflow 不同时，重塑 module。以下内容要一起更新：

- page 和 module components
- module types
- query params
- query composables
- API adapter

不要为了复用示例 module type，反过来强迫用户的 backend 适配示例形状。

## Prompt Starter

在生成或克隆的 Super Admin 项目中使用 AI tool 时，可以附上这段上下文：

```text
This is a frontend-first Vue admin template. Keep data access on Page -> query composable -> API adapter -> mock/user API. Do not call transport directly from Vue pages. Pinia is for client state; TanStack Query is for server/cache state. The backend, auth provider, database, AI provider, and CodeGraph are optional unless I explicitly ask to add them.
Use zh-CN as the default for new user-facing UI copy unless I explicitly ask for another locale.
```

## 好的请求

```text
Replace the users API adapter with my REST API while keeping the page and query composable unchanged.
```

```text
Reshape the users module into an approvals workflow. Update the page, types, query params, query composable, adapter, and tests together.
```

```text
Add a new UI primitive to packages/ui and show it in the UI Kit without adding business-specific copy.
```

## 风险请求

```text
Fetch users directly in UsersAllPage.vue.
```

```text
Put API responses in the Pinia preferences store.
```

```text
Make the default scaffold require the reference backend.
```

这些会绕开模板边界，让项目更难适配。

## 维护者工具

CodeGraph 可能通过此仓库的 `.mcp.json` 可用。它是维护者侧的代码导航辅助。生成项目不应依赖它。

源码仓库里的 Trellis、Codex、Claude、CodeGraph 和其他 AI workflow files 是维护者工作流辅助。它们可以帮助贡献者开发这个仓库，但不是 generated starter contract 的一部分，也不应被描述成必需用户设置。

当要求 AI 修改 public docs、package scripts、generated starter output、release guidance 或 repository-root workflow files 时，请先告诉它读取 `.trellis/spec/shared/public-delivery.md`。这个 spec 记录了 public delivery boundary：普通用户应收到什么、维护者内容放在哪里，以及 docs 如何与真实 npm/package 状态保持一致。
