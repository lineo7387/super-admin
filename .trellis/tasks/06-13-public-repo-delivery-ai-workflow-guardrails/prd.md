# 公开仓库交付面和 AI 工作流规范整理

## Goal

整理 Super Admin 的公开仓库交付面，让 GitHub、README、Security、Changelog、脚本和发布状态与当前 `0.1.2` npm 发布事实一致；同时把“用户应该看到什么、维护者工具不应污染用户入口、发布状态必须同步、默认中文界面会影响 smoke 选择器”等规则写入 Trellis/AI 工作流，减少后续反复提醒。

## What I Already Know

- 本地 `main` 比 `origin/main` ahead 4，GitHub 公开 README 仍显示 first public npm release 之前和 Future CLI，而本地 README/npm registry 已显示 `0.1.2` 发布后状态。
- npm registry 中 `create-super-admin`、`@super-admin-org/core`、`@super-admin-org/ui`、`@super-admin-org/theme*` 的 `latest`/`next` 均为 `0.1.2`。
- `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm docs:build`、`pnpm validate:publish` 已通过。
- `pnpm validate:starter` 当前直接失败，因为 `scripts/validate-generated-starter.mjs` 需要 `<project-dir>` 参数。
- `pnpm test:reference` 失败根因是 smoke 脚本硬编码点击 `Sign in`，但默认 locale 是 `zh-CN`，登录按钮实际为 `登录`；手动 Playwright 诊断确认点击 `登录` 后 `POST /auth/login` 和 `GET /users` 正常。
- 公开仓库顶层跟踪了 `.agent`、`.agents`、`.claude`、`.codex`、`.trellis`、`.mcp.json`、`skills-lock.json` 等 548 个 AI/维护者工作流文件；这些不进入 npm 包，但会影响 GitHub 用户第一印象。
- `SECURITY.md`、`CHANGELOG.md` 仍含 first release 前的措辞。

## Requirements

- 同步公开文档状态：README、Security、Changelog 不再宣称项目处于 first public release 前；说明当前是 `0.x` 初始 npm release 后的活跃开发。
- 修复根脚本体验：`pnpm validate:starter` 应成为可直接运行的有效命令，或改名/调整为不会误导的维护者命令。
- 修复 reference smoke：默认中文界面下 `pnpm test:reference` 应通过；选择器不得依赖过时英文文案。
- 把公开仓库交付边界写入 AI 工作流/spec：
  - npm 用户交付物和 GitHub 源码仓库呈现要区分。
  - 默认 scaffold 必须保持 frontend-first、mock-backed。
  - 公开文档不得落后于 npm 发布状态、CLI 能力和 package scripts。
  - 维护者/AI 工具目录不得成为普通用户理解项目的前置入口；若暂时保留，必须有明确说明和后续迁移建议。
  - 默认 `zh-CN` 是 UI 文案基准，测试/smoke 选择器应使用稳定 role/translation 或同时兼容中英文。
- 保持 npm 发布包干净，不把 `.trellis`、`.agents` 等维护者材料打进包。
- 不破坏当前 Trellis 工作流；本任务可以新增或修改 spec/guide，但不做大规模工作流平台迁移。

## Acceptance Criteria

- [ ] `pnpm validate:starter` 可直接运行并通过，或根脚本调整为明确的有效入口。
- [ ] `pnpm test:reference` 在默认 `zh-CN` 配置下通过。
- [ ] README、SECURITY、CHANGELOG 与 `0.1.2` npm 发布状态一致。
- [ ] Trellis/AI spec 中新增公开仓库交付面规则，未来 AI 在修改文档、发布脚本、CLI、仓库根目录时会读到这些约束。
- [ ] 规则明确说明“哪些给用户、哪些属于维护者工具/AI 工作流”。
- [ ] `pnpm lint`、`pnpm typecheck`、`pnpm test`、相关脚本验证通过。
- [ ] 工作区最终不包含无意生成物或临时输出。

## Definition Of Done

- 文档和脚本更新完成。
- AI 工作流规则已进入 `.trellis/spec/` 或项目级 AGENTS 路由面。
- 相关验证命令通过，并记录任何无法完成的验证。
- 若发现本任务不适合直接删除 AI/维护者目录，则记录后续决策，而不是仓促移除。

## Technical Approach

先做低风险、可立即验证的公开交付修复：文档状态、`validate:starter`、`test:reference`。然后把本轮审计总结沉淀到 Trellis spec，优先放在 shared/monorepo 或新增 public delivery guide，并在相关 index 中暴露。最后运行质量门。

## Decision (ADR-lite)

**Context**: 用户希望按审计建议优化仓库，并把规则写进 AI 工作流，避免后续反复口头补充规范。

**Decision**: 本任务采用保守整理方案。立即修正文档和验证脚本；把规则写入 `.trellis/spec/`，作为未来 AI 开发前读取的项目规则。暂不直接删除 `.trellis`、`.agents` 等维护者目录。

**Consequences**: 公开状态和验证体验会立刻变好；AI 规范会可复用。仓库顶层维护者目录的最终公开策略仍需后续单独任务处理，避免破坏当前 Trellis/Codex/Claude 工作流。

## Out Of Scope

- 不在本任务中大规模删除 `.trellis`、`.agents`、`.claude`、`.codex` 等目录。
- 不发布 npm 包、不移动 npm dist-tag、不创建 GitHub Release。
- 不重构主题系统、UI primitives、CLI 架构或 reference backend。
- 不引入新的 lint/test 框架。

## Technical Notes

- Relevant docs: `README.md`, `SECURITY.md`, `CHANGELOG.md`, `docs/guide/open-source-workflow.md`, `docs/guide/releasing.md`.
- Relevant scripts: `package.json`, `scripts/validate-generated-starter.mjs`, `scripts/reference-integration-smoke.mjs`, `scripts/reference-integration-smoke.test.mjs`.
- Relevant specs: `.trellis/spec/shared/index.md`, `.trellis/spec/shared/monorepo.md`, `.trellis/spec/shared/code-quality.md`, `.trellis/spec/frontend/i18n.md`, `.trellis/spec/frontend/quality.md`.
- Current public repo state: `main...origin/main [ahead 4]`; GitHub visible README lags local release-state updates until pushed.
