# 准备扩展性优化版本发布

> Requirements confirmed by the user on 2026-07-18. Scope: release-prep PR only; no registry mutation.

## Goal

消费 PR #52 合并后的 Changeset，为受影响的 npm packages 生成一致的版本与 CHANGELOG，完成发布前验证并通过受保护分支 PR 交付 release-prep 结果。

## What I already know

- PR #52 已 squash merge 到 `main`，本地与 `origin/main` 同步且工作树在任务创建前干净。
- 已存在 `.changeset/clean-starters-compose.md`，声明本轮 package 版本变更。
- 用户要求继续推进 release-prep。
- 本任务不默认执行 `npm publish`；registry mutation 必须遵守仓库 release workflow。
- npm registry 中所有受影响 package 的 `latest` 与 `next` 当前一致。
- 仓库规定的稳定发布路径是 `release-prep PR -> publish next -> registry smoke -> promote latest`，不是直接发布 `latest`。
- 2026-07-18 重新核对后，`origin/main`、pending Changeset 与 npm registry 版本均未发生漂移。

## Assumptions

- 优先复用仓库已有 Changesets 与 GitHub Actions 流程，不新增发布机制。
- release-prep 与实际 npm publish 保持为可审查、可中止的独立阶段；本任务只交付 release-prep PR。

## Open Questions

- 无。

## Requirements (evolving)

- 从已合并 Changeset 推导准确的 package 版本集合。
- 生成并审查 package version 与 CHANGELOG 变更。
- 运行仓库规定的 release/publish readiness 门禁。
- 通过 topic branch + PR 提交 release-prep，不直接 push `main`。
- 版本计划为：core/CLI `0.2.0`，UI `0.1.6`，theme runtime `0.1.5`，各 theme profile `0.1.4`。
- 发布 roots 使用 `@super-admin-org/core,@super-admin-org/ui,create-super-admin`，由 planner 展开 core dependents。
- 本轮完成 release-prep PR 后停止，不触发 `Publish next`、`npm publish`、registry smoke 或 `latest` promotion。

## Acceptance Criteria (evolving)

- [ ] 版本计划与 Changeset、workspace dependency 传播规则一致。
- [ ] 版本与 CHANGELOG 变更可由 Changesets 标准命令重现。
- [ ] 全量基础门禁及 publish readiness 验证通过。
- [ ] release-prep PR 创建且 CI 结果明确。
- [ ] 未执行 GitHub `Publish next` workflow、npm publish、dist-tag 或 release promotion。
- [ ] PR 正文记录后续发布 roots、confirmation 生成方式和剩余 registry 风险。

## Definition of Done

- Tests、lint、typecheck、build、docs 与相关 release validations 通过。
- 公开文档和 package metadata 与版本计划一致。
- 发布与回滚风险被记录。

## Out of Scope (explicit)

- 修改本轮功能实现。
- 在需求确认前执行 registry mutation。
- 触发 `Publish next`、registry smoke 或 `latest` promotion。
- 顺带修复 Dependabot alerts；安全维护使用独立任务。

## Technical Notes

- 已检查：`docs/guide/releasing.md`、`.changeset/config.json`、`.github/workflows/publish-next.yml`、root release scripts、Changeset status、release planner 和 npm registry 当前版本。

## Research References

- [`research/release-channel-and-version-plan.md`](research/release-channel-and-version-plan.md) — 推荐使用分阶段的 next/smoke/latest 流程，并把 registry mutation 设为独立授权检查点。

## Decision (ADR-lite)

**Context**: 本轮同时包含 core/CLI minor 与 UI/theme patch，且 npm versions 不可变。
**Decision**: 复用现有 Changesets 生成 release-prep PR；本任务在 PR 与 CI 明确后停止，registry publish 和 latest promotion 留给后续显式授权。
**Consequences**: 本任务没有 registry mutation 风险；npm 用户暂时不会获得新版本，直到后续任务触发 `Publish next`。

## Technical Approach

1. 从最新 `main` 创建 release topic branch。
2. 运行 `pnpm release version`，消费 pending Changeset 并生成 versions、CHANGELOG、internal ranges、lockfile 与 CLI starter dependency map。
3. 审核实际 diff 与预期版本矩阵，不手工伪造 Changesets 输出。
4. 运行 `pnpm release check` 及公开文档/Changeset/版本一致性检查。
5. 按 Trellis 提交、归档、journal 与项目 push/PR 流程创建 release-prep PR并等待 CI。
6. PR 完成后停止，不触发 registry workflow。

## Implementation Plan

- PR1：Changesets version output、版本矩阵审核与完整 release gate。
- 后续独立任务：PR1 合并后按明确授权执行 `Publish next -> smoke -> promote latest`。
