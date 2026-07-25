# 依赖兼容性收口

## Goal

在已完成交付加固的基础上，收口剩余 Dependabot major upgrades：升级当前 Vue 工具链可稳定支持的版本，消除 TypeScript 7 已知配置失败，并让后续自动依赖 PR 尊重项目的最低 Node 运行时与 Vue 工具链兼容边界。

## Requirements

- 将 Vue Router 保持在 Node 20 兼容的 4.x；5.2.0 的 Babel 8 依赖要求 Node 22.18+，高于公开运行时契约。
- 将 TypeScript 升级到 Vue/Volar 当前可支持的稳定版 6，不直接采用暂不提供稳定 compiler API 的 TypeScript 7。
- 将 `@vue/tsconfig` 升级到兼容 TypeScript 6 的 `0.9.1`。
- 移除仓库与 CLI 生成 starter 中已被 TypeScript 6 弃用、TypeScript 7 移除的 `baseUrl`，显式修正 `paths`。
- 将 `@types/node` 对齐到项目最低受支持的 Node 20，而不是让类型面领先运行时契约。
- 将 `vue-i18n` 固定在最后支持 Node 20 的 `11.4.2`，避免 patch range 安装到 Node 22-only 版本。
- 更新 CLI 生成 starter 的依赖范围和相关契约测试。
- 配置 Dependabot 忽略 `typescript`、`@types/node` 与 `vue-router` 的自动 major upgrades；major 版本由运行时/工具链兼容性评审后人工推进。
- 为发布影响范围补充 Changeset，不绕过 release-impact 门禁。

## Acceptance Criteria

- [x] `vue-router@4.6.4`、`typescript@6.0.x`、`@vue/tsconfig@0.9.1` 安装无 peer dependency 警告。
- [x] 仓库 TypeScript 配置与生成 starter 中不再出现 compiler option `baseUrl`。
- [x] 生成 starter 的 alias、typecheck、build 行为保持可用。
- [x] Node 20.19.0 与 Node 22.13.0 CLI contract 均通过。
- [x] Node 20.19.0 与 Node 22.13.0 均真实生成、严格安装并构建 standard starter。
- [x] lint、format、typecheck、tests、build、docs、starter、publish、reference backend 全部通过。
- [x] Dependabot 不再为 TypeScript 7、高于 Node 20 的 `@types/node` 或 Vue Router 5 自动创建 major PR。

## Definition of Done

- 本地完整质量门禁通过。
- PR CI 与文档部署通过后再合并。
- 重复或被取代的 Dependabot PR 在确认后关闭。
- npm 发布不在本任务内，除非用户另行明确授权。

## Technical Approach

一次完成 manifest、tsconfig、CLI template、测试、Dependabot policy 和 Changeset 修改；先做依赖解析与针对性 typecheck/build，再只在最终状态运行一次完整质量门禁。

## Decision (ADR-lite)

**Context**: Dependabot 提议 TypeScript 7 与 `@types/node` 26；TypeScript 7 CI 已因 `baseUrl` 失败，且官方说明 Vue/Volar 等嵌入式 TypeScript 工具当前应继续使用 TypeScript 6。

**Decision**: 采用 TypeScript 6.0.x 并保持 Vue Router 4；Node 类型对齐最低受支持 Node 20；自动 major upgrades 改为人工兼容性评审。

**Consequences**: 当前工具链保持稳定并提前完成 TypeScript 7 配置迁移准备；待 Vue 工具链提供 TypeScript 7 compiler API 支持后，再单独评估 TypeScript 7。

## Out of Scope

- VitePress 2 alpha 升级，以及其 Vite 5 / esbuild 残余告警。
- TypeScript 7 native compiler 双栈实验。
- Node 最低运行时 major 升级。
- npm 发布。

## Research References

- [`research/dependency-compatibility.md`](research/dependency-compatibility.md) — TypeScript 7、Vue Router 5 与 Node 类型版本策略。

## Technical Notes

- Dependabot PR `#65` 的直接失败为 `TS5102: Option 'baseUrl' has been removed`，并同时触发 `release-impact-missing-changeset`。
- 当前运行时契约：`^20.19.0 || >=22.13.0`。
- 受影响范围包括 root、`apps/admin`、`packages/cli`、`packages/ui`、CLI templates、starter contract tests 与 `.github/dependabot.yml`。
