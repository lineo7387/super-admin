# Contributing

Thanks for helping improve Super Admin.

## Project Boundary

Super Admin is a frontend-first admin template. Contributions should preserve the default scaffold behavior:

- No required backend.
- No required database or ORM.
- No required auth provider.
- No required AI provider.
- No backend SDK calls directly inside Vue pages.
- No generated-project dependency on maintainer-only validation tools.

Optional reference backend work belongs in `apps/api/` or maintainer validation scripts. The default admin app should stay mock-backed unless a task explicitly changes that behavior.

## Development Setup

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm docs:build
```

`pnpm test:reference` is a heavier maintainer smoke for the optional reference backend and admin adapter flow. Use it before release claims about real API connectivity.

## Branches

Use short, descriptive branches:

```text
feat/cli-scaffold
fix/auth-redirect
docs/api-adapters
codex/open-source-readiness
```

## Commit Messages

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

Common types:

```text
feat      用户可见功能或能力
fix       缺陷修复
docs      文档变更
test      测试覆盖或测试基础设施
refactor  不改变行为的代码重构
chore     工具、配置或维护工作
```

Keep unrelated work in separate commits. Do not include generated output, local indexes, or dependency folders.

## Pull Requests

Before opening a PR:

- Keep the change focused.
- Update docs when behavior or public guidance changes.
- Add or update tests for non-trivial logic.
- Provide default `zh-CN` copy for new user-facing UI text; avoid adding English-only UI copy.
- Run relevant checks.
- Explain user-facing impact and remaining trade-offs.

Use the pull request template when GitHub prompts for it.

## AI-Assisted Contributions

AI tools are welcome, but the contributor is responsible for the final result. Read `AGENTS.md` and `docs/guide/ai-collaboration.md` before asking an AI agent to modify this project.
