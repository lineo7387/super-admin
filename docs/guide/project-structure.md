# 项目结构

Super Admin 有两种形态：

- 给你自己的 admin app 使用的生成项目
- 用来开发和发布 Super Admin 本身的 pnpm monorepo 源码仓库

大多数用户从生成项目开始。贡献者和维护者才需要在源码仓库里工作。

## 生成项目

通过 `npm create super-admin@latest my-admin` 创建的项目，是一个聚焦的 Vue admin app。它不包含这个文档站点、发布自动化、可选 reference backend validation 或维护者 AI workflow 文件。

应用代码沿用源码模板里的前端层次：

```text
src/
  app/                 # app bootstrap 和 providers
  api/                 # API adapters
  api/mock/            # mock API 数据源
  i18n/                # locale messages 和 locale setup
  modules/             # feature 和 example modules
  router/              # route registration
  shell/               # app shell 和 layout presets
  stores/              # global Pinia stores
  styles/              # global CSS 和 Tailwind entrypoints
  super-admin/         # template bootstrap helpers
  workspace/           # workspace tabs 和 route surfaces
```

## 源码仓库

`lineo7387/super-admin` 仓库是模板、packages、docs、CLI 和维护者验证的开发工作区。

```text
apps/
  admin/              # Vue admin app
  api/                # optional reference API，用于 maintainer validation
packages/
  core/               # Shared frontend contracts
  theme/              # Design profiles 和 token helpers
  ui/                 # Admin UI primitives
  cli/                # create-super-admin scaffolder
docs/                 # VitePress documentation site
scripts/              # maintainer validation 和 release scripts
```

## Admin App

源码模板 app 位于 `apps/admin/`。生成项目使用相同的内部结构，但目录在自己的 `src/` 下。

```text
apps/admin/src/
  app/                 # app bootstrap、providers、router registration
  api/                 # API adapters
  api/mock/            # mock API 数据源
  i18n/                # locale messages 和 locale setup
  modules/             # feature 和 example modules
  router/              # route registration
  shell/               # app shell 和 layout presets
  stores/              # global Pinia stores
  styles/              # global CSS 和 Tailwind entrypoints
  super-admin/         # template bootstrap helpers
  workspace/           # workspace tabs 和 route surfaces
```

## 模块形态

一个 data-backed module 通常长这样：

```text
modules/users/
  users.manifest.ts
  users.types.ts
  users.queries.ts
  UsersAllPage.vue
  components/
```

页面负责组合 UI，并调用 module query composables。Query composables 调用 API adapters。API adapters 把 mock 数据或你的真实 API 响应归一化为模块的 frontend types。

## Shared Packages

- `packages/ui` 负责 domain-neutral admin primitives，例如 cards、buttons、alerts、tables、drawers、fields、selects、skeletons 和 status pills。
- `packages/theme` 负责内置 design profiles。
- `packages/core` 负责共享 frontend contracts 和 helpers。

业务专属 columns、copy、workflows 和 validation rules 应留在 modules 中，而不是放进 shared packages。
