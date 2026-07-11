# 准备 create-super-admin 0.1.9 发版

## Goal

把 `create-super-admin@0.1.8` 之后已合并的命令面板契约修复与 starter 生成器单源化重构整理为完整、可审查的 `0.1.9` release artifacts，通过 Changesets versioning、release plan、npm version preflight 和完整发布前验证，为后续 `next` 发布与 `latest` promotion 建立稳定基线。

## What I already know

- 当前 `main` 与 `origin/main` 同步，工作区干净，无活动任务。
- 当前 `create-super-admin` 版本为 `0.1.8`。
- `0.1.8` 之后的产品改动是 PR #45 命令面板/快捷键契约修复，以及 PR #46 starter 生成器单源化重构。
- `.changeset/clean-starters-flow.md` 只选择 `create-super-admin` patch bump，因此 versioning 后预计为 `0.1.9`。
- 当前 changeset 只描述生成器单源化，尚未覆盖用户可感知的命令面板与快捷键修复。
- `pnpm release version` 是唯一版本化入口，会更新 manifest、CHANGELOG、lockfile 和 generated starter dependency range map。
- `pnpm release check` 与 `pnpm validate:publish` 已在前序工作中通过，但版本化后必须重新运行。
- 实际 `Publish next` 和 `latest` promotion 都是 registry mutation，必须在明确关口后执行。

## Proposed Direction

- 扩展现有 changeset，完整描述 `0.1.9` 的命令面板修复与生成器单源化。
- 使用独立 `codex/release-create-super-admin-0-1-9` 分支执行 Changesets versioning。
- 审计 version diff，确认只有 `create-super-admin` 升级到 `0.1.9`。
- 运行 release plan、npm unpublished preflight、完整 release gate、format 与 docs build。
- 通过 release PR 和 CI 交付版本化 artifacts；registry mutation 使用后续独立确认。

## Requirements (evolving)

- 本任务使用独立 topic branch 和 PR，不直接向 `main` 提交 release artifacts。
- 本任务止于 `0.1.9` release PR 合并，不触发 `Publish next` workflow。
- `Publish next`、registry smoke 和 `latest` promotion 分别使用后续明确确认。
- Release notes 同时覆盖命令面板/快捷键契约修复和 generator single-source 架构优化。
- release set 仅包含 `create-super-admin`，不提升其他 `@super-admin-org/*` package 版本。
- 所有版本文件由 Changesets 生成，不手工修改 package version 或 changelog。
- 发布前确认 `create-super-admin@0.1.9` 未在 npm registry 中存在。
- 不在 versioning/release PR 阶段执行 `npm publish` 或修改 dist-tag。

## Acceptance Criteria (evolving)

- [x] changeset 完整描述 `0.1.9` 用户可见修复与维护性优化。
- [x] `packages/cli/package.json` 版本为 `0.1.9`。
- [x] `packages/cli/CHANGELOG.md` 包含命令面板契约修复与生成器单源化说明。
- [x] changeset 被 versioning 正常消费。
- [x] 其他 publish candidates 的版本保持不变。
- [x] release plan 只选择 `create-super-admin@0.1.9`。
- [x] npm preflight 确认目标版本未发布。
- [x] `pnpm release check`、`pnpm format:check`、`pnpm docs:build` 全部通过。
- [ ] release PR CI 通过且 merge state clean/mergeable。

## Definition of Done

- Release artifacts 可审查、可回滚，且由项目 release tooling 生成。
- Registry mutation 与 release artifact versioning 分阶段授权。
- release PR 合并后再决定是否触发 `Publish next`。

## Open Question

- 无。

## Out of Scope

- 修改 CLI/starter 产品行为。
- 提升其他 publish candidate 版本。
- 修复 Dependabot alerts。
- 未经独立确认执行 npm publish、Trusted Publishing 配置或 `latest` promotion。

## Technical Notes

- 上一版本任务：`.trellis/tasks/archive/2026-07/07-10-release-create-super-admin-0-1-8/prd.md`。
- 发布事实来源：`docs/guide/releasing.md`。
- Pending changeset：`.changeset/clean-starters-flow.md`。
- Version artifacts：`packages/cli/package.json`、`packages/cli/CHANGELOG.md`、`pnpm-lock.yaml`、`packages/cli/src/package-version-ranges.generated.ts`。
- npm 版本不可覆盖；若 registry 已存在 `0.1.9`，必须停止并准备新的 patch version。
