# 重构生成器双轨维护

## Goal

把 `create-super-admin` 的生成链路重构为单一、可验证的 source-first 派生管线，消除 `apps/admin`、CLI 整文件字符串模板和发布时 runtime template 构建脚本之间的重复维护，使本地 source-root 生成、打包后的 CLI 生成和 npm 用户实际得到的 starter 使用同一份规则与同一来源。

## What I already know

- `apps/admin` 已被项目 contract 定义为 generated starter 的 source model。
- 本地 generator tests 通过 `sourceRoot` 直接读取 `apps/admin`；发布 CLI 默认读取 `dist/starter-template/admin`。
- `scripts/build-cli-template.mjs` 与 `packages/cli/src/generate-starter.ts` 重复维护排除规则，历史上已经出现 dead manifest 需要两处同步修复。
- `packages/cli/src/templates.ts` 为约 10 个 app-source 文件维护整文件字符串版本，文件总长 1,427 行。
- 历史任务 `06-28-sync-command-palette-starter-template` 证明 app preferences 改动可以先进入 source，随后 generated starter 因模板缺失 API 而失败。
- 当前测试大量使用 `toContain` 固定源码片段，能发现部分漂移，但不能证明 source-root 与 packed CLI 产物语义等价。
- default starter 必须继续 frontend-first、mock-backed，不得引入 backend、auth provider、AI provider 或 maintainer tooling 依赖。

## Research References

- [`research/current-generator-architecture.md`](research/current-generator-architecture.md) — 当前双路径、整文件 shadow 范围和三种重构方向。

## Proposed Direction

采用 source-first 单源派生管线：

- 一个 typed source policy 定义每个路径的 `copy | transform | generate | exclude` 行为。
- source-root generation 与 runtime-template packaging 复用同一实现，不再镜像 exclusion/filter 常量。
- 有 `apps/admin` 对应源文件的内容默认从 source 派生；只对可选能力做小范围、命名明确的 transform/factory。
- generator-owned template 仅保留无 source 对应的 root/config/README/AI context 等真实生成文件。
- 增加 source-root、built runtime template 和 packed CLI 的等价性验证。

## Decision (ADR-lite)

**Context**: 仅抽取 build/runtime 的共享过滤规则只能消除一小部分重复，`templates.ts` 中约 10 个 app-source 整文件 shadow 仍会让 shell/auth/preferences 修改需要双写，并延续历史漂移。

**Decision**: 本任务一次性完成 source-first 单源化：统一 derivation pipeline，移除全部具有 `apps/admin` 对应源文件的整文件 shadow，并建立 source-root、built runtime template 与 packed CLI 的等价性测试。

**Consequences**: 初始改动与验证范围较大，但完成后 app-source 行为只在 `apps/admin` 维护；generator 只保留显式 variant transforms 和无 source 对应的真实生成文件。

## Open Question

- 无。

## Requirements (evolving)

- `apps/admin` 保持唯一 app source model。
- source-root 与 published CLI 的 source selection、排除和 transform 规则由同一实现驱动。
- 不新增 checked-in 第二套 starter app tree。
- 不改变现有 CLI flags 和用户可见生成结果，除非是修复已确认漂移。
- 保持 single-theme、multi-theme、default locale、`--i18n`、no-charts、ECharts variants。
- 保持打包 CLI 在没有仓库 `apps/admin` 的环境中可独立生成。
- 对每个 intentional source/generated difference 建立可枚举、可测试的 policy。
- 一次性移除全部具有 `apps/admin` 对应源文件的整文件 shadow template。
- 增加结构性 guard：generator-owned templates 只能生成无 app-source 对应的 root/config/README/AI context 等白名单文件；重新引入 app-source 整文件 shadow 时 focused tests 必须失败。

## Acceptance Criteria (evolving)

- [x] build-time runtime template 与 runtime generator 不再重复维护 skip/exclusion 规则。
- [x] `templates.ts` 不再包含与 `apps/admin` 文件一一对应的整文件 shadow generator。
- [x] 结构性 guard 能拒绝未来新增 app-source 整文件 shadow。
- [x] source-root 与 packed CLI 对同一输入生成相同文件清单和相同 app-source 内容。
- [x] generated starter 继续通过 default、multi-theme/i18n、ECharts install/typecheck/build smoke。
- [x] packed `create-super-admin` 在仓库外可生成 starter。
- [x] `apps/admin` 变更若未被 generator 正确派生，会在 focused CLI tests 中失败，而不是等到发布阶段。
- [x] 不引入 backend/provider/maintainer tooling 到 generated starter。

## Implementation Outline

1. 建立 typed derivation policy，集中维护 `copy | transform | generate | exclude` 与 intentional differences inventory。
2. 让 source-root generation 和 runtime-template packaging 调用同一 source selection/materialization 实现，删除 `build-cli-template.mjs` 的重复过滤逻辑。
3. 逐个迁移 `env.d.ts`、users/auth/preferences/i18n/GlobalPreferences/theme registry 等 app-source full-file shadow，改为 source-owned seam 或窄范围 transform。
4. 将 `templates.ts` 收缩到真正 generator-owned 的 root/config/README/AI context 内容，并加结构性白名单 guard。
5. 增加 default、multi-theme/i18n、ECharts 的 source-root vs built/packed parity 测试，以及仓库外 packed CLI smoke。
6. 通过全仓质量门、starter validation 和 publish readiness，但不执行 npm 发布或 dist-tag 修改。

## Definition of Done

- TDD 覆盖 source policy、variant transforms、source-root/packed parity。
- `pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm test`、`pnpm build` 全绿。
- `pnpm validate:starter` 与 `pnpm validate:publish` 通过。
- pack-level CLI smoke 通过。
- 更新 `.trellis/spec/shared/cli-starter-contract.md` / `monorepo.md`，记录单源派生 contract。

## Out of Scope

- 发布新 npm 版本或变更 dist-tag。
- 新增业务模块 generator、backend、database、schema generator。
- 改变 CLI 交互参数、theme/chart/i18n 产品选项。
- 将 generated starter 改为依赖 monorepo source path。

## Technical Notes

- Main generator: `packages/cli/src/generate-starter.ts`
- Shadow templates: `packages/cli/src/templates.ts`
- Runtime snapshot build: `scripts/build-cli-template.mjs`
- Generator tests: `packages/cli/src/generate-starter.test.mjs`
- Pack validation: `scripts/publish-readiness.mjs`
- Durable contracts: `.trellis/spec/shared/cli-starter-contract.md`, `.trellis/spec/shared/monorepo.md`, `.trellis/spec/shared/public-delivery.md`
