# 开源工作流

这个项目在 `0.x` 开发和 npm releases 期间使用轻量开源工作流。

## Branches

`main` 是稳定开发分支，应通过 GitHub branch protection 或 repository ruleset 保护。

使用聚焦的 feature branches：

```text
feat/cli-scaffold
fix/auth-redirect
docs/api-adapters
codex/open-source-readiness
```

外部贡献者默认使用 fork + pull request。维护者日常开发也应使用短生命周期 topic branch + pull request；不要为了普通功能、修复、文档或 release-prep work 直接 push 到 `main`。

## Repository Permissions

公开仓库并不意味着任何人都能 push。外部用户只能通过 fork/PR 贡献，除非仓库 owner 把他们加入 collaborators。

个人账号仓库的 collaborator 权限较宽，一旦邀请就有直接写入能力。只把可信维护者加入 collaborator；普通贡献者继续走 fork/PR。如果项目以后需要 triage-only、write、maintain、admin 等更细权限，把仓库迁移到 GitHub organization 更合适。

## Protected Main Checklist

推荐在 GitHub `Settings -> Rules -> Rulesets` 或 `Settings -> Branches -> Branch protection rules` 中保护 `main`：

- Require a pull request before merging.
- Require conversation resolution before merging.
- Require status checks to pass before merging.
- Require the `checks` status check from the `CI` workflow.
- Block force pushes.
- Block branch deletion.
- Apply restrictions to administrators when available.
- Keep bypass lists empty unless there is a documented emergency reason.

单人维护期推荐先不要求 approval 和 Code Owner review，否则 owner 自己开的 PR 可能无法合并。等项目有第二个可信维护者后，再开启：

- Require at least 1 approval.
- Require review from Code Owners, using `.github/CODEOWNERS`.
- Dismiss stale approvals when new commits are pushed.

推荐 repository merge settings：

- Enable squash merge as the default merge path.
- Optionally keep rebase merge enabled for maintainer-only linear history.
- Disable merge commits if you want the history to stay compact.
- Enable automatically delete head branches after merge.

## Security Automation

仓库文件已经提供 `.github/dependabot.yml`，用于 GitHub Actions 和 pnpm/npm dependencies 的定期 update PR。Dependabot PR 应和普通 PR 一样经过 branch protection 和 CI；有第二个维护者后再纳入 CODEOWNERS review。

推荐在 GitHub `Settings -> Advanced Security` 中开启：

- Dependency graph.
- Dependabot alerts.
- Dependabot security updates.
- Private vulnerability reporting.
- Secret scanning.
- Secret scanning push protection.

推荐保持 GitHub Actions default workflow permissions 为 read-only，只在特定 workflow 中声明需要的权限。当前 Pages 和 publish-next workflows 已经使用显式 `permissions`。

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

## AI Push / PR Completion Checklist

当维护者要求 AI “按照项目流程 push”、“走完整 push 流程”或类似表达时，完成定义不是只执行 `git push`。AI 必须把流程推进到 PR 已创建或复用、CI 状态已确认，并给出 merge-ready 报告。

AI 必须按顺序执行：

1. 确认当前分支不是 `main`，工作树干净，且当前分支是本次工作分支。
2. `git fetch origin main`，确认分支基于最新 `origin/main`；若落后，先用适合 topic branch 的方式集成最新 `origin/main`，通常是 rebase。
3. 重新运行 PR 前检查：
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   pnpm docs:build
   ```
   影响 generated starter 或 CLI starter 输出时，额外运行 `pnpm validate:starter`；影响 package publish/readiness 时，额外运行 `pnpm validate:publish`；涉及 optional reference backend 真实连接声明时，额外运行 `pnpm test:reference`。
4. 检查 `git status`、最近提交和 `origin/main...HEAD` diff scope，确认没有无关改动。
5. push topic branch。不得直接 push 到 `main`。
6. 使用 `gh pr list --head <branch>` 查找已有 PR；没有则创建 PR。PR body 必须说明问题、原因、修复、验证命令和剩余风险。
7. 查询 `gh pr checks <number>` 和 `gh pr view <number>`。如果 CI 仍在运行，报告“流程未完成，正在等待 CI”，并继续轮询或等待用户决定；如果 CI 失败，报告失败并停止；只有 CI 通过且 PR merge state clean/mergeable 时，才能报告 merge-ready。
8. PR merge 前保留 topic branch。只有 PR merge 后，才同步本地 `main` 并删除远端/本地 topic branch。

AI 的最终反馈必须包含：

- PR 链接、PR 编号、base/head 分支。
- 本地分支与远端分支是否同步，以及相对 `origin/main` 的 ahead/behind。
- 本地验证命令和结果。
- GitHub CI / `checks` 结果。
- PR merge state 和是否 merge-ready。
- 分支处理建议：PR merge 前保留；merge 后再删除。

## Bug Fix Workflow

发现 bug 后，使用这条路线，避免直接在 `main` 上修：

```text
Issue -> reproduce -> fix branch -> failing test -> fix -> verify -> PR -> CI -> merge
```

1. **记录 bug**：普通问题开 GitHub issue，写清楚现象、复现步骤、期望结果和环境。安全问题不要公开，走 `SECURITY.md` 的私密报告路径。
2. **同步并复现**：
   ```bash
   git checkout main
   git pull origin main
   ```
   尽量找出最小复现路径，并判断影响范围，例如 `admin`、`api`、`cli`、`docs`、`release`。
3. **创建修复分支**：
   ```bash
   git checkout -b fix/<scope>-<short-bug-name>
   ```
   例子：`fix/auth-login-redirect`、`fix/cli-starter-theme`。
4. **先补测试**：能用测试复现的 bug，先加 regression test。UI 行为 bug 可补组件/逻辑测试；CLI 或 generated starter bug 要补或运行 starter validation。
5. **修复代码**：保持改动聚焦，不顺手重构无关代码。继续守住 frontend-first、mock-backed 和 adapter boundary。
6. **运行验证**：
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
   改 docs 运行 `pnpm docs:build`；影响 generated starter 运行 `pnpm validate:starter`；涉及 optional reference backend 运行 `pnpm test:reference`。
7. **提交修复**：
   ```bash
   git add <files>
   git commit -m "fix(scope): 简短中文描述"
   ```
8. **打开 PR**：
   ```bash
   git push -u origin fix/<scope>-<short-bug-name>
   gh pr create --base main --head fix/<scope>-<short-bug-name>
   ```
   PR 里说明问题、原因、修复方式、验证命令和剩余风险。
9. **合并和清理**：等待 `CI / checks` 通过并满足 protected `main` 规则后再 merge。合并后同步 `main`，删除本地修复分支。

如果同类 bug 反复出现，更新 `.trellis/spec/` 或相关 docs，把复盘结论沉淀成未来 AI 和维护者能读到的规则。

## Release Direction

Package publish boundaries、可选 `create-super-admin` CLI、generated starter validation 和 dependency-aware release automation 已经存在于仓库中。使用 [发布流程](./releasing.md) 作为 release preparation、selected package planning、registry smoke 和 promotion 的事实来源。

默认 admin app 保持 frontend-first 和 mock-backed。Release tooling 和 CLI 是维护者与 scaffolding surfaces；它们不应让 backend、database、auth、AI 或 generated schema setup 成为用户必需项。

在把新命令或 workflow 写成可用之前，确认它存在于 code、package scripts 和 release guide 中。没有明确批准时，不要运行 `npm publish`、`npm trust`、`npm dist-tag` 或 `npm stage` 这类 registry-mutating commands。

## Public Delivery Boundary

保持 public repository docs、root scripts、generated starter behavior 和 npm release state 一致。当 release 或 CLI 能力从 future work 变为 available behavior 时，在同一次改动中更新 root README、security/changelog wording 和相关 docs。

Trellis、Codex/Claude hooks、CodeGraph、task archives 和 AI skills 等维护者 workflow tools 可以支持仓库开发，但它们不是 generated starter requirements。不要把它们描述成普通用户必需设置，也不要复制进生成项目。
