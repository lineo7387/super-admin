# Open Source Workflow

This project uses a lightweight open-source workflow for ongoing `0.x` development and npm releases.

## Branches

`main` is the stable development branch.

Use focused feature branches:

```text
feat/cli-scaffold
fix/auth-redirect
docs/api-adapters
codex/open-source-readiness
```

## Commits

Use this required Conventional Commits shape:

```text
<type>(<scope>): <description>
```

`scope` is required and should name the affected area. Use concise Chinese descriptions:

```text
feat(login): 新增用户登录功能
fix(auth): 修复登录后重定向丢失
docs(ai): 新增 AI 协作指南
test(reference): 增加登录令牌烟测
chore(codegraph): 添加项目级 MCP 配置
refactor(modules): 简化模块注册逻辑
```

Common scopes include:

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

Pull requests should be small enough to review in one pass. Keep unrelated changes in separate PRs.

Before opening a PR, run the relevant checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

Run `pnpm test:reference` before claiming that the admin app connects to the optional reference backend through a real browser/API/token flow.

## Release Direction

Package publish boundaries, the optional `create-super-admin` CLI, generated starter validation, and dependency-aware release automation are now present in the repository. Use [Releasing](./releasing.md) as the source of truth for release preparation, selected package planning, registry smoke, and promotion.

The default admin app remains frontend-first and mock-backed. Release tooling and the CLI are maintainer and scaffolding surfaces; they should not make backend, database, auth, AI, or generated schema setup mandatory for users.

Before documenting a new command or workflow as available, verify that it exists in code, package scripts, and the release guide. Do not run registry-mutating commands such as `npm publish`, `npm trust`, `npm dist-tag`, or `npm stage` without explicit approval.
