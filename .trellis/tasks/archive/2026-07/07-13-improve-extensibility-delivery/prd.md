# 提升扩展性与 npm 交付质量

## Goal

把 Super Admin 从“内部工程质量较强的 0.x 模板”推进为“扩展契约真实、默认质量基线可靠、npm 用户容易采用、AI 能稳定理解”的开源后台模板。优先修复审计中会直接破坏扩展性或形成双重事实源的问题，再补齐用户 starter 的质量闭环。

## What I already know

- 项目目标是高扩展性、高自由度、易读、职责清晰、归一化和复用性高，并对 AI 提供可用上下文。
- 当前主数据流 `Page -> module query composable -> API adapter -> mock/user API` 已在代码中落实。
- `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm validate:starter`、`pnpm docs:build`、`pnpm validate:publish` 和 `pnpm test:reference` 均通过。
- `DesignProfileId` 与 `LayoutPresetId` 类型允许扩展字符串，但 `AuthLayout.vue`、`AppShell.vue`、Stage Manager preview 等运行时仍硬编码内置 ID。
- `dashboard/users/access/workbench` 各自存在 manifest，但运行时只注册 `examplesManifest` 与 `uiKitManifest`；生成 starter 又排除这些 standalone manifests，形成双重事实源。
- 默认 starter 约 102 个文件、9,246 行 TS/Vue/CSS，只有 dev/build/typecheck/preview，没有 lint/test 质量基线。
- 现有测试数量充足，但部分 UI 契约依赖 `?raw + toContain()`，缺少标准组件行为测试与默认 CI 浏览器 smoke。
- 生成 starter 的 AI 上下文约 78 行且分层清晰；源码仓库的维护者 AI/Trellis 文件量较大，但不得因此让维护工具进入普通用户 starter。
- README 与 docs 已有 npm 快速开始，但缺真实 admin 截图/交互 demo；各 publishable package README 很薄。

## Assumptions (temporary)

- 本任务采用分阶段、小批次实现，不一次性重写 UI 或改变既有视觉设计。
- 第一阶段优先保证扩展契约和单一事实源，其次才增加可选能力或公开展示素材。
- 兼容现有 `create-super-admin@0.1.x` 用户，尽量避免无迁移说明的破坏性 package API 变化。
- 默认 scaffold 继续 frontend-first、mock-backed，不引入必需 backend、database、auth provider 或 AI provider。

## Requirements

- 模块导航、路由和 meta 必须有唯一事实源，不保留未注册且与聚合 manifest 重复的定义。
- theme/layout 的公开扩展类型与运行时解析行为必须一致；未知扩展不能误落入某个品牌化内置实现。
- 生成 starter 必须具备与“高代码质量”定位相匹配的可执行质量入口，同时保留轻量使用路径。
- UI 行为测试与生成器源码契约测试要分层，避免用字符串断言代替关键用户行为验证。
- AI 上下文继续保持按实际生成能力裁剪，且明确扩展入口、质量命令和安全边界。
- 公开文档、CLI help、生成输出与真实 package/CI 行为保持一致。
- 本轮采用“架构与质量基线优先”：不同时制作公开 demo、截图或 social preview。
- starter 采用“标准质量默认、`--minimal` 显式退出”：默认包含 ESLint、Vitest 与聚合质量命令；minimal 保留 typecheck/build，不残留 lint/test tooling。

## Acceptance Criteria

- [x] 每个 data-backed feature 的 manifest 只定义一次，运行时路由与导航从该定义组合生成。
- [x] 新增自定义 theme/layout 不需要修改无关 feature 页面，且未知 ID 有中性、显式的 fallback。
- [x] starter 至少提供 `lint`、`test`、`typecheck`、`build` 和聚合质量命令，或通过明确 preset 生成这些能力。
- [x] 关键 UI 流程存在运行时行为测试，不只依赖源码字符串断言。
- [x] 默认、多主题+i18n、ECharts starter 均能安装、lint、test、typecheck、build。
- [x] 源码仓库全量 lint、format、typecheck、test、build、docs、starter、publish readiness 通过。
- [x] public docs、package docs 和 AI context 与新行为同步。
- [x] CLI help、README 与生成 starter 能准确区分 standard/default 和 minimal 输出。

## Definition of Done

- Tests added/updated (unit/component/integration where appropriate)
- Lint / format / typecheck / CI-equivalent checks green
- Generated starter variants and packed package boundaries verified
- Docs and AI context updated for changed behavior
- Backward compatibility and rollback path documented
- Reusable conventions captured in `.trellis/spec/` when appropriate

## Out of Scope (explicit)

- 将 optional Hono backend 变成默认依赖
- 引入数据库、正式 auth provider 或 AI provider
- 重写全部视觉设计或替换 Vue/Tailwind/TanStack Query 技术栈
- 在未完成本地验证前执行 npm publish、push 或 GitHub settings 写操作
- 本轮制作或部署公开 admin demo、截图、GIF、social preview
- 完整 runtime plugin lifecycle、远程插件发现或第三方插件市场
- 默认 starter Playwright/e2e 安装；本轮先建立 unit/component-ready 质量基线

## Technical Notes

- Relevant specs: `.trellis/spec/frontend/`, `.trellis/spec/shared/public-delivery.md`, `.trellis/spec/guides/`.
- Likely code areas: `apps/admin/src/modules/`, `apps/admin/src/shell/`, `apps/admin/src/workspace/`, `packages/core/`, `packages/cli/`, `packages/ui/`, `docs/`.
- Existing source-derived starter pipeline and publish validation are strengths and should be extended, not bypassed.

## Research References

- [`research/starter-quality-baseline.md`](research/starter-quality-baseline.md) — create-vue 将 lint、unit、e2e 作为一等脚手架能力；建议 Super Admin 采用标准质量默认、minimal 显式退出。
- [`research/extension-registry.md`](research/extension-registry.md) — 建议使用静态 typed registry 与纯 composition helpers，不提前引入完整 runtime plugin lifecycle。
- [`research/testing-strategy.md`](research/testing-strategy.md) — 新扩展契约先用纯测试证明，再逐步引入组件行为和少量 Playwright 高价值流程。

## Research Notes

### Feasible implementation directions

**Approach A: 架构与质量基线优先（Recommended）**

- 先统一 feature manifest、建立 layout/auth recipe registry 与 neutral fallback。
- 默认 starter 生成 ESLint、Vitest、`lint/test/check`；提供 `--minimal` 退出。
- 新增纯行为测试，迁移最高风险的 raw source tests。
- 同步 CLI、AI context、package docs；公开 demo 作为后续独立任务。

优点：直接修复影响长期扩展和用户质量的根因，范围可验证。缺点：README 视觉提升不会在同一批完成。

**Approach B: 同时完成架构、质量和公开 demo**

- 包含 Approach A 全部内容，再部署真实 admin demo、截图/GIF、social preview。

优点：工程和公开呈现同时跃升。缺点：跨架构、测试、CLI、docs、部署与视觉资产，任务过大且回归面明显增加。

**Approach C: 只做低风险公开改善**

- 完善 README、package docs、截图和 demo，暂不改变 runtime/CLI 契约。

优点：短期采用率收益快。缺点：审计发现的双重事实源和伪扩展契约继续存在，不符合“高代码质量”优先级。

## Expansion Sweep

### Future evolution

- 静态 registry 应保留未来 `create-super-admin add module` 与第三方 package 注册入口，但本轮不实现远程/动态插件系统。
- starter 的内部 `quality` generation model 应允许未来扩展为 presets，而不在首版一次引入所有组合。

### Related scenarios

- 模块 registry、command palette、navigation、workspace grouping 必须消费同一 manifest 结果。
- single-theme、多主题、i18n、charts 与 minimal/standard 组合都必须继续通过 packed-starter validation。

### Failure and edge cases

- duplicate module ID/path/route name 应在构造 registry 时显式失败。
- unknown theme/layout recipe 使用 neutral fallback；不得静默伪装成 Crypto/Tri-column。
- minimal 输出不得残留 lint/test imports、configs、scripts 或依赖。

## Decision (ADR-lite)

**Context**: 审计发现项目的类型层宣称 theme/layout 可扩展，但运行时仍硬编码内置 ID；feature manifests 又存在重复定义。与此同时，默认 starter 已有较大业务骨架，却没有 lint/test 质量入口。若同时加入公开 demo，会把架构、CLI、测试、docs、部署和视觉资产混成一个难以验证的大任务。

**Decision**: 采用 Approach A。使用静态 typed registries 与纯 composition helpers 修复单一事实源和扩展 fallback；默认 starter 生成 ESLint、Vitest、`lint/test/check`，通过 `--minimal` 提供轻量退出；先建立纯逻辑与关键行为测试，不在本轮引入完整 runtime plugin system 或公开 demo。

**Consequences**:

- 需要扩展 core contracts、admin registry、CLI generation matrix、starter validation、docs 和 AI context。
- 默认 starter 依赖与文件数会增加，但用户获得可执行质量反馈；minimal 用户仍可显式选择轻量输出。
- layout/auth recipe registry 必须保留内置高保真主题体验，同时为未知扩展提供 neutral fallback。
- 公开展示优化被明确留给后续独立任务，避免阻塞架构质量改进。
