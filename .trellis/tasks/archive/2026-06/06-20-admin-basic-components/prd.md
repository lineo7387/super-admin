# brainstorm: 完善后台模板基础组件

## Goal

盘点当前 Super Admin 后台模板的基础组件覆盖面，判断是否真的需要新增 domain-neutral admin primitives，并规划一轮最值得做的基础组件优化，让生成项目更容易定制，同时保持默认模板 frontend-first、mock-backed、可替换 API adapter 的边界。

## What I Already Know

* 用户希望检查“目前后台模板里缺少哪些基础组件”，并完善/优化基础组件。
* 仓库规则要求使用 Trellis lake workflow；本任务材料放在 `.trellis/tasks/06-20-admin-basic-components/`。
* 当前共享 UI 包是 `packages/ui`，对外定位为 reusable Vue admin UI primitives。
* 当前 admin app 有 `/ui-kit/*` 示例页，按 Foundations、Actions、Inputs、Forms、Tables、Overlays、Feedback 展示共享 primitives。
* 当前 `packages/ui/src/index.ts` 已导出：`AdminAlert`、`AdminBulkActionBar`、`AdminButton`、`AdminCard`、`AdminCheckbox`、`AdminDataTable`、`AdminDrawer`、`AdminField`、`AdminFormFooter`、`AdminPagination`、`AdminRadioGroup`、`AdminScrollArea`、`AdminSelect`、`AdminSkeleton`、`AdminSwitch`、`AdminTableFrame`、`AdminTableToolbar`、`AdminTextInput`、`AdminTextarea`、`AdminValidationSummary`、`EmptyState`、`MetricTile`、`StatusPill` 以及 table helper。
* 当前 examples 已覆盖 dashboard metrics、workbench cards、users CRUD-style table、drawer form、access matrix、charts example、template guide。
* `docs/guide/project-structure.md` 和 `.trellis/spec/frontend/components.md` 明确：业务专属 columns、copy、workflow、validation rules 应留在 modules；`packages/ui` 只承载 domain-neutral admin primitives。
* `packages/cli/src/generate-starter.ts` 会复制 `apps/admin/src` 到 generated starter，因此 Users、UI Kit、examples 和 `packages/ui` 契约会直接影响用户生成项目体验。
* 用户补充：反馈类组件不能只在 UI Kit 存在，也需要在 Examples/真实案例页面里展示可复制用法。
* 术语澄清：当前 `AdminAlert` 实现是页面内 inline notice，不是弹出层。弹出式反馈应作为独立 primitive 讨论，例如 toast/notification 或 dialog/alert-dialog。
* 项目审计记录在 `research/project-audit.md`。

## Initial Component Gap Assessment

### Already Covered

* Actions: buttons、form footer、bulk action bar。
* Inputs/forms: text input、textarea、select、checkbox、radio、switch、field layout、validation summary。
* Tables: table frame、toolbar、data table states、pagination、selection helper。
* Feedback: alert、empty state、skeleton、status pill。
* Surfaces: card、drawer、scroll area、metric tile。

### Candidate Gaps

* Page/workflow layout primitives: reusable page header, section header, page toolbar, metadata/action header patterns now repeated in pages and examples.
* Filter/search composition: search field with icon, filter bar, active filter chips, reset filters action, density/sort controls. Existing table toolbar exposes slots, but common filter UI is still page-owned.
* Confirmation/destructive workflow: confirm dialog or confirmation panel for delete/archive/bulk actions. Existing drawer exists, but no modal/alert-dialog primitive.
* Overlay completeness: `AdminDrawer` is useful but minimal; it lacks focus trapping/restoring, configurable size/side, close labels, and unsaved-change guard hooks.
* Data display helpers: description list/key-value list, property grid, timeline/activity list, avatar/user cell, badge group/tag list. Existing examples hand-roll these patterns.
* Navigation/context helpers: breadcrumb/page trail, tabs/segmented control for local page modes, command/menu/dropdown for row actions. Existing app has workspace tabs, but no generic local tab or menu primitive in `packages/ui`.
* Table ergonomics: sortable header button, table row action menu, column visibility affordance, active state summary. Current `AdminDataTable` is intentionally slot-first and does not prescribe these.
* Feedback states: inline spinner/loading button, toast/snackbar, progress indicator, error boundary panel. Existing feedback is alert/empty/skeleton oriented.
* Documentation/testing: `packages/ui` currently has limited tests around helpers and `AdminField`; many component contracts are only demonstrated through UI Kit pages.

## Assumptions (Temporary)

* This should be a focused foundation pass, not a full design-system rebuild.
* New components should remain domain-neutral and profile-aware, matching `.trellis/spec/frontend/components.md`.
* UI Kit pages should demonstrate every added primitive with realistic admin copy, while business-specific examples stay under Examples/modules.
* The first implementation slice should prefer high-frequency admin workflows over broad component count.

## Open Questions

* None. User confirmed the pivot and the `AdminAlert` inline-notice semantics.

## Requirements (Evolving)

* Prefer improving existing primitives and examples before adding new public components.
* Preserve user freedom and extensibility: shared UI must stay optional, composable, replaceable, and usable independently.
* Do not make new or changed primitives required for module architecture, API adapters, routing, data fetching, or generated starter customization.
* Prefer slot-based composition and typed props/events over schema-driven or workflow-owned abstractions.
* Keep escape hatches: consumers can pass localized labels, use slots/classes where supported, use only part of the primitive set, or keep custom page-owned controls.
* Tighten existing `packages/ui` text/label contracts so app/generated starter surfaces can provide default Chinese copy without package-level i18n imports.
* Update UI Kit examples or app usage where needed to pass localized/default Chinese labels for shared primitives.
* Ensure feedback primitives are visible in copyable example contexts, not only isolated UI Kit pages:
  * Keep `AdminAlert` as an inline page notice, and keep it in existing Dashboard/Workbench/Access/Auth examples where it already demonstrates real query/auth states.
  * Make `EmptyState` visible through at least one generated-starter example state or route, not only hidden behind an always-nonempty branch.
  * Consider whether `AdminBulkActionBar` should be demonstrated in the Users example if row selection/bulk actions are added; otherwise keep it UI Kit-only and record why bulk workflows are out of scope.
  * Keep `AdminValidationSummary` demonstrated in Auth/forms where validation is real, not just UI Kit.
  * Do not change `AdminAlert` into an overlay; if popup feedback is needed, add or plan a separate primitive with a separate name and contract.
* Polish the Users table toolbar/example with existing primitives where practical, especially replacing native checkbox column controls with `AdminCheckbox`.
* Defer `AdminSearchField`, `AdminFilterBar`, `AdminFilterChip`, and `AdminConfirmDialog` until repeated demand is clearer.
* Preserve the frontend-first default scaffold and avoid adding backend/auth/provider requirements.
* Keep any shared primitive changes in `packages/ui`, explicitly exported from `packages/ui/src/index.ts` when new exports are actually added.
* Add or update UI Kit routes/examples for any changed shared primitive behavior.
* Keep domain-specific columns, copy, workflow semantics, and validation rules in modules.
* Add focused tests for pure helpers and important component contracts where practical.
* Ensure lint/typecheck and relevant tests pass.

## Acceptance Criteria (Evolving)

* [ ] PRD identifies current covered primitives and missing component categories.
* [ ] MVP scope is based on project audit rather than component count.
* [ ] `AdminAlert` remains an inline notice; popup feedback is not implemented in this task.
* [ ] Existing `packages/ui` primitives expose enough label/message props to avoid English-only generated starter defaults.
* [ ] Users/UI Kit examples demonstrate localized or caller-owned copy for shared primitives.
* [ ] Feedback primitives have realistic Examples/Auth usage, or the PRD/plan explicitly records why a primitive remains UI Kit-only.
* [ ] `EmptyState` is reachable/visible in at least one copyable example path or scenario.
* [ ] Users table column controls use existing styled primitives where practical.
* [ ] No new list/filter/confirm primitive is added unless the implementation plan explicitly justifies it.
* [ ] Implementation plan lists exact files/areas and verification commands for the execution AI.
* [ ] Added/changed public contracts are reflected in `packages/ui/src/index.ts` and UI Kit examples where relevant.
* [ ] UI Kit demonstrates changed primitives without business-specific coupling.
* [ ] Relevant tests are added or updated.
* [ ] `pnpm --filter @super-admin-org/ui typecheck` and relevant app/package tests pass.

## Definition of Done (Team Quality Bar)

* Tests added/updated where component behavior or helper logic changes.
* Lint/typecheck/test commands pass for touched packages/apps.
* Docs or UI Kit examples updated when the public primitive surface changes.
* No maintainer-only tooling appears required for ordinary users or generated starters.
* Rollout/rollback risk considered, especially package export/API changes.

## Out of Scope (Explicit)

* Adding backend, auth provider, database, AI provider, generated schema, or maintainer-only tooling as a user requirement.
* Moving business-specific users/workbench/access/dashboard logic into `packages/ui`.
* Replacing the current Vue/Tailwind/shadcn-vue direction.
* Full visual redesign of all themes/profiles in this task.
* Large all-at-once component library expansion without an MVP slice.
* Adding a full schema-driven table/grid abstraction in this slice.
* Adding `AdminSearchField`, `AdminFilterBar`, `AdminFilterChip`, or `AdminConfirmDialog` in this slice unless later confirmed as necessary.
* Changing `AdminAlert` from inline notice into a popup/overlay.
* Adding toast/snackbar, page headers, timeline, avatar/user-cell, property grid, or local tabs in this slice.

## Decision (ADR-lite)

**Context**: The current UI package already covers core primitives. Project audit found some repeated CRUD list-page composition, but the more concrete generated-starter issue is existing English-only default/hard-coded copy in shared primitives and partially localized UI Kit examples.

**Decision**: Recommended first implementation slice should polish existing UI primitive label/message contracts and generated-starter examples, not add new search/filter/confirm components.

**Consequences**: This keeps the task small, improves generated starter quality, aligns with i18n/public-delivery rules, and avoids growing the public component API before demand is clearer. Broader list/filter/display components remain documented gaps for future tasks.

## Necessity Assessment

### If We Do This

* Users get more copyable, consistent CRUD list-page building blocks for search, filters, active filter state, and destructive confirmation.
* Generated/admin examples can show a clearer "recommended path" for common list pages without requiring users to invent spacing, focus states, and destructive-action UX.
* Maintenance cost increases because `packages/ui` public API surface grows; each primitive needs exported contracts, examples, tests, and future compatibility care.
* Risk: if the components are too opinionated, users may feel the template is steering them into a fixed CRUD pattern.

### If We Do Not Do This

* Current users can still build CRUD pages today with existing primitives: `AdminTableToolbar`, `AdminTextInput`, `AdminSelect`, `AdminButton`, `AdminDataTable`, `AdminBulkActionBar`, and `AdminDrawer`.
* User freedom remains maximal because pages keep hand-composing their exact controls.
* The template stays smaller and easier to maintain.
* Cost for users: common list-page patterns remain more repetitive, and examples may look like "copy this whole page" instead of "compose these stable primitives."

### Current Recommendation

Adding new table/filter/confirm components is useful, but not urgent. It should not be framed as filling a critical missing feature. Based on the current project, the better near-term task is to improve existing UI primitive text/localization contracts and generated-starter examples. If near-term priorities are docs, generated starter quality, or adapter examples, this pivot is more valuable than new component APIs.

## Technical Notes

* Relevant repo guidance: `AGENTS.md`, `.trellis/spec/frontend/index.md`, `.trellis/spec/frontend/components.md`, `.trellis/spec/guides/index.md`, `docs/guide/project-structure.md`, `docs/guide/examples.md`.
* Project audit: `research/project-audit.md`.
* Current UI package files: `packages/ui/src/components/*`, `packages/ui/src/index.ts`, `packages/ui/src/lib/admin-table.ts`.
* Current UI Kit files: `apps/admin/src/modules/ui-kit/*`.
* Current feedback usage: `AdminAlert`, `StatusPill`, and `AdminSkeleton` already appear in Dashboard/Workbench/Access/Auth examples; `AdminValidationSummary` appears in Auth and UI Kit forms; `EmptyState` exists in Users Invites but default data means it is not visible; `AdminBulkActionBar` is currently demonstrated in UI Kit tables only.
* Current `AdminAlert` code renders a `<section>` inline in page layout. Popup feedback would need a separate component/contract, not a behavior change to `AdminAlert`.
* `AdminSelect` is already a custom/profile-aware select with keyboard handling and Teleport.
* `AdminDrawer` is intentionally lightweight today; overlay accessibility and workflow guards are likely the highest-risk optimization area.
* `AdminDataTable` is slot-first; higher-order table conventions should avoid locking module-specific table schemas into shared UI.
