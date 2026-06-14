# 快速开始

这篇指南面向想用 Super Admin 创建自己 admin 项目的用户。如果你要贡献 `lineo7387/super-admin` 源码仓库，请看后面的源码仓库开发部分。

## 创建你的 Admin App

使用公开 npm starter：

```bash
npm create super-admin@latest my-admin
cd my-admin
npm install
npm run dev
```

更偏好 pnpm：

```bash
pnpm dlx create-super-admin@latest my-admin --pm pnpm
cd my-admin
pnpm install
pnpm dev
```

生成出来的项目就是你的应用。它会比这个源码仓库更小，不包含发布自动化、维护者 AI workflow 文件、docs 站点或可选 reference smoke 工具。

## 定制 Starter

先看这些位置：

- `src/modules/`：示例 routes 和 pages，可以改造成你的业务模块。
- `src/api/`：API adapters，用来归一化 mock 数据或你的 API 响应。
- `src/api/mock/`：可替换的 mock 数据源。
- 主题和布局配置：设计 profiles、color mode 和 shell layout。

默认 starter 不要求：

- backend server
- database 或 ORM
- auth provider
- AI provider
- 固定 API response shape
- release、GitHub、Trellis、Codex 或 Claude workflow tooling

## 开发源码仓库

只有当你要贡献 `lineo7387/super-admin` 本身，修改 packages、docs、release scripts 或模板源码时，才需要走这条路径。

### 前置条件

- 与仓库 toolchain 兼容的 Node.js。
- 与 root `packageManager` 字段匹配的 pnpm。

安装依赖：

```bash
pnpm install
```

运行 admin app：

```bash
pnpm dev
```

运行文档站点：

```bash
pnpm docs:dev
```

构建整个 workspace：

```bash
pnpm build
```

## 源码仓库地图

- `apps/admin/src/modules/examples/`：可复制的示例 routes。
- `apps/admin/src/modules/ui-kit/`：shared primitive 展示。
- `apps/admin/src/api/`：模块 API adapters。
- `apps/admin/src/api/mock/`：mock API 数据源。
- `packages/ui/`：共享 admin UI primitives。
- `packages/core/`：共享 frontend contracts。
- `packages/theme/`：内置 design profiles 和 token helpers。

## 源码仓库边界

源码仓库包含用于开发和发布 Super Admin 的维护者材料。这些材料必须留在生成项目之外，也不是你在自己 app 中使用 Super Admin 的必需条件。

`create-super-admin` 生成的项目仍应避免强制要求：

- backend server
- database 或 ORM
- auth provider
- AI provider
- 固定 API response shape
- CLI generation 或 release tooling

这些能力可以后续按需添加，但不应成为运行或定制前端模板的前提。
