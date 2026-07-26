# 记录 VitePress v2 安全告警延期规则

## Goal

把维护者关于 VitePress 文档工具链告警的延期决策写入项目规则：VitePress v2 成为 stable 之前不修改该依赖链、不重复询问；v2 stable 发布后再作为独立迁移任务评估。

## What I already know

- PR #72 已合并，`main` 工作树干净。
- 四个告警都来自 `pnpm-lock.yaml` 的文档工具链。
- 根部 `vite@8.1.5` 与 `esbuild@0.28.1` 已处于修复版本。
- 易受影响路径是 `vitepress@1.6.4 -> vite@5.4.21 -> esbuild@0.21.5`。
- VitePress 1.6.4 是最新 stable；VitePress 2 仍为 alpha。
- `@vitejs/plugin-vue@5.2.4` 支持 Vite 6。
- 维护者明确决定当前不采用 scoped override，也不升级 VitePress alpha。

## Requirements

- 在 `.trellis/spec/shared/public-delivery.md` 的依赖安全规则中记录当前延期决策。
- VitePress v2 成为 npm `latest` 的稳定版本之前：
  - 保持 `vitepress@1.6.4` 及其当前文档依赖链。
  - 不添加 `vitepress>vite` 或类似 transitive override。
  - 不采用 VitePress 2 alpha/beta/rc。
  - 不为 GitHub alerts `#30`、`#31`、`#35`、`#37` 重复询问维护者。
- 仅当 `npm view vitepress dist-tags --json` 显示 `latest` 为无 prerelease 标识的 `>=2.0.0` 时，才重新开启迁移评估。
- 告警保持可见，不自动 dismiss；其他不相关安全告警仍按正常 severity 与 dependency-path 规则处理。
- 不修改 `package.json`、`pnpm-lock.yaml`、starter 或发布包。

## Acceptance Criteria

- [x] 项目规则明确列出受延期决策覆盖的依赖链和四个 GitHub alert 编号。
- [x] 项目规则明确禁止在 VitePress v2 stable 前重复询问、强制 override 或采用 prerelease。
- [x] 项目规则包含稳定版触发条件和未来迁移后的规则清理要求。
- [x] `package.json` 与 `pnpm-lock.yaml` 无变更。
- [x] `pnpm format:check` 通过。

## Definition of Done

- 延期决策对后续维护者和 AI 可发现、无歧义。
- 稳定版文档工具链和公开用户行为完全不变。
- 规则文件格式检查通过。
- Trellis 任务归档并记录 session journal。

## Technical Approach

扩展 `.trellis/spec/shared/public-delivery.md` 的
`Dependency Security Triage`，增加一个针对 VitePress 1.x 文档链的
maintainer decision。规则使用 npm `latest` dist-tag 和 semver prerelease
作为唯一重新评估触发条件，避免“看见 alpha/Dependabot 告警就再次询问”。

## Decision (ADR-lite)

**Context**: 最新稳定版 VitePress 仍锁定 Vite 5；可通过 scoped override 消除告警，但维护者选择等待 VitePress v2 stable，以避免维护非官方依赖组合。

**Decision**: 当前保持 VitePress 1.6.4 依赖链和四个可见告警；VitePress v2 stable 前不重复询问、不 override、不采用 prerelease。

**Consequences**: 接受文档开发服务器工具链的已知 dev-only 风险；避免引入非官方组合。VitePress v2 成为 npm `latest` stable 后必须新建迁移任务并移除此临时延期规则。

## Research References

- [`research/dependabot-vitepress-chain.md`](research/dependabot-vitepress-chain.md) — 告警、依赖路径、官方版本约束与方案比较。

## Out of Scope

- 升级到 VitePress 2 alpha。
- 添加任何 scoped/global dependency override。
- 修改或关闭 GitHub alerts `#30`、`#31`、`#35`、`#37`。
- 修改 admin、CLI、generated starter 或发布包运行时依赖。
- 新增依赖第三方 registry 可用性的 CI audit job。
- 执行 npm publish 或版本发布。

## Open Questions

- 无；维护者已明确选择等待 VitePress v2 stable。

## Technical Notes

- GitHub alerts: `#30`、`#31`、`#35`、`#37`。
- 唯一项目规则改动是 `.trellis/spec/shared/public-delivery.md`。
- 以后遇到这四个告警时直接引用延期规则，不再请求相同决策。
