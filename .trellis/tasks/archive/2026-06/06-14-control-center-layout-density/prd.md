# 修复控制中心布局切换与移除密度选项

## Goal

修复 `create-super-admin` 生成项目里控制中心布局切换只显示文字、不显示布局预览 UI 的问题，并移除意义不大的全局密度选项，让 starter 的首屏设置体验更清晰、更可信。

## What I already know

* 用户反馈：`create-super-admin` 安装后的控制中心布局切换 UI 没出现，只有文字。
* 用户反馈：密度选项“舒适 / 紧凑”感觉没效果且意义不大，可以删除。
* Repo app 的 `apps/admin/src/shell/preferences/GlobalPreferences.vue` 已经有布局预览小图。
* CLI 生成模板 `packages/cli/src/templates.ts#createGlobalPreferences()` 的布局切换只输出 `layout.name` 和 `layout.description`，没有 repo app 的布局预览小图；这是 generated starter 和 repo app 不一致，不是用户环境偶发问题。
* 全局 density 当前存在于 `packages/core/src/design-profile.ts`、`packages/core/src/preferences.ts`、`apps/admin/src/stores/preferences.store.ts`、`apps/admin/src/App.vue` 和 CLI 模板 store。
* `packages/theme/src/apply-profile.ts` 只把 density 写到 `root.dataset.density`，没有设置会改变 spacing/typography 的 CSS variable；当前 CSS/主题也没有基于 `data-density` 的实际密度差异。
* Users 表格和 UI Kit 表格里还有 component-local density（`AdminDataTable` / `UsersTable`），这是表格演示/局部组件行为，和控制中心的全局 density 不是同一个产品语义。

## Assumptions (temporary)

* 本任务优先修正公开 starter 体验，不做大规模 package API breaking change。
* 布局预览应在 repo app 和 generated starter 中保持一致。
* 全局 density 从用户可见控制中心移除；内部兼容字段可暂留，避免破坏已发布包 API 和旧 localStorage payload。
* 表格组件自己的 density prop 不在本任务删除范围内。

## Open Questions

* None.

## Requirements (evolving)

* `create-super-admin` 生成的 `src/shell/preferences/GlobalPreferences.vue` 中，布局切换卡片应显示和 repo app 同等的可视化 layout preview。
* 布局切换 preview 不应依赖容易被生成模板/Tailwind 扫描漏掉的动态 class。
* 控制中心不再显示“密度 / 舒适 / 紧凑”选项。
* 控制中心标题和说明文案不再暗示 density 会立即生效。
* Repo app 和 generated starter 的控制中心结构保持一致。
* 保持 default scaffold frontend-first、mock-backed，不引入 backend/auth/database/AI provider。

## Acceptance Criteria (evolving)

* [x] Repo app 控制中心布局切换显示可视化 preview，点击后仍能切换 `tri-column` / `dual-column` / `top-header`。
* [x] Generated starter 控制中心布局切换显示同等可视化 preview，不再只有文字。
* [x] Repo app 和 generated starter 控制中心都不再显示全局 density 选择。
* [x] i18n catalog 不再包含控制中心全局 density UI 文案，或至少不再被控制中心引用。
* [x] Existing localStorage preferences with `density` do not break app startup.
* [x] Starter validation still passes.

## Definition of Done

* Add/update tests covering generated `GlobalPreferences.vue` layout preview and density removal.
* Add/update tests covering repo app `GlobalPreferences.vue` density removal.
* `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`, and `pnpm validate:starter` pass.
* Browser smoke the control center in repo app or generated starter.

## Out of Scope

* Removing `Density` from published `@super-admin-org/core` type exports in a patch release.
* Changing `applyDesignProfile()` public signature unless we intentionally plan a breaking release.
* Removing table-local density examples in `UsersTable`, `AdminDataTable`, or UI Kit table demos.
* Adding new layout presets.
* Adding backend/auth/database/AI provider behavior.

## Technical Approach

MVP:

* Extract or duplicate a stable layout preview markup helper/pattern into both repo app `GlobalPreferences.vue` and generated template output.
* Use static, safelist-friendly classes or inline styles for preview grid shapes instead of relying on template-generated arbitrary Tailwind classes that generated output might not compile.
* Remove density selector from control center script/template in both repo app and CLI generated template.
* Keep internal `density: 'comfortable'` compatibility for now, so older stored preferences and current public package function signatures remain safe.
* Update control center copy from “mode and density” to a mode/language-focused label.

## Root Cause Notes

### Layout preview missing

The generated template path does not include the repo app preview markup. `packages/cli/src/templates.ts#createGlobalPreferences()` renders only layout name and description, while `apps/admin/src/shell/preferences/GlobalPreferences.vue` renders preview blocks. Generated starter output therefore cannot show preview UI.

### Density has no meaningful global effect

`applyDesignProfile(root, profile, mode, density)` writes `root.dataset.density = density`, but no inspected theme tokens/CSS rules use that value to alter global spacing or typography. The visible “舒适 / 紧凑” selector therefore over-promises behavior.

## Decision (ADR-lite)

**Context**: Users see a public starter control center. Missing layout previews and a weak density selector make the template feel unfinished.

**Decision**: Fix generated layout preview parity and remove global density from visible control center UI. Preserve internal density compatibility for now.

**Consequences**: Starter UX improves without breaking public package API. A later breaking-cleanup task can remove `Density` from core/theme if the project decides to bump a major/minor with migration notes.

**User confirmation**: User selected option 1: remove only visible Control Center density UI and keep internal compatibility.

## Technical Notes

* Inspected:
  * `apps/admin/src/shell/preferences/GlobalPreferences.vue`
  * `packages/cli/src/templates.ts`
  * `packages/core/src/preferences.ts`
  * `packages/core/src/design-profile.ts`
  * `packages/core/src/shell.ts`
  * `packages/theme/src/apply-profile.ts`
  * `apps/admin/src/App.vue`
* Relevant specs to read before implementation:
  * `.trellis/spec/frontend/app-shell.md`
  * `.trellis/spec/frontend/i18n.md`
  * `.trellis/spec/frontend/quality.md`
  * `.trellis/spec/shared/cli-starter-contract.md`
  * `.trellis/spec/shared/public-delivery.md`

## Verification

* Added regression checks for repo app `GlobalPreferences.vue`, generated starter `GlobalPreferences.vue`, i18n labels, and persisted `density` compatibility.
* Browser smoke on `http://127.0.0.1:5174/` verified:
  * Control Center shows `显示模式` and does not show `密度` / `舒适` / `紧凑`.
  * Three `[data-layout-preview]` elements render with visible dimensions.
  * `tri-column` / `top-header` / `dual-column` clicks switch shell layout branches while the Control Center stays open.
* Fresh commands passed:
  * `pnpm typecheck`
  * `pnpm test`
  * `pnpm lint`
  * `pnpm build`
  * `pnpm validate:starter`
