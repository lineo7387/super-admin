# 开源工作流

这个项目在 `0.x` 开发和 npm releases 期间使用轻量开源工作流。

## Branches

`main` 是稳定开发分支。

使用聚焦的 feature branches：

```text
feat/cli-scaffold
fix/auth-redirect
docs/api-adapters
codex/open-source-readiness
```

## Commits

使用这个必需的 Conventional Commits 形状：

```text
<type>(<scope>): <description>
```

`scope` 必填，应命名受影响区域。描述使用简洁中文：

```text
feat(login): 新增用户登录功能
fix(auth): 修复登录后重定向丢失
docs(ai): 新增 AI 协作指南
test(reference): 增加登录令牌烟测
chore(codegraph): 添加项目级 MCP 配置
refactor(modules): 简化模块注册逻辑
```

常见 scopes 包括：

```text
admin
api
ui
theme
core
cli
docs
ci
reference
codegraph
```

## Pull Requests

Pull requests 应小到可以一次 review 完。把无关改动拆到不同 PR。

打开 PR 前运行相关检查：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

在声称 admin app 已通过真实 browser/API/token flow 连接 optional reference backend 前，先运行 `pnpm test:reference`。

## Release Direction

Package publish boundaries、可选 `create-super-admin` CLI、generated starter validation 和 dependency-aware release automation 已经存在于仓库中。使用 [发布流程](./releasing.md) 作为 release preparation、selected package planning、registry smoke 和 promotion 的事实来源。

默认 admin app 保持 frontend-first 和 mock-backed。Release tooling 和 CLI 是维护者与 scaffolding surfaces；它们不应让 backend、database、auth、AI 或 generated schema setup 成为用户必需项。

在把新命令或 workflow 写成可用之前，确认它存在于 code、package scripts 和 release guide 中。没有明确批准时，不要运行 `npm publish`、`npm trust`、`npm dist-tag` 或 `npm stage` 这类 registry-mutating commands。

## Public Delivery Boundary

保持 public repository docs、root scripts、generated starter behavior 和 npm release state 一致。当 release 或 CLI 能力从 future work 变为 available behavior 时，在同一次改动中更新 root README、security/changelog wording 和相关 docs。

Trellis、Codex/Claude hooks、CodeGraph、task archives 和 AI skills 等维护者 workflow tools 可以支持仓库开发，但它们不是 generated starter requirements。不要把它们描述成普通用户必需设置，也不要复制进生成项目。
