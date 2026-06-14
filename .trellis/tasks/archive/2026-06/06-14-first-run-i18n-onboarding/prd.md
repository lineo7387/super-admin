# 首次打开体验与 app i18n 收口

## Goal

提升新用户通过 `create-super-admin` 生成项目后的首次打开体验，让默认 `zh-CN` locale、示例模块、导航 meta、Template Guide 和 mock-backed 边界表达更一致。目标不是添加新业务能力，而是让公开发布后的第一眼更可信、更连贯，并继续保持 frontend-first、mock-backed、generated starter 不依赖维护者工具。

## What I already know

* Super Admin 已公开发布，`create-super-admin@latest` 和 `@super-admin-org/ui@latest` 已到 `0.1.3`。
* 文档已拆分为「使用 Super Admin」和「维护/开发本仓库」两个受众。
* VitePress 已做中英文切换：中文默认根路径，英文在 `/en/`。
* 默认 scaffold 必须保持 frontend-first、mock-backed，不能强制 backend、database、auth provider、AI provider、generated schema 或维护者工具。
* 前端数据流应保持 `Page -> module query composable -> API adapter -> api/mock data or user API`。
* app 已有 i18n 基础：`apps/admin/src/i18n/locales/zh-CN.ts` 和 `apps/admin/src/i18n/locales/en-US.ts`。
* 用户模块、auth、shell/preferences 等部分已经使用 `vue-i18n`。
* `TemplateGuidePage`、`DashboardPage`、`WorkbenchPage`、`AccessPage`、部分 route meta / manifest 文案仍有 hard-coded English，会影响中文默认首屏一致性。
* `packages/cli/src/templates.ts` 会把 `apps/admin` 的 runtime template 打包到 `create-super-admin`，因此 app 文案收口会影响 generated starter。

## Assumptions (temporary)

* 本任务优先做现有 app/starter 的文案与 i18n 收口，不新增 onboarding wizard、后端接入向导或新 provider。
* 默认中文体验应完整；英文 locale 可保持同等语义，但不一定扩展为完整 docs-level bilingual rewrite。
* 需要同步考虑 generated starter，因为 starter 从 admin runtime template 派生。

## Open Questions

* None for this implementation slice.

## Requirements (evolving)

* 保持 default scaffold frontend-first and mock-backed。
* 不让 backend、database、auth provider、AI provider、generated schema 或 Trellis/Codex/Claude/CodeGraph 成为普通用户必需项。
* 将当前默认中文体验中明显的 hard-coded English 收口到 i18n message catalog。
* 保持 `zh-CN` 为默认 locale。
* 任何新增或迁移的用户可见文案应有默认中文消息。
* MVP 范围采用“示例模块收口”：覆盖 Template Guide、dashboard、workbench、access、users 可见残留，以及 examples route meta / manifest 中影响导航、workspace title、breadcrumb 或 visible description 的文案。
* 暂不做 UI Kit 全量迁移；仅当 examples 收口需要共享已有 i18n key 或修复明显破裂体验时，才做最小相关调整。

## Acceptance Criteria (evolving)

* [x] 新用户首次打开 generated starter 时，主要导航、Template Guide、示例模块标题/说明/状态文案不出现不必要的 English-only copy。
* [x] `zh-CN` 与 `en-US` locale catalog 覆盖本任务迁移的用户可见文案。
* [x] route meta / manifest 中影响 workspace title、breadcrumb、navigation 或 visible description 的文案完成一致性处理。
* [x] Template Guide、dashboard、workbench、access、users examples 在默认 `zh-CN` 下显示中文 copy；切换到 `en-US` 后保留对应英文 copy。
* [x] 页面仍通过 query composables 调用 API adapters，不引入直接 transport 调用。
* [x] generated starter 仍不包含 reference backend、docs site、tests、lint/e2e tooling 或维护者 AI workflow files。

## Definition of Done (team quality bar)

* Tests added/updated where behavior or string lookup contracts change.
* `pnpm lint`, `pnpm typecheck`, relevant tests, and build pass before completion.
* Docs/notes updated if public user behavior changes.
* Rollout/rollback considered if generated starter output changes.

## Out of Scope (explicit)

* 新增 backend/auth/database/AI provider 集成。
* 新增真实 API schema generator 或默认 API contract 绑定。
* 新增 onboarding wizard、interactive tutorial 或产品 tour，除非后续明确纳入。
* UI Kit 页面全量 i18n 迁移。
* 修改 release/publish 流程。
* 将 Trellis、Codex、Claude、CodeGraph 等维护者工具复制或描述为 generated starter 必需内容。

## Technical Approach

Use the existing app-local Vue I18n setup under `apps/admin/src/i18n/`. Move hard-coded examples copy into namespaced locale keys, then update the relevant Vue pages/helpers/manifests to resolve copy through `useI18n()` or existing navigation translation helpers where appropriate.

Keep the migration scoped to visible examples surfaces and route/meta copy. Do not alter API adapter behavior, mock data shapes, package dependencies, backend/reference integration, or generated starter boundaries.

## Component / Surface Map

* `apps/admin/src/i18n/navigation.ts`: app-local translation helper for module names, nav items, and workspace route titles. It should keep manifest data static while resolving localized labels at render time.
* `TemplateGuidePage.vue`: composition surface for template boundary guidance. It should use locale catalogs for headings, alerts, signals, section titles, and item guidance.
* `DashboardPage.vue`, `WorkbenchPage.vue`, `AccessPage.vue`: example module pages. They should keep query/data behavior untouched and localize only page chrome, alerts, action labels, and static explanatory copy.
* `examples.manifest.ts`: static manifest remains the source of route/nav structure. Localization should happen through helper mapping rather than making the manifest dynamic.
* `zh-CN.ts` / `en-US.ts`: app-local locale catalogs own user-facing copy for migrated example surfaces.

## Implementation Notes

* Added precise app-local navigation helpers for ambiguous manifest labels such as `Examples`, `Users`, and route descriptions.
* Moved Template Guide, dashboard, workbench, access, route description, validation badge, and AI assistant provider status copy into `zh-CN` / `en-US` catalogs.
* Kept `packages/ui` independent from app i18n by adding `requiredLabel` / `optionalLabel` props to `AdminField`.
* Preserved mock data and API adapter behavior; visible English that remains in examples is mock business data such as names, email addresses, statuses, and technical identifiers.

## Verification

* `pnpm typecheck`
* `pnpm test`
* `pnpm lint`
* `pnpm build`
* `pnpm validate:starter`
* Browser smoke on `http://127.0.0.1:5173/` for login, Template Guide, dashboard, workbench, access, users/all, and AI assistant panel in default `zh-CN`.

## Decision (ADR-lite)

**Context**: The public docs and starter are now Chinese-first, but several high-visibility examples surfaces still include hard-coded English, which weakens the first-run experience after `create-super-admin`.

**Decision**: Use the “示例模块收口” MVP. Migrate Template Guide, dashboard, workbench, access, users visible residual copy, and examples route meta/manifest copy into the app i18n catalogs. Keep UI Kit full migration out of this task.

**Consequences**: This gives the strongest first-run improvement for moderate cost and avoids expanding the task into a full design-system documentation/i18n pass. A later task can migrate UI Kit pages with their own acceptance criteria.

## Technical Notes

* Relevant specs already read:
  * `AGENTS.md`
  * `.trellis/workflow.md`
  * `.trellis/spec/shared/public-delivery.md`
  * `.trellis/spec/shared/monorepo.md`
  * `.trellis/spec/frontend/index.md`
  * `docs/guide/ai-collaboration.md`
* Likely frontend spec files for implementation phase:
  * `.trellis/spec/frontend/i18n.md`
  * `.trellis/spec/frontend/directory-structure.md`
  * `.trellis/spec/frontend/type-safety.md`
  * `.trellis/spec/frontend/quality.md`
  * `.trellis/spec/shared/public-delivery.md`
* `.trellis/spec/frontend/i18n.md` says existing hard-coded English UI text should be migrated during the i18n phase, default locale stays `zh-CN`, optional locale is `en-US`, and migration order after shell/auth includes users, access, dashboard, and workbench example modules before UI Kit.
* `.trellis/spec/frontend/quality.md` requires lint/typecheck/relevant tests, local app run, browser checks, and theme/profile/layout verification when UI surfaces change.
* Likely impacted app files, to be confirmed before implementation:
  * `apps/admin/src/i18n/locales/zh-CN.ts`
  * `apps/admin/src/i18n/locales/en-US.ts`
  * `apps/admin/src/modules/examples/TemplateGuidePage.vue`
  * `apps/admin/src/modules/examples/template-guide.ts`
  * `apps/admin/src/modules/dashboard/DashboardPage.vue`
  * `apps/admin/src/modules/workbench/WorkbenchPage.vue`
  * `apps/admin/src/modules/access/AccessPage.vue`
  * `apps/admin/src/modules/examples/examples.manifest.ts`
  * related tests that assert source strings or i18n keys

## Expansion Sweep

### Future evolution

* Later tasks could add a richer first-run guide or public preview assets, but this task should first make the current app feel coherent.
* The i18n catalog structure should leave room for future module migrations without flattening all copy into unrelated buckets.
* UI Kit page migration remains a likely follow-up once examples are coherent.

### Related scenarios

* `create-super-admin --i18n` should continue to include `zh-CN` and `en-US`; default generation without `--i18n` should still have safe `zh-CN` messages.
* Docs and generated starter should continue to explain adapter replacement without implying a backend requirement.
* Route meta / manifest text should stay consistent with translated navigation labels so workspace tabs and breadcrumbs feel coherent.

### Failure / edge cases

* Avoid breaking tests that inspect source strings by migrating them to assert stable i18n keys or rendered behavior.
* Avoid route/meta changes that break workspace tabs, keep-alive titles, or navigation sorting.
