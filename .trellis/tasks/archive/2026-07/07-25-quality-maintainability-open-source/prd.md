# 系统化提升测试、可维护性与开源体验

## Goal

按“保护网 → 受保护重构 → 契约自动化 → 开源产品体验”的顺序完成此前审计中仍值得推进的四组优化，让 `super-admin` 的真实用户链路、CLI 可维护性、AI 可读上下文和公开展示形成同一套可验证交付契约。

## What I Already Know

- 当前 `main` 工作区干净，已有单元测试、类型检查、构建、packed starter 验证和 Node 20.19/22.13 runtime contract CI。
- 已有基于 `playwright` 的 `scripts/reference-integration-smoke.mjs`，验证可选 reference backend 的登录、用户列表、Bearer token 和退出链路，但它不是默认 mock-backed starter 的浏览器门禁，也没有进入普通 CI。
- `scripts/validate-generated-starter.mjs` 已负责静态契约、安装、lint/test/typecheck/build 和 dev-server HTTP 启动烟测；它目前 1236 行。
- `packages/cli/src/templates.ts` 负责 package/config/README/AGENTS/AI context 等多类根文件模板；它目前 634 行。
- packed starter 已覆盖 standard、multi-theme+i18n、ECharts、minimal 和裁剪变体，但尚未以 `npm create`/`npx` 消费者入口执行本地 tarball。
- generated starter 已有小型 `AGENTS.md` router 和 capability-aware `ai-context/*.md`，但缺少通用的链接、上下文预算、能力声明与源码路径新鲜度门禁。
- `scripts/release-impact.mjs` 能根据改动路径阻止 Changeset 遗漏，但失败输出只列缺失包名，尚未给出可直接执行的 Changeset 建议。
- GitHub Pages 已部署 VitePress 文档，公开展示指南已规划 shell 截图、theme GIF 与 CLI GIF；当前完整 admin preview 仍要求本地运行。
- CLI 已支持 theme、多 theme、`--i18n`、charts、quality mode 和 package manager；尚未支持 `--no-examples` 与显式默认 locale 选择。

## Assumptions

- 本轮不执行 npm publish、Git tag、GitHub Release 或其他外部发布。
- 默认生成结果保持 frontend-first、mock-backed；browser E2E 不依赖可选 backend。
- Playwright、E2E、release tooling 和 maintainer AI workflow 不复制进 generated starter。
- 优先复用当前 `playwright` 依赖与现有进程/产物约定，不引入第二套浏览器测试框架。
- 重构不改变已发布 CLI 的既有默认行为；新 CLI 能力必须 opt-in 且向后兼容。
- 中英文 public docs 同步更新。

## Open Questions

- 无。用户已确认按推荐范围执行。

## Requirements

### 1. Browser And npm Consumer Protection

- 为默认 mock-backed admin/starter 增加 Chromium 核心链路 E2E，至少覆盖启动、登录、受保护路由、导航、theme/profile、locale（能力存在时）和退出。
- E2E 失败保存截图、console/page errors 和必要诊断产物。
- 普通 CI 执行一个稳定、聚焦的 Chromium smoke；reference backend smoke 继续保持可选边界。
- 从本地 `npm pack` 产物通过真实 npm consumer command 生成 starter，验证 CLI bin、生成、安装、质量命令和启动链路。
- 不依赖 npm registry 上尚未发布的新版本。

### 2. Protected Hotspot Refactor

- 在现有/新增特征测试保护下拆分 `templates.ts`，按 package/config、public docs、AI context 等职责组织。
- 拆分 `validate-generated-starter.mjs`，至少分离静态契约、能力/文件扫描、命令执行与 runtime startup。
- 保留稳定的公共导出与脚本入口，避免测试和维护脚本绕过统一入口。
- 单个模块的职责和命名需要让人类与 AI 能从目录结构直接定位。

### 3. AI Context And Release Guidance

- 增加可复用的 generated AI context validator，校验 `AGENTS.md` imports、引用文件存在性、未声明能力文件、关键源码路径、维护者工具泄漏和合理上下文预算。
- standard/minimal、single/multi-theme、single/multi-locale、charts/no-charts 生成变体都经过 AI context 契约验证。
- `release:impact` 在缺失 Changeset 时输出受影响包、触发路径和可执行的 Changeset 建议，同时继续保持非交互 CI 门禁。
- 更新对应测试和维护者文档，避免建议逻辑成为第二份发布真相。

### 4. Open-source Product Experience

- 生成清晰、可审查的真实产品截图，并在 README/中英文 docs 中提供公开预览入口。
- 交互 demo 不要求后端、数据库、鉴权 provider 或 AI provider。
- 增加 `--no-examples`，在生成阶段按现有 registration/manifest 扩展点完整裁剪 examples 及其专属 API/mock/AI context。
- 增加显式默认 locale 选择，并保持无新参数时默认 `zh-CN`、`--i18n` 兼容现有双语言行为。
- CLI help、root/package README、generated README/AI context、validator 和中英文 docs 同步。

## Acceptance Criteria

- [x] 默认 mock-backed browser smoke 在 Chromium 中稳定通过并纳入 CI。
- [x] E2E 失败产物不污染正常构建输出，且路径已被正确忽略。
- [x] 本地 packed CLI 可通过真实 npm consumer command 生成并验证 standard starter。
- [x] `templates.ts` 与 generated starter validator 按职责拆分，现有对外入口和行为保持兼容。
- [x] AI context validator 能捕获缺失 import、悬空路径、能力漂移、maintainer tooling 泄漏与超预算上下文。
- [x] release impact 缺失 Changeset 时给出确定性、可测试的包级建议。
- [x] README 和双语 docs 展示真实截图/预览，不把 docs-only 页面误称为完整在线 admin。
- [x] `--no-examples` 和默认 locale 选择有 CLI、生成器、静态契约、packed starter 与文档测试。
- [x] `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm validate:starter`、`pnpm docs:build` 通过。
- [x] publishable package impact 有对应 Changeset。

## Definition Of Done

- 采用测试先行，每个行为变更先有失败测试或特征测试。
- 所有阶段按顺序通过各自小门禁，后续阶段复用前一阶段保护网。
- 公共文档、CLI help、generated output、validation 与 CI 描述一致。
- 默认 starter 不包含 Playwright、VitePress、Trellis 或其他 maintainer-only tooling。
- 不执行 npm publish、push、tag 或 GitHub Release。

## Technical Approach

- 使用现有 `playwright` library 和进程管理模式，提取可复用 browser smoke harness；普通 CI 只跑一个 Chromium mock-backed 核心旅程。
- npm consumer smoke 从本地 packed `create-super-admin` tarball 执行，避免依赖 registry 最新状态。
- 用 façade 保留 `templates.ts` 和 `validate-generated-starter.mjs` 的稳定入口，将实现迁移到聚焦模块。
- AI context 规则作为 validator 模块被 packed starter validation 与单元测试复用，不把维护者 validator复制到生成项目。
- CLI 新能力沿用 `parse args -> normalized input -> source action/transform -> generated contract` 数据流。
- 公开交互 demo 复用 `apps/admin` 的静态构建，由 Pages 交付流程放到文档站点的独立子路径；截图由同一 browser harness 从真实页面捕获。

## Decision (ADR-lite)

**Context**：项目已经有直接使用 `playwright` library 的 reference smoke、packed starter validator 和 VitePress Pages 部署。引入第二套 E2E runner、本地 registry 或独立 demo app 会扩大维护面。

**Decision**：继续使用 direct Playwright harness；通过本地 tarball 的 `npm exec` 验证消费者入口；将 canonical mock-backed admin 静态部署到 `/super-admin/demo/`；CLI locale 复用现有 `i18n.installed/default/switcher` contract。

**Consequences**：普通 CI 保持一个 Chromium smoke；不获得 `@playwright/test` 的 runner/fixture 功能；demo 与 canonical admin 同源；GIF 和 mandatory interactive locale prompt 延后。

## Research References

- [`research/delivery-and-productization.md`](research/delivery-and-productization.md) — Playwright、npm tarball consumer、Pages demo 与 CLI 参数组合的推荐方案。

## Expansion Sweep

### Future Evolution

- browser harness 保留增加 Firefox/WebKit 或 Windows 的扩展点，但本轮 CI 只跑 Chromium。
- locale model 保留增加更多 catalog 的能力，但本轮只支持现有 `zh-CN`/`en-US`。

### Related Scenarios

- 默认源码 app、source-derived starter、packed starter 和 hosted demo 使用同一核心用户链路。
- examples 裁剪应与 ECharts、module fallback、AI context 和 generated README 同步。

### Failure And Edge Cases

- 浏览器不可用、服务启动超时、端口冲突、子进程残留与诊断产物清理。
- npm CLI tarball 路径、不同 package-manager 声明、离线/缓存行为与 npm 生命周期差异。
- `--no-examples` 与 `--charts echarts` 冲突时必须给出明确错误或确定的规范化结果。
- `--locale en-US`、`--i18n` 组合需要确定 catalog 集合、默认 locale 和 switcher 行为。

## Out Of Scope

- npm publish、dist-tag、tag、GitHub Release。
- VitePress 2 alpha/major migration。
- 全浏览器矩阵、视觉回归平台或第三方 SaaS E2E。
- 将可选 reference backend 变成默认 starter 或 hosted demo 依赖。
- 新增 `zh-CN`/`en-US` 以外的翻译 catalog。
- 强制第二维护者审批、CODEOWNERS 或维护者工具仓库迁移。

## Technical Notes

- 相关 specs：`.trellis/spec/shared/cli-starter-contract.md`、`.trellis/spec/shared/public-delivery.md`、`.trellis/spec/frontend/quality.md`、`.trellis/spec/frontend/i18n.md`。
- 关键入口：`packages/cli/src/generate-starter.ts`、`packages/cli/src/starter-source.ts`、`scripts/validate-generated-starter.mjs`、`scripts/validate-starter-smoke.mjs`、`scripts/release-impact.mjs`。
- 现有 browser 参考：`scripts/reference-integration-smoke.mjs`。
- 公开展示约束：`docs/guide/public-presentation.md` 与 `docs/en/guide/public-presentation.md`。
