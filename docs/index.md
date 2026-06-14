---
layout: home

hero:
  name: Super Admin
  text: 前端优先的 admin 模板。
  tagline: 用 UI primitives、示例模块、mock 数据和可替换 API 适配器创建你自己的 Vue admin 项目。
  actions:
    - theme: brand
      text: 创建 Starter
      link: /guide/getting-started
    - theme: alt
      text: API 适配器
      link: /guide/api-adapters
    - theme: alt
      text: 维护者文档
      link: /guide/open-source-workflow

features:
  - title: Starter 优先
    details: 使用 npm create 生成自己的 admin app，然后定制模块、主题和 API 适配器。
  - title: 前端优先
    details: 默认应用无需后端、数据库、auth provider 或 AI provider 即可运行。
  - title: 可替换 API 适配器
    details: 页面调用模块 query composable，query 调用 API adapter，adapter 负责归一化 mock 数据或你的 API。
---

## 这是什么

Super Admin 是一个前端优先的开源 admin 模板。公开文档的主路径是：通过 `npm create super-admin@latest` 创建你自己的 admin 项目，然后把示例数据和模块替换成你的业务工作流。

默认 starter 有意保持 mock-backed。后端、数据库、auth、AI 和正式 API contract 都是可选集成面。

## 我应该走哪条路径？

| 路径 | 适合谁 | 从这里开始 |
| --- | --- | --- |
| 使用 Super Admin | 想从 npm starter 创建自己 admin app 的团队。 | [快速开始](guide/getting-started.md) |
| 接入你的 API | 想把 mock 数据替换成自己后端响应的用户。 | [API 适配器](guide/api-adapters.md) |
| 开发这个仓库 | 要修改 Super Admin 源码、packages、docs 或发布流程的维护者。 | [开源工作流](guide/open-source-workflow.md) |

Trellis、Codex/Claude 配置、发布脚本和 GitHub 展示清单都属于源码仓库维护者工具。它们不是 `create-super-admin` 生成项目的必需内容。
