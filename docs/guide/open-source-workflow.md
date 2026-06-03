# Open Source Workflow

This project uses a lightweight open-source workflow while it prepares for npm release.

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

The project is not npm-ready yet. The intended release path is:

1. Stabilize open-source project docs and CI.
2. Define package publish boundaries.
3. Add an internationalization foundation with `zh-CN` as the default locale and `en-US` as an optional locale.
4. Migrate user-facing admin UI text away from hard-coded English before CLI generation.
5. Add CLI generation with `zh-CN` as the default generated-project locale.
6. Verify CLI-generated projects with install, typecheck, test, build, and startup smoke.
7. Run optional reference backend smoke against generated output before documenting real API connectivity.

Do not document CLI commands or publish workflows as available until they exist in code and package scripts.
