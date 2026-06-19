# Open Source Workflow

This project uses a lightweight open-source workflow for ongoing `0.x` development and npm releases.

## Branches

`main` is the stable development branch and should be protected with GitHub branch protection or a repository ruleset.

Use focused feature branches:

```text
feat/cli-scaffold
fix/auth-redirect
docs/api-adapters
codex/open-source-readiness
```

External contributors should use a fork and open a pull request. Maintainers should also prefer short-lived topic branches and pull requests for normal development. Do not push directly to `main` for ordinary feature, fix, docs, or release-prep work.

## Repository Permissions

A public repository does not mean everyone can push. External users can contribute through forks and pull requests unless the repository owner explicitly adds them as collaborators.

Personal-repository collaborator access is broad once granted. Add collaborators only for trusted maintainers; keep regular contributors on the fork/PR path. If the project later needs finer roles such as triage-only, write, maintain, and admin, move the repository into a GitHub organization.

## Protected Main Checklist

Recommended `main` protection under GitHub `Settings -> Rules -> Rulesets` or `Settings -> Branches -> Branch protection rules`:

- Require a pull request before merging.
- Require at least 1 approval.
- Require review from Code Owners, using `.github/CODEOWNERS`.
- Dismiss stale approvals when new commits are pushed.
- Require conversation resolution before merging.
- Require status checks to pass before merging.
- Require the `checks` status check from the `CI` workflow.
- Block force pushes.
- Block branch deletion.
- Apply restrictions to administrators when available.
- Keep bypass lists empty unless there is a documented emergency reason.

Recommended repository merge settings:

- Enable squash merge as the default merge path.
- Optionally keep rebase merge enabled for maintainer-only linear history.
- Disable merge commits if you want compact history.
- Enable automatically delete head branches after merge.

## Security Automation

The repository includes `.github/dependabot.yml` for scheduled GitHub Actions and pnpm/npm dependency update pull requests. Dependabot PRs should go through the same branch protection, CODEOWNERS review, and CI flow as human-authored PRs.

Recommended GitHub `Settings -> Advanced Security` features:

- Dependency graph.
- Dependabot alerts.
- Dependabot security updates.
- Private vulnerability reporting.
- Secret scanning.
- Secret scanning push protection.

Keep GitHub Actions default workflow permissions read-only and grant extra permissions only in the specific workflow that needs them. The Pages and publish-next workflows already use explicit `permissions`.

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

## Public Delivery Boundary

Keep public repository docs, root scripts, generated starter behavior, and npm release state aligned. When a release or CLI capability moves from future work to available behavior, update the root README, security/changelog wording, and relevant docs in the same change.

Maintainer workflow tools such as Trellis, Codex/Claude hooks, CodeGraph, task archives, and AI skills may support repository development, but they are not generated starter requirements. Do not document them as required setup for ordinary users, and do not copy them into generated projects.
