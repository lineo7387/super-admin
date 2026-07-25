# 修复审计问题并加固交付链路

## Goal

根据 2026-07-25 的仓库、GitHub 与 npm 审计结果，按共享代码面和共享验证面组合修复高优先级问题，先消除公开发布态漂移和安全积压，再补预防性门禁；实现过程中只运行必要的快速定向检查，所有改动完成后只运行一轮完整质量门禁。

## What I already know

- 当前 `main` 工作区干净，且最新主干 CI 已通过。
- `main` 的 `feat(starter): 完善模块裁剪与运行时契约 (#62)` 修改了 `packages/cli`、starter source、Node `engines`、AI context 和公开文档。
- 当前没有 pending changeset，但项目发布规范要求 publishable package 改动必须创建 changeset。
- npm `create-super-admin@0.2.0` 实际生成物没有当前 `main` 新增的 Node `engines`、app module registry、Examples registration 和 prunability contract；README 已经描述这些尚未进入 npm `latest` 的能力。
- GitHub 当前有 16 条未关闭 Dependabot alerts 和 10 个 Dependabot PR；很多告警属于 optional backend、dev dependency 或 maintainer-only tooling，但尚未完成分层处置。
- 根 CI 只使用 Node 24，尚未验证声明支持范围的最低边界 Node 20.19 和 Node 22.12。
- 现有质量基线很强：69 个测试文件、364 项 workspace/script 测试、4 项 reference integration smoke，以及四种 packed starter 组合验证。
- `pnpm lint`、`pnpm format:check`、`pnpm test`、`pnpm build`、`pnpm docs:build`、`pnpm validate:starter`、`pnpm validate:publish`、`pnpm test:reference` 在审计时全部通过。
- 用户要求避免每修一项就重复运行完整验证。

## Assumptions (temporary)

- 本任务只修改仓库文件，不执行 npm publish、dist-tag promotion、Git tag、GitHub Release 或关闭外部 Dependabot PR。
- “避免重复验证”解释为：开发时允许运行秒级定向测试；完整 workspace、starter、publish、docs、reference gate 只在全部改动完成后运行一次。
- 本任务优先修复能在一个 PR 内安全完成、且能防止同类问题复发的工程问题；公开 demo、维护者工具迁移和新增 CLI 产品能力单独立项。

## Requirements (evolving)

- 按依赖关系而不是发现顺序修复，避免后续改动使先前完整验证失效。
- 先处理 dependency/security 和 publishable contract，再补自动化守卫，最后修改 CI。
- 为 #62 对 `create-super-admin` 的用户可见改动补 patch changeset。
- 增加自动化检查，防止影响 CLI/starter 发布面的变更在没有 changeset 的情况下进入 `main`。
- 将直接可安全升级的 runtime/dev dependencies 和 lockfile 一次性更新，并用审计结果区分仍需人工处置的 maintainer-only 告警。
- 对可验证兼容性的传递依赖 major override 增加行为回归测试；无法由 stable upstream 支持的工具链 major migration 保持独立范围。
- 单独清理 copied maintainer tooling lockfile 中的告警，不把它并入 starter 或普通用户依赖。
- 用轻量 CI matrix 验证 Node 20.19、22.12、24 的声明范围，同时避免把完整 packed-starter gate 重复三次。
- 所有生成项目、公开文档和 package metadata 继续保持 frontend-first、mock-backed、backend/provider optional。

## Acceptance Criteria (evolving)

- [x] `create-super-admin` 存在准确描述 #62 用户可见修复的 patch changeset。
- [x] 缺少 changeset 的 publishable/starter-source 改动能够被自动化测试或 CI 检查拒绝。
- [x] 兼容范围内的安全 dependency update 集中落地，lockfile 与 package manifests 一致。
- [x] Node 最低支持边界已进入 CI matrix，完整高成本 gate 仍只运行一次。
- [x] 新增脚本拥有定向单元测试，失败信息能告诉维护者如何修复。
- [x] 中英文维护者文档与真实检查命令一致。
- [x] Root workspace 只剩 VitePress 1.x 的 stable-upstream-blocked 告警链；copied Vite+ docs lockfile audit 为零。
- [x] 所有 delivery workflows 和双语 workflow 示例使用同一当前 GitHub Action major。
- [x] 最终完整质量门禁一次通过，工作树仅包含本任务预期改动。

## Definition of Done

- Tests added/updated for new release guard and dependency/security behavior where applicable.
- Lint、format、typecheck、tests、build、docs、packed starter、publish readiness、reference smoke 最终通过。
- 公开文档、release guidance、CI 与实际命令一致。
- 不执行 registry、tag、Release、PR close 等外部 mutation。
- 记录剩余无法在本任务安全自动修复的安全或治理项。

## Final Residual Classification

- `vitepress@1.6.4 -> vite@5.4.21 -> esbuild@0.21.5`：1 high / 3 moderate，仅存在于文档开发服务器链路。
- 最新 stable VitePress 仍为 `1.6.4`；VitePress 2 仍是 alpha。因此本轮不使用 prerelease，也不对 VitePress 1 强制注入 Vite 8。
- TypeScript 7、Vue Router 5、Pinia 4、pnpm 11、`@vue/tsconfig` 0.9、`@hono/zod-validator` 0.9 属于独立 major migration，不是当前告警修复。

## Recommended Fix Bundles and Order

### Bundle 1 — Security and dependency baseline

- 合并兼容范围内的 dependency upgrades。
- 刷新 lockfile。
- 定向运行 dependency audit 和受影响 package tests。

原因：后续任何代码验证都依赖最终 dependency graph；应最先稳定依赖基线。

### Bundle 2 — Release consistency and recurrence prevention

- 补 `create-super-admin` patch changeset。
- 增加 release-impact / changeset guard 和测试。
- 把 `apps/admin` starter source、`packages/cli` 和直接改变 CLI artifact 的 template/range build scripts 纳入显式影响映射。
- 更新发布文档与 CI。

原因：这组改动共享 CLI、release scripts、Changesets 和 CI 验证面，应一起完成。

### Bundle 3 — Runtime compatibility CI

- 保留 Node 24 的单次完整 gate。
- 增加 Node 20.19 与 22.12 的轻量 contract matrix，只运行 install、`create-super-admin` build 和 CLI tests。

原因：先完成 package/guard 变更，再以最终命令结构编写 CI，避免 CI 反复调整。

### Bundle 4 — Final verification

- 先运行所有新增定向测试。
- 再运行一次完整 repository gate。
- 最后核对 Git diff、公开 npm 仍未被修改，并列出发布 `0.2.1` 所需的外部后续动作。

## Feasible Scope Approaches

### Approach A — Critical-only

- Bundle 1 + Bundle 2。
- 优点：最快消除发布态漂移和安全积压。
- 缺点：Node compatibility 声明仍缺少最低版本证据。

### Approach B — Balanced hardening（推荐）

- Bundle 1 + Bundle 2 + Bundle 3。
- 优点：一次覆盖 dependency、release、CI 三个共享验证面，并建立防复发门禁。
- 缺点：CI 文件和 release scripts 都会变化，改动规模中等。

### Approach C — Full audit backlog

- Approach B，再加入 Playwright E2E、validator/templates 大文件拆分、AI workflow 减重、截图/demo、CLI `--no-examples`/locale 等。
- 优点：覆盖完整审计清单。
- 缺点：产品需求、重构、视觉资产与发布修复混在一起，会扩大回归面，违背“一轮高成本验证”的目标。

## Decision (ADR-lite)

**Context**：用户希望修复审计问题，同时避免每完成一个问题就重复运行完整验证。Dependency、release contract、CI 和 docs 存在先后依赖，若按发现顺序修复会使前序验证失效。

**Decision**：采用 Approach B — Balanced hardening。先稳定 dependency/security baseline，再修复 changeset 漂移并增加 release-impact guard，最后补最低 Node runtime matrix；开发期间只运行快速定向检查，所有改动完成后运行一次完整 repository/release gate。

**Consequences**：

- 本任务能消除最高优先级发布漂移并防止复发。
- Node compatibility 声明会获得自动化证据，而不会把 packed starter gate 重复三次。
- Playwright、公开 demo、AI workflow 减重、大文件重构和 CLI 新功能继续保持独立范围。
- npm `0.2.1` 的实际发布仍需任务完成后的单独外部授权。

## Expansion Sweep

### Future evolution

- release-impact guard 后续可扩展到 package-specific changeset recommendation，而不只判断存在/不存在。
- CI matrix 后续可加入 Windows 或 browser E2E，但本轮先保证声明的 Node runtime contract。

### Related scenarios

- docs、generated README、AI context 和 npm metadata 需要继续由同一 release contract 校验。
- future package changes 不能因为只修改 `apps/admin` source 而漏掉 `create-super-admin` release impact。

### Failure and edge cases

- docs-only、test-only、maintainer-only changes 不应误报必须 changeset。
- 多 package 变更必须允许一个或多个对应 changesets，并给出明确缺失 package。
- security alerts 可能来自无法升级或 maintainer-only lockfile，不能用盲目 override 隐藏风险。
- Node matrix 不应把耗时 packed starter validation 重复三次。

## Out of Scope (explicit)

- 实际发布 npm `0.2.1`、移动 `next/latest`、创建 Git tag/GitHub Release。
- 关闭或合并 GitHub Dependabot PR。
- 大规模拆分 `validate-generated-starter.mjs`、`templates.ts` 或 Vue shell components。
- 迁移 `.trellis/.agents/.agent/.claude/.codex` 到其他仓库。
- 新增截图、GIF、交互式公开 demo。
- 新增 `--no-examples`、locale selector 或其他 CLI 产品功能。
- 启用需要第二维护者的 required approval/code-owner review。

## Technical Notes

- Task research: `research/fix-bundles.md`
- Release rules: `docs/guide/releasing.md`
- Public delivery rules: `.trellis/spec/shared/public-delivery.md`
- CLI contract: `.trellis/spec/shared/cli-starter-contract.md`
- GitHub workflow: `.github/workflows/ci.yml`
- Root scripts: `package.json`, `scripts/release.mjs`
- Changesets config: `.changeset/config.json`
