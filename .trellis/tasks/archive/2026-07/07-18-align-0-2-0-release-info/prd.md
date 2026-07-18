# 对齐 0.2.0 公开发布信息

Status: Confirmed 2026-07-18

## Goal

把仓库公开信息对齐到已经 publish、registry-smoke 并晋升为 npm `latest` 的 `create-super-admin@0.2.0` release line，通过受保护分支 PR 交付文档变更，并在 PR 合并后创建与独立 package 版本矩阵一致的 `v0.2.0` Git tag 和 GitHub Release。

## What I already know

- npm `latest` 与 `next` 已一致：CLI/core `0.2.0`、UI `0.1.6`、theme runtime `0.1.5`、五个 theme profiles `0.1.4`。
- `Publish next` workflow、standard registry smoke、多主题 registry smoke 与 `@latest` starter check 已通过。
- GitHub 最新 Release 仍是 `v0.1.9`；既有 repository Release/tag 以 public starter CLI 版本命名。
- README 状态行、根 CHANGELOG、双语 public-presentation 是本轮需要更新的真实公开入口。
- 普通用户安装命令继续使用 `@latest`；不把独立 package 误写成 lockstep `0.2.0`。

## Confirmed Scope

- 采用“发布闭环 + GitHub About 审计”：文档状态、changelog、Release copy、PR、合并后 tag/Release，并核对 repository metadata。
- Release title 聚焦“扩展契约 + production-ready starter quality”，详细列出版本矩阵。
- 当前 GitHub description、Pages website、topics、public visibility 和 HTTPS 已符合推荐值，因此不执行无意义的 metadata rewrite。

## Requirements (evolving)

- 更新 README 的 current public package line，表达 independent-version release matrix。
- 在根 `CHANGELOG.md` 增加 `0.2.0 - 2026-07-18` repository-level 条目。
- 同步更新中英文 `public-presentation` 的 npm 快照与 `v0.2.0` Release 文案。
- 审计 GitHub About description、website、topics、visibility 与 Pages/HTTPS 状态；字段已对齐时只记录验证证据，不重复 mutation。
- 保持 `@latest` 安装命令、frontend-first/mock-backed 边界和 maintainer-tooling boundary。
- 走 topic branch -> checks -> PR -> CI -> merge 的 protected-main 流程。
- PR 合并后复核 npm/GitHub 状态，再创建并推送 `v0.2.0` tag 与 GitHub Release。

## Acceptance Criteria (evolving)

- [x] README 不再声称当前公开 package line 是 `0.1.x`，且不误导为全仓 lockstep 版本。
- [x] 根 changelog 有准确的 `0.2.0` repository-level release entry。
- [x] 双语 public-presentation 显示真实 npm `latest = next` 矩阵与 `v0.2.0` Release copy。
- [x] README、package READMEs、SECURITY、双语 docs、package changelogs的审计结论有记录。
- [x] GitHub About description、website、topics、public visibility 和 Pages HTTPS 状态与推荐值一致；已一致字段不重复修改。
- [x] `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm docs:build` 通过。
- [ ] PR 基于最新 `origin/main`，CI 全绿且 merge state clean/mergeable。
- [ ] tag/Release 只在 PR 合并后创建，且 tag 指向包含公开信息的 merged `main`。
- [ ] 最终 `v0.2.0` GitHub Release 清楚列出 independent package versions 和普通用户安装入口。
- [ ] 不重复执行 npm publish 或 npm dist-tag mutation。

## Definition of Done

- 公开文档、npm dist-tags、Git tag 和 GitHub Release 状态相互一致。
- 变更通过本地完整检查与 GitHub CI。
- GitHub Release 文案准确表达扩展性、质量基线与可选边界。
- 最终一致性审计明确列出已对齐入口与剩余独立工作。

## Technical Approach

只修改承担当前发布状态或 repository-level release note 职责的文件。版本无关的用户入口继续使用 `@latest`；具体版本只出现在 README 状态、root changelog、current public state 和 Release copy。PR 合并后用 `v0.2.0` 标记同步后的 `main`，再以同一 tag 创建非 prerelease GitHub Release。

## Decision (ADR-lite)

**Context**: 本仓库 package 独立版本，但既有 GitHub Release line 一直以 public starter CLI 版本命名。

**Decision**: 延续 `v0.2.0` repository Release tag，并在 Release body 中显式列出 core/theme/profile/UI/CLI 的独立版本。

**Consequences**: 保持公开历史连续；读者不会因为 generic tag 误解所有 package 都同步到 `0.2.0`。未来若改为 per-package releases，应通过独立迁移任务统一 tag scheme。

## Out of Scope (explicit)

- 再次运行 npm publish、npm dist-tag 或修改 `bootstrap`。
- 修改 starter/runtime/package behavior。
- 把 maintainer-only Trellis、release smoke 或 reference backend 工具变成用户必需项。
- 处理 Dependabot alerts 或依赖升级。
- 创建截图/GIF、social preview 或补建历史 Release。
- 在当前值已符合推荐值时重复写入 GitHub About settings。

## Technical Notes

- 详细审计见 [`research/release-surface-audit.md`](research/release-surface-audit.md)。
- Release implementation source: PR #52 (`ed12954`); release-prep merge: PR #54 (`25cbfc6`).
- Current Latest GitHub Release: `v0.1.9`.
- GitHub About audit: description、Pages website 与 10 个 topics 已完全匹配 `docs/guide/public-presentation.md`；repository 为 public，Pages 为 workflow deployment、public、HTTPS enforced。
- Public delivery rules: `.trellis/spec/shared/public-delivery.md`.
