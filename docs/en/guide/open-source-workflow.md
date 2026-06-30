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
- Require conversation resolution before merging.
- Require status checks to pass before merging.
- Require the `checks` status check from the `CI` workflow.
- Block force pushes.
- Block branch deletion.
- Apply restrictions to administrators when available.
- Keep bypass lists empty unless there is a documented emergency reason.

For the solo-maintainer phase, do not require approval or Code Owner review yet; otherwise owner-authored PRs may be impossible to merge. Once the project has a second trusted maintainer, enable:

- Require at least 1 approval.
- Require review from Code Owners, using `.github/CODEOWNERS`.
- Dismiss stale approvals when new commits are pushed.

Recommended repository merge settings:

- Enable squash merge as the default merge path.
- Optionally keep rebase merge enabled for maintainer-only linear history.
- Disable merge commits if you want compact history.
- Enable automatically delete head branches after merge.

## Security Automation

The repository includes `.github/dependabot.yml` for scheduled GitHub Actions and pnpm/npm dependency update pull requests. Dependabot PRs should go through the same branch protection and CI flow as human-authored PRs; add CODEOWNERS review once a second maintainer is available.

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

## AI Push / PR Completion Checklist

When a maintainer asks an AI agent to “push following the project workflow”, “finish the push flow”, or similar, completion does not mean only running `git push`. The AI must advance the work until a pull request is created or reused, CI status is checked, and a merge-ready report is provided.

The AI must run this sequence:

1. Confirm the current branch is not `main`, the working tree is clean, and the current branch is the intended work branch.
2. Run `git fetch origin main`, then confirm the branch is based on the latest `origin/main`; if it is behind, integrate the latest `origin/main` with the project-appropriate strategy, usually rebase for a topic branch.
3. Re-run the pre-PR checks:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   pnpm docs:build
   ```
   For generated starter or CLI starter output changes, also run `pnpm validate:starter`; for package publish/readiness changes, also run `pnpm validate:publish`; before claiming real optional reference backend connectivity, also run `pnpm test:reference`.
4. Inspect `git status`, recent commits, and the `origin/main...HEAD` diff scope to confirm there are no unrelated changes.
5. Push the topic branch. Never push directly to `main`.
6. Use `gh pr list --head <branch>` to find an existing PR; create one if none exists. The PR body must explain the problem, root cause, fix, verification commands, and remaining risks.
7. Check `gh pr checks <number>` and `gh pr view <number>`. If CI is still running, report “the flow is not complete yet; waiting on CI” and keep polling or wait for the user’s decision; if CI fails, report the failure and stop; only report merge-ready when CI passes and the PR merge state is clean/mergeable.
8. Keep the topic branch until the PR is merged. Only after merge should the maintainer sync local `main` and delete the remote/local topic branch.

The final AI report must include:

- PR link, PR number, and base/head branches.
- Whether local and remote branches are synchronized, plus ahead/behind relative to `origin/main`.
- Local verification commands and results.
- GitHub CI / `checks` result.
- PR merge state and whether it is merge-ready.
- Branch handling guidance: keep it before merge; delete it after merge.

## Bug Fix Workflow

When you find a bug, use this route instead of changing `main` directly:

```text
Issue -> reproduce -> fix branch -> failing test -> fix -> verify -> PR -> CI -> merge
```

1. **Record the bug**: open a GitHub issue for normal bugs, including symptoms, reproduction steps, expected behavior, and environment. Do not disclose security issues publicly; use the private reporting path in `SECURITY.md`.
2. **Sync and reproduce**:
   ```bash
   git checkout main
   git pull origin main
   ```
   Find the smallest reproduction you can, then identify the affected area such as `admin`, `api`, `cli`, `docs`, or `release`.
3. **Create a fix branch**:
   ```bash
   git checkout -b fix/<scope>-<short-bug-name>
   ```
   Examples: `fix/auth-login-redirect`, `fix/cli-starter-theme`.
4. **Add the test first**: when practical, add a regression test that exposes the bug. UI behavior bugs may need component or logic tests; CLI or generated starter bugs should add or run starter validation.
5. **Fix narrowly**: avoid unrelated refactors. Preserve the frontend-first, mock-backed default and the adapter boundary.
6. **Run verification**:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
   Run `pnpm docs:build` for docs changes, `pnpm validate:starter` for generated starter changes, and `pnpm test:reference` for optional reference backend claims.
7. **Commit the fix**:
   ```bash
   git add <files>
   git commit -m "fix(scope): 简短中文描述"
   ```
8. **Open a PR**:
   ```bash
   git push -u origin fix/<scope>-<short-bug-name>
   gh pr create --base main --head fix/<scope>-<short-bug-name>
   ```
   Explain the bug, root cause, fix, verification commands, and remaining risks.
9. **Merge and clean up**: merge only after `CI / checks` passes and protected `main` requirements are satisfied. After merge, sync `main` and delete the local fix branch.

If the same class of bug appears repeatedly, update `.trellis/spec/` or the relevant docs so future AI tools and maintainers can read the lesson.

## Release Direction

Package publish boundaries, the optional `create-super-admin` CLI, generated starter validation, and dependency-aware release automation are now present in the repository. Use [Releasing](./releasing.md) as the source of truth for release preparation, selected package planning, registry smoke, and promotion.

The default admin app remains frontend-first and mock-backed. Release tooling and the CLI are maintainer and scaffolding surfaces; they should not make backend, database, auth, AI, or generated schema setup mandatory for users.

Before documenting a new command or workflow as available, verify that it exists in code, package scripts, and the release guide. Do not run registry-mutating commands such as `npm publish`, `npm trust`, `npm dist-tag`, or `npm stage` without explicit approval.

## Public Delivery Boundary

Keep public repository docs, root scripts, generated starter behavior, and npm release state aligned. When a release or CLI capability moves from future work to available behavior, update the root README, security/changelog wording, and relevant docs in the same change.

Maintainer workflow tools such as Trellis, Codex/Claude hooks, CodeGraph, task archives, and AI skills may support repository development, but they are not generated starter requirements. Do not document them as required setup for ordinary users, and do not copy them into generated projects.
