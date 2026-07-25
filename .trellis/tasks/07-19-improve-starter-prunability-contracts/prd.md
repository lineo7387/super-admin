# 提升 starter 可裁剪性与运行时契约

## Goal

让 `create-super-admin` 生成的默认 starter 真正满足“示例可删除、基础能力仍可运行”的公开承诺，同时显式声明与 Vite 8 对齐的 Node.js 运行时要求，并用自动化验证守住这两个契约。

## Known Facts

- 当前 `auth` contract 反向依赖可删除的 `users` 示例类型：`modules/auth/auth.types.ts -> modules/users/users.types.ts`。
- 根路由、登录回跳和 workspace 空状态仍存在 `/examples/dashboard` 硬编码；删除示例后会留下失效导航。
- `src/modules/module-registry.ts` 已经是顶层模块注册入口，适合同时成为默认业务入口的事实源。
- 当前文档将 `apps/admin/src/modules/examples/` 描述为可复制示例，但没有提供经过验证的完整移除步骤。
- CLI 与生成项目未显式声明 Node.js `engines`；当前 Vite 8 工具链要求 `^20.19.0 || >=22.12.0`。
- 已有 generated-starter validator、packed CLI smoke 和双语文档体系，可在现有质量门上扩展，不需要引入新的脚手架模式。

## Assumptions

- “可删除示例”指 Dashboard、Workbench、Users、Access、Template Guide，以及启用时的 Charts；保留 `auth`、应用壳层、workspace 能力和 UI Kit。
- 用户仍通过编辑 `module-registry.ts` 选择顶层模块；本次不新增 `--no-examples` CLI preset，也不让 CLI 自动删除示例。
- 删除示例后，默认入口应由剩余 registry 自动推导；若 registry 为空，使用稳定且不会指向已删除模块的兜底行为。
- 旧版 `/dashboard`、`/workbench`、`/access`、`/users*` alias 属于 Examples 的兼容层，不应继续由基础 router 硬编码拥有。

## Open Questions

- 无。用户已确认采用兼容优先方案并开始实施。

## Requirements

- `auth`、router、workspace 等基础层不得 import 或硬编码依赖任何可删除示例模块。
- 默认已认证路径由注册模块推导，并被 root redirect、登录回跳和 workspace fallback 复用。
- 当前默认 Dashboard 落点和 legacy example aliases 在 Examples 仍注册时保持兼容。
- 保持 `module-registry.ts` 为模块启用/移除的唯一显式 composition 入口。
- 为 repository、`create-super-admin` CLI package 与生成项目声明一致的 Node.js engine contract。
- 在生成器与 starter validator 中增加回归覆盖，证明按文档移除示例后仍可 type-check、test 和 build。
- 更新中英文 Getting Started / Examples / AI collaboration 上下文，说明删除步骤、默认入口规则和 Node.js 要求。
- 生成 starter 继续保持 frontend-first、mock-backed；不引入 backend、auth provider、database 或 maintainer-only AI 工具依赖。

## Acceptance Criteria

- [x] `auth` 类型不再 import `users` 或其他示例模块类型。
- [x] root redirect、登录安全回跳、关闭最后 workspace tab、stage window fallback 不再硬编码 `/examples/*`。
- [x] 默认 starter 的 `/` 与无 redirect 登录仍进入 `/examples/dashboard`，现有 legacy aliases 在 Examples 存在时保持可用。
- [x] 删除示例 modules、对应 example API/mock 文件，并从 module registry 移除 Examples 注册后，生成项目的 standard quality commands 仍通过。
- [x] 删除示例后 UI Kit 仍可作为已认证默认入口；registry 为空时有明确且经过测试的安全兜底。
- [x] root、CLI 和生成项目的 `engines.node` 一致为 Vite 8 支持范围，生成器测试与 validator 会阻止漂移。
- [x] 中英文文档给出同构的删除 recipe，并明确哪些基础能力会保留。
- [x] `pnpm lint`、`pnpm format:check`、`pnpm test`、`pnpm build`、`pnpm docs:build`、`pnpm validate:starter` 与相关 publish validation 通过。

## Definition of Done

- 代码、模板源、CLI 生成逻辑、自动化验证和双语公开文档保持一致。
- 生成后的默认、ECharts、minimal 与“移除示例”场景均有可执行证据。
- 新架构决策和契约沉淀到 `.trellis/spec/` 或现有 public delivery contract；任务 research、plan 与 check 记录完整。
- 不引入对普通 starter 用户可见的 maintainer-only workflow 负担。

## Technical Approach

推荐采用 app-local registry-derived 路由契约：

1. 为 module registration 增加可验证的默认入口语义；Examples 显式声明 `/examples/dashboard`，因此 registry-derived 路由不会把现有首页改成 Template Guide。没有显式入口的模块回退到自身 `nav.path`；registry 为空时进入 neutral `/workspace` route，避免 root/auth redirect loop。
2. root redirect、auth redirect sanitization、workspace tabs 与 stage windows 共同消费该路径；不把 app routing policy 下沉到 `@super-admin-org/core`。
3. 将 legacy aliases 作为 Examples registration 的兼容路由，而不是 router 基础层硬编码：Examples 存在时兼容旧地址，移除 Examples 时 aliases 一起消失。
4. `auth` 自有 session role contract，不复用 Users 示例类型。
5. 公开删除 recipe 以 `module-registry.ts` 为唯一 composition edit；自动化在 packed default starter 已安装后执行同一裁剪并重跑 standard quality commands。
6. starter validator 增加“Examples present/removed”两种契约，不把 `--no-examples` 暴露为产品能力。
7. Node engine 在 root、CLI manifest 和 generated package template 中显式声明，并由生成器/validator tests 检查一致性。

备选方案与详细取舍见 `research/audit-findings.md`。

## Decision (ADR-lite)

**Context**: 当前默认入口和基础层依赖 `/examples/*`，仅删除示例文件会破坏 auth 与 workspace；显式 `homePath` 又会产生第二个易漂移字符串。

**Decision**: 使用 registry-derived app-local default route，Examples 显式声明当前 Dashboard 入口，保留 UI Kit 作为标准裁剪后的首个模块，并为完全空 registry 提供 neutral route。legacy example aliases 由 Examples registration 拥有，在模块存在时继续兼容，在用户主动删除模块时一起移除。

**Consequences**: 默认用户看不到首页行为变化；旧 aliases 在默认项目中继续兼容；自定义首个模块会在删除 Examples 后自然成为 home；不增加 CLI preset；需要为 module registration 的默认入口和兼容路由增加小型、可测试的 contract。

## Out of Scope

- Dependabot / dev dependency 安全升级。
- Playwright、visual regression、a11y 或 coverage gate。
- 官网截图、在线 demo 和 GitHub public presentation 改版。
- `--no-examples`、interactive example selection 或新的 starter preset。
- backend、database、auth provider、schema generation 或 CodeGraph 集成。
- 全量重构 i18n catalog 或 workspace architecture。

## Technical Notes

- 相关规范：`.trellis/spec/frontend/`、`.trellis/spec/shared/cli-starter-contract.md`、`.trellis/spec/shared/public-delivery.md`。
- 重点文件：`apps/admin/src/modules/auth/auth.types.ts`、`apps/admin/src/modules/module-registry.ts`、`apps/admin/src/router/`、`apps/admin/src/workspace/`、`packages/cli/src/templates.ts`、`packages/cli/src/starter-source.ts`、`scripts/validate-generated-starter.mjs`。
- 研究记录写入本任务 `research/`。
