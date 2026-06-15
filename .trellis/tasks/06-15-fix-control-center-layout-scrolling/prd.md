# Fix control center layout scrolling

## Goal

修复 Control Center 在主题/显示模式/布局切换区域里的高度与滚动体验问题，让设置弹层在不同视口、不同语言、不同 layout preset 下都能自然占用可用空间，并且所有溢出内容都能滚动到。同步保持 monorepo admin app 与 `create-super-admin` 生成模板一致。

## What I already know

* 用户反馈：Control Center 里的主题切换、显示模式与布局区域看起来被固定高度定死，观感不好。
* 用户反馈：Control Center 存在滚动问题，溢出的部分滚动不到。
* 用户希望我同时思考 Control Center 内容是否需要调整，并提出建议。
* 用户补充反馈：只有 2 个主题且没有启用 i18n 时，Control Center 仍然有很多空白；短配置不能被强行拉满到 viewport 高度。
* 当前没有 active Trellis task；本任务已创建在 `.trellis/tasks/06-15-fix-control-center-layout-scrolling/`。
* `apps/admin/src/shell/preferences/GlobalPreferences.vue` 的弹层外壳使用 `max-h-[88vh] overflow-hidden`，内部 `AdminScrollArea` 使用 `max-h-[calc(88vh-92px)]`。
* `packages/cli/src/templates.ts#createGlobalPreferences()` 生成同样的固定高度与滚动区结构，因此修复必须同步到生成 starter。
* `AdminScrollArea` 的 wrapper 高度继承外层；当外层只给 `max-height` 且 header 高度由内容变化时，内部 `calc(88vh-92px)` 会变成脆弱估算。
* 上一次相关任务 `.trellis/tasks/archive/2026-06/06-14-control-center-layout-density/prd.md` 已确认 Control Center 不显示全局 density selector，并要求 layout preview 在 app 与 generated starter 中保持一致。
* `.trellis/spec/frontend/app-shell.md` 要求 Control Center 是全局即时配置弹层，切换 theme/mode/layout/workspace option 时不关闭弹层、不丢失 route。
* `.trellis/spec/shared/cli-starter-contract.md` 要求 generated Control Center layout choices render visual layout previews, not text-only cards, and stay in parity with the monorepo admin app。

## Assumptions

* 本任务优先修复 Control Center 弹层布局和滚动，不引入新的设置项。
* Control Center 仍保持“即时生效”的设置面板，不改为 save/cancel form。
* 内容结构可以做轻量调整，但不做大规模重设计，避免影响当前 0.1.5 本地修复范围。
* 需要兼顾单主题 generated starter：没有 theme switcher 时，布局仍应自然，不出现空白或滚动死区。

## Open Questions

* None.

## Requirements

* Scope decision: choose方案 1，修布局/滚动 + 轻量整理；保持现有分组，不做 tabs/左侧导航式大重设计。
* Control Center modal 不再依赖固定像素估算 `calc(88vh - 92px)` 来决定内部滚动高度。
* Modal 外壳应使用稳定的 viewport 约束与 `flex`/`grid` 分配，让 header 使用自然高度，scroll area 占剩余空间。
* Modal 高度应由内容决定并设置 viewport 上限；短内容自然收缩，长内容才进入滚动状态。
* 内容超出时，滚动区必须能滚动到底部，workspace / Stage Manager / AI provider 等底部内容不能被裁掉。
* 切换 theme/profile、display mode、locale、layout preset、workspace tabs、Stage Manager options 时，Control Center 保持打开。
* Layout preview 保持可见，且不因滚动修复被压扁或引起布局抖动。
* 修复同步到 `apps/admin/src/shell/preferences/GlobalPreferences.vue` 与 `packages/cli/src/templates.ts` 的 generated starter。
* 更新或新增 raw-source regression tests，覆盖去掉固定 `calc(88vh-92px)` 和新的滚动容器结构。
* 继续遵守 frontend-first、mock-backed、generated starter 不引入 backend/auth/AI provider 要求。

## Acceptance Criteria

* [x] `apps/admin` 的 Control Center 在小视口下打开后，能滚动到最底部所有设置内容。
* [x] 切换 `tri-column` / `dual-column` / `top-header` 时，Control Center 保持打开，内容滚动仍可用。
* [x] Control Center 不再包含 `max-h-[calc(88vh-92px)]` 这类依赖固定 header 高度的内部滚动估算。
* [x] Control Center 不使用固定 viewport 高度强行撑开短配置场景。
* [x] 2 个主题且无 i18n 的 generated starter Control Center 不被固定拉满高度。
* [x] Generated starter 的 `src/shell/preferences/GlobalPreferences.vue` 输出同样使用修复后的弹层/滚动结构。
* [x] Layout preview 仍然存在于 app 与 generated starter。
* [x] 相关 tests / typecheck / lint / build / starter validation 按任务风险运行并通过。
* [x] 用浏览器实际检查 Control Center 的滚动和布局切换。

## Definition of Done

* Relevant specs read before implementation.
* Code changes are scoped to Control Center layout/scroll behavior and generated starter parity.
* Tests updated for app and generated template where practical.
* Browser visual QA covers at least a constrained viewport and one layout switch while the modal is open.
* No npm publish, dist-tag change, or push unless the user explicitly requests it.

## Out of Scope

* Publishing `create-super-admin@0.1.5`.
* Changing npm `latest` / dist-tag.
* Pushing commits.
* Reintroducing global density selector.
* Removing persisted `density` compatibility from core/theme.
* Large redesign of the shell, Stage Manager, AI Assistant, or theme registry.
* Adding backend/auth/database/AI provider requirements.

## Technical Approach

Recommended MVP:

* Use the Control Center `AdminScrollArea` as the viewport-bounded dialog surface (`max-height`, not fixed `height`), so short content controls modal height while long content scrolls.
* Put the header inside the scroll surface and make it sticky, keeping close/title visible without subtracting a guessed header pixel height.
* Remove the nested fixed `max-h-[calc(88vh-92px)]` pattern from both app and generated template.
* Keep the two-column content grid on medium+ viewports, add `items-start`, and let the scroll view define content height naturally.
* Consider reducing visual heaviness by turning current large cards into consistent setting groups only if it can be done safely in this task.

## Content Adjustment Notes

Decision: do not do a big redesign in this bugfix. The current grouping is conceptually sound:

* Theme/Profile
* Display/Locale
* Layout
* Workspace/Stage Manager/AI provider

Possible later improvement: split Control Center into left navigation or tabs only after settings grow further. Right now that would add interaction complexity without directly fixing the scroll bug.

## Decision (ADR-lite)

**Context**: Control Center 的主要问题是弹层高度与滚动容器估算不稳定，而不是设置项本身不成立。

**Decision**: 用户选择方案 1：修布局/滚动 + 轻量整理。保持现有内容分组，移除内部固定高度估算，让滚动容器由弹层剩余空间自然承接。

**Consequences**: 修复范围更小，适合当前本地 0.1.5 修复节奏；后续如果 Control Center 设置项继续增多，再单独设计 tabs/左侧导航式信息架构。

## Technical Notes

Inspected:

* `apps/admin/src/shell/preferences/GlobalPreferences.vue`
* `packages/cli/src/templates.ts`
* `packages/ui/src/components/AdminScrollArea.vue`
* `apps/admin/src/styles/main.css`
* `apps/admin/src/shell/preferences/global-preferences-shell.test.ts`
* `packages/cli/src/generate-starter.test.mjs`
* `scripts/validate-generated-starter.mjs`
* `.trellis/tasks/archive/2026-06/06-14-control-center-layout-density/prd.md`

Relevant specs:

* `.trellis/spec/frontend/app-shell.md`
* `.trellis/spec/frontend/i18n.md`
* `.trellis/spec/frontend/quality.md`
* `.trellis/spec/shared/cli-starter-contract.md`
* `.trellis/spec/shared/public-delivery.md`

## Verification

Commands:

* `pnpm typecheck`
* `pnpm lint`
* `pnpm test`
* `pnpm build`
* `pnpm validate:starter`
* `/tmp/super-admin-two-theme-no-i18n`: `pnpm typecheck && pnpm build`

Browser checks:

* `apps/admin` at constrained viewport: dialog height `736`, scroll area `clientHeight=736`, `scrollHeight=845`, scrolled to `atBottom=true`, bottom `AI 提供方` visible.
* `apps/admin` layout switch: clicked `top-header`; Control Center stayed open, scroll area remained available, active class included `border-[var(--border-strong)] shadow-[var(--glow)]`.
* Generated `/tmp/super-admin-two-theme-no-i18n` on clean port `5184`: default profile `Base / 浅色`; no locale section; dialog height `724.96` vs viewport cap `828`; `canScroll=false`; content grid bottom gap to scroll area bottom `0`.
