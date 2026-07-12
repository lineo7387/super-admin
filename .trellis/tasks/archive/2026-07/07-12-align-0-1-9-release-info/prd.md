# 对齐 0.1.9 发布信息

## Goal

在不重新发布 npm、不修改 dist-tags、也不提前创建 Git tag 或 GitHub Release 的前提下，把仓库内公开发布信息对齐到已经 smoke-verified 的 `create-super-admin@0.1.9`，通过受保护分支 PR 交付文档变更，并为合并后经用户单独确认创建 `v0.1.9` Release 准备准确文案。

## Requirements

- 审计 README、CLI README、中英文发布指南、根与 package changelog、npm dist-tags、Git tags 和 GitHub Releases。
- 修复 `docs/guide/releasing.md` 与 `docs/en/guide/releasing.md` 的 registry smoke 命令，在非交互 CLI 调用中显式传入 `--theme base`。
- 在根 `CHANGELOG.md` 增加 repository-level `0.1.9` 发布说明，概括命令面板/快捷键契约修复与生成器单源化重构；package 级细节继续以 `packages/cli/CHANGELOG.md` 为准。
- 更新中英文 `public-presentation` 的当前 npm 状态与待创建的 `v0.1.9` Release 文案，同时避免在 Release 实际创建前声称它已经存在。
- README 与 CLI README 只在发现真实不一致时修改；当前动态使用 `@latest` / `0.1.x` 且 CLI README 已说明非交互 theme flag，因此不硬编码 `0.1.9`。
- 运行项目完整质量检查与发布相关 focused checks。
- 创建 `codex/` topic branch，按项目提交约定提交、同步 `origin/main`、推送并创建 PR，持续等待 CI，CI 通过后报告 merge-ready 并等待用户确认合并。
- PR 合并后，单独确认是否创建并推送 Git tag、创建 GitHub Release；未确认前不执行这两类 mutation。
- Release 创建后重新验证 npm、GitHub Release、README、CLI README、双语文档与 changelog 的一致性，并列出所有已对齐与仍未对齐入口。

## Acceptance Criteria

- [ ] 双语 registry smoke 命令均为 `pnpm dlx create-super-admin@next my-admin --theme base --pm pnpm`。
- [ ] 根 changelog 有明确的 `0.1.9` repository-level 条目，并保持 package-level changelog 边界。
- [ ] 双语 public-presentation 反映 npm `latest = next = create-super-admin@0.1.9`，其他独立 package 版本保持真实值。
- [ ] Release draft copy 准确覆盖 0.1.9 的两类变化，并明确普通用户入口仍为 `npm create super-admin@latest my-admin`。
- [ ] README 与 CLI README 的审计结论有记录，未为版本号制造不必要硬编码。
- [ ] `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm docs:build`、`pnpm validate:starter`、`pnpm validate:publish` 全部通过。
- [ ] PR 基于最新 `origin/main`，CI 全绿且 merge state clean/mergeable。
- [ ] npm publish、npm dist-tag、Git tag、GitHub Release 均未在对应用户确认前变更。

## Definition of Done

- 公开文档与实际 npm 状态一致，maintainer-only release workflow 边界清晰。
- 变更通过本地完整检查和 PR CI。
- 合并与 Release 创建分别停在独立用户确认关口。
- 最终一致性审计明确列出已对齐和剩余入口。

## Technical Approach

只更新承担发布状态或发布说明职责的公开文件：双语 releasing、根 changelog、双语 public-presentation。把版本无关的用户入口继续写成 `@latest`，把具体版本只放在 current public state、repository changelog 和 Release copy 等确实需要快照的区域。

## Decision (ADR-lite)

**Context**：仓库是 independent-version monorepo，本次只有 `create-super-admin` 升至 `0.1.9`，因此 `v0.1.9` 与 `create-super-admin@0.1.9` 都有表面合理性。

**Decision**：继续使用 `v0.1.9`。现有公开 tags/releases 全部使用 `v0.1.x`；v0.1.7 Release notes 还明确说明 GitHub Release 以 public starter CLI version 命名，而其他 packages 保持独立版本。`v0.1.9` 因此是既有仓库 Release 线的延续，不代表所有 packages 同步为 `0.1.9`。

**Consequences**：Release notes 必须明确列出各 package 的实际独立版本，避免读者误解。未来若仓库改为每个 package 都发布 GitHub Release，应通过独立规范迁移任务统一切换 tag scheme，而不是在本次 patch 临时混用命名。

## Out of Scope

- 重新发布任何 npm package。
- 修改任何 npm dist-tag。
- 在 PR 合并及用户单独确认前创建或推送 Git tag。
- 在 PR 合并及用户单独确认前创建 GitHub Release。
- 为 0.1.8 补建历史 GitHub Release。
- 修改普通用户的 starter/runtime 行为，或把 Trellis、release smoke 等 maintainer-only 工具变成用户必需项。
- 仅为了出现 `0.1.9` 而修改动态 README 命令、tests fixtures 或无关 package metadata。

## Technical Notes

- 2026-07-12 registry 审计：`create-super-admin` 的 `version`、`latest`、`next` 均为 `0.1.9`。
- 其他 npm `latest`/`next`：core `0.1.3`、ui `0.1.5`、theme `0.1.4`、各 theme profile `0.1.3`。
- 当前 Git tags：`v0.1.2`、`v0.1.6`、`v0.1.7`；当前 Latest Release 为 `v0.1.7`。
- `README.md` 使用 `@latest` 与 `0.1.x`，没有陈旧具体版本。
- `packages/cli/README.md` 没有陈旧具体版本，且已说明 non-interactive environment 必须传 `--theme` 或 `--themes`。
- 详细审计见 [`research/release-surface-audit.md`](research/release-surface-audit.md)。
