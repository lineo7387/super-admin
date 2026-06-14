# API 适配器

默认数据流是：

```text
Page -> module query composable -> API adapter -> api/mock data or user API
```

这样可以让 pages 远离 transport 细节，也让 server/cache state 留在 TanStack Query，而不是 Pinia。

## 文件位置

```text
apps/admin/src/api/
  users.api.ts
  dashboard.api.ts
  workbench.api.ts
  access.api.ts
  mock/
    users.mock.ts
    dashboard.mock.ts
    workbench.mock.ts
    access.mock.ts

apps/admin/src/modules/users/
  users.queries.ts
  users.types.ts
```

## 只替换 Adapter

当示例页面已经符合你的业务工作流时，只需要把模块 API adapter 替换成你的 API 调用，并把响应归一化为模块 frontend type。

```ts
export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const response = await fetch('/api/users')
  const rows = await response.json()

  return {
    items: rows.map(normalizeUser),
    total: rows.length,
    page: params.page,
    pageSize: params.pageSize
  }
}
```

具体 transport 由你决定。REST、RPC、GraphQL 或自定义 SDK 都可以放在 adapter 后面，只要 pages 继续调用 module queries。

Super Admin 面向开源和局部采用设计。你可以只使用 UI primitives、复制一个示例模块，或替换所有 API adapters，而不必采用未来的 backend、CLI、auth、database 或 provider 工作。

## 完整重塑模块

如果你的业务工作流不同，不要强行把 API 塞进示例 shape。请一起重塑：

- page 和 module components
- module types
- query params
- query composables
- API adapter

示例 module types 是前端示例 contracts，不是通用 backend schemas。

## Contract Helpers

`@super-admin-org/core` 暴露了少量 TypeScript-first contract helpers，用于常见 adapter shape：

- `createPageListResult`：page-based admin tables
- `createCursorListResult`：stream-like lists
- `createMutationSuccess` 和 `createMutationFailure`：结构化 mutation feedback
- `normalizeAdapterError`：小型 UI-facing error payloads

这些 helpers 是可选的。它们不会引入 runtime schema library，也不要求你的后端匹配示例模块。

## Mock Data

Mock data 放在 `apps/admin/src/api/mock/`。Mock files 可以使用模拟 API field names。API adapters 负责把这些 shapes 适配成 module frontend types。

不要让 `api/mock` import module types。这个分离会让 mock data 更像外部数据源，也让 adapter boundary 更诚实。
