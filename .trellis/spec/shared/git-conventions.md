# Git Conventions

## Commit Style

Use this required Conventional Commits shape for work commits:

```text
<type>(<scope>): <description>
```

`scope` is required and should name the affected area in lowercase kebab-case or a short package/layer name.

Descriptions should be concise Chinese phrases:

```text
feat(login): 新增用户登录功能
fix(auth): 修复登录后重定向丢失
docs(ai): 新增 AI 协作指南
test(reference): 增加登录令牌烟测
chore(codegraph): 添加项目级 MCP 配置
refactor(modules): 简化模块注册逻辑
```

Prefer these common types:

```text
feat      用户可见功能或能力
fix       缺陷修复
docs      文档变更
test      测试覆盖或测试基础设施
refactor  不改变行为的代码重构
chore     工具、配置或维护工作
```

Common scopes include `admin`, `api`, `ui`, `theme`, `core`, `cli`, `docs`, `ci`, `reference`, `codegraph`, and feature names such as `auth`, `users`, or `shell`.

## Rules

- Do not include unrelated dirty files in a commit.
- Do not rewrite user changes.
- Keep generated or bookkeeping commits separate from implementation commits when Trellis workflow requires it.
- Keep local indexes, dependency folders, build output, and smoke artifacts out of commits.
- Use one focused commit per coherent change unit when possible.
- Do not claim a release or publish change unless package boundaries, changelog/release notes, and generated-project checks are addressed.

## Branches

Use short, descriptive branches:

```text
feat/cli-scaffold
fix/auth-redirect
docs/api-adapters
codex/open-source-readiness
```

`main` is the stable development branch.

## Pull Requests

Before opening or merging a pull request, run the relevant checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Run `pnpm test:reference` before claiming real API/reference backend connectivity.
