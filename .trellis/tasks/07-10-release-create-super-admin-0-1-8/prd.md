# 发布 create-super-admin 0.1.8

## Goal

把已合并到 `main` 的 generated AI context 与 release-hardening 变更版本化为 `create-super-admin@0.1.8` release commit，并通过完整发布前验证，为后续 `next` channel 发布建立可审查、可回滚的稳定基线。

## What I already know

- PR #40 已 squash merge 到 `main`，merge commit 为 `14fe985`。
- `create-super-admin` 当前版本是 `0.1.7`。
- `.changeset/bright-mails-smile.md` 只为 `create-super-admin` 声明 patch bump。
- `pnpm release version` 是项目唯一版本化入口，会同步 package version、changelog、lockfile 和 generated starter dependency range map。
- `pnpm release check` 会执行 build、lint、typecheck、tests、pack/install validation 和 generated starter smoke。
- `pnpm release assert-unpublished --changed create-super-admin` 必须在发布前确认目标版本未被占用。

## Confirmed Scope

- 本任务使用独立 topic branch 和 PR，不直接向 `main` 推送 release commit。
- 本任务止于 `0.1.8` release PR 合并；不触发 `Publish next` workflow。
- 实际 `Publish next` workflow 和 `latest` promotion 属于 registry mutation，需要后续独立确认。
- CLI-only changeset 不应提升其他 `@super-admin-org/*` package 版本。

## Requirements

- 从最新 `origin/main` 创建 `codex/release-create-super-admin-0-1-8` topic branch。
- 在版本化前确认 pending changeset 仅选择 `create-super-admin` patch bump。
- 运行 `pnpm release version`，生成 `create-super-admin@0.1.8` release artifacts。
- 确认 changeset 被消费，其他 publish candidates 的版本不发生意外变化。
- 生成 dependency-aware release plan，并确认 `create-super-admin@0.1.8` 尚未发布。
- 运行完整 release、format 和 docs 验证。
- 将 release artifacts 作为聚焦提交，通过 PR 和 CI 交付。
- Release PR 合并后停止，不触发 npm publish workflow。

## Acceptance Criteria

- [x] `packages/cli/package.json` 版本为 `0.1.8`。
- [x] `create-super-admin` changelog 包含 generated AI context 与 starter bundle 优化说明。
- [x] lockfile 和 generated version map 与 manifests 一致。
- [x] `.changeset/bright-mails-smile.md` 已被版本化流程消费。
- [x] `pnpm release plan --changed create-super-admin` 只选择 `create-super-admin@0.1.8`。
- [x] npm version preflight 确认 `create-super-admin@0.1.8` 未发布。
- [x] `pnpm release check`、`pnpm format:check` 和 `pnpm docs:build` 通过。
- [ ] Release PR CI 通过且 merge state clean/mergeable。
- [ ] Release PR 合并到 `main`，且没有触发 `Publish next` workflow。

## Definition of Done

- Release artifacts 由 Changesets 生成，不手工拼版本或 changelog。
- 完整本地质量门和 GitHub CI 绿色。
- Release PR 清楚记录范围、验证结果和 registry mutation 边界。
- 不在未经独立确认的情况下运行 `npm publish`、`npm dist-tag` 或 GitHub `Publish next` workflow。

## Out of Scope

- 修改 CLI/starter 产品行为。
- 提升其他 `@super-admin-org/*` package 版本。
- 修复 Dependabot vulnerabilities。
- 未经独立确认发布到 npm 或移动 `latest` dist-tag。

## Technical Notes

- 发布事实来源：`docs/guide/releasing.md`。
- Release commands：`scripts/release.mjs` 与 root `package.json` scripts。
- Version source：`packages/cli/package.json`、`pnpm-lock.yaml`、`packages/cli/CHANGELOG.md`、generated starter version range map。
- `pnpm changeset status` is a pre-version check. After the changeset is consumed, audit the generated release diff instead of adding an empty changeset; see `research/changesets-status-after-version.md`.
- Rollback：release commit 合并前可关闭 PR；若版本已发布到 npm，则版本不可覆盖，只能修复后发布新 patch。

## Decision (ADR-lite)

**Context**：版本化和 registry mutation 的失败半径不同，必须分阶段授权和验证。

**Decision**：先通过独立 release PR 交付 `0.1.8` version artifacts；npm `next` 发布与 `latest` promotion 使用后续独立关口。

**Consequences**：多一次 PR/确认步骤，但版本 diff 可审查，registry mutation 前能再次验证目标版本与 selected package set。
