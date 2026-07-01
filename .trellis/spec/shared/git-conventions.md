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

## Before Pushing

When the user asks an AI agent to push a work branch to a remote, the agent must first synchronize the branch with the latest `main`:

1. Confirm the working tree is clean and the current branch is the intended work branch.
2. Fetch latest remote refs, including `origin/main`.
3. Integrate latest `origin/main` into the work branch with the project-appropriate strategy, usually rebase for a topic branch or merge when preserving merge context is intentional.
4. Resolve conflicts without discarding unrelated user work.
5. Re-run the relevant verification commands for the changed surface.
6. Inspect `git status`, recent commit history, and the final diff scope.
7. Push the work branch only after the branch is based on latest `main` and verification passes.

Do not direct-push to `main` for normal work. Use the protected-branch PR flow for integration unless the user explicitly requests a different owner-approved emergency path.

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

## AI Push / PR Completion

When the user asks an AI agent to push using the project workflow, the request means the full protected-branch path, not only `git push`.

Required interpretation:

```text
sync with origin/main -> verify -> push topic branch -> create or reuse PR -> check CI -> report merge readiness
```

Rules:

- Never stop after only pushing the branch unless the user explicitly says to push only.
- Before creating or updating the PR, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm docs:build`.
- Add focused checks for the changed surface:
  - generated starter or CLI starter output: `pnpm validate:starter`
  - publish/readiness/package release surfaces: `pnpm validate:publish`
  - real optional reference backend connectivity claims: `pnpm test:reference`
- Use `gh pr list --head <branch>` before creating a PR so an existing PR is reused instead of duplicated.
- After PR creation, check `gh pr checks <number>` and `gh pr view <number>`.
- If CI is pending or in progress, say the workflow is not complete yet and either keep polling or ask the user whether to wait.
- If CI fails, report the failing check and stop; do not call the branch merge-ready.
- Only report merge-ready when CI passes and the PR merge state is clean or mergeable.
- Do not delete the topic branch before PR merge. Delete remote/local topic branches only after merge and after local `main` is synchronized.

Final push/PR reports must include:

```text
PR: <number + URL>
Branch: <head> -> <base>
Sync: <local/remote sync + origin/main ahead/behind>
Local verification: <commands and pass/fail>
CI: <checks pass/fail/pending + link if available>
Merge state: <clean/blocked/dirty/unknown>
Branch cleanup: <keep until merge / safe to delete after merge>
```
