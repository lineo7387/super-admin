# Optimize Stage Manager motion transitions

## Goal

Upgrade the Stage Manager / 台前调度 experience from a hand-written CSS ghost into a Motion-powered shared-window transition, while fixing the Control Center overview entry, grouped Stage Rail activation, and stacked-group affordance. The feature must remain frontend-first, desktop-only, and consistent between `apps/admin` and generated starters.

## Requirements

* Use Motion for Vue for Stage Manager transition choreography. Current research confirms `motion-v` is the appropriate Vue package.
* Remove or replace the old complex CSS/JS ghost transition implementation. Do not keep dead transition state or fallback code that has no active reuse path.
* Clicking a fullscreen Overview card or left Stage Rail window must feel continuous: the window preview should animate from the clicked thumbnail/card toward the workspace page instead of behaving like a plain route jump.
* Control Center's Overview entry must be visibly usable. Opening Overview from Control Center should not leave it hidden behind the Control Center layer.
* Stage Rail module groups must activate the group's active window deterministically. Re-clicking an outer module group must not cycle to the next page unexpectedly.
* Module groups in Stage Rail need an explicit card-stack visual similar to macOS Stage Manager, while keeping the rail minimal: preview, title, and a small stack/back affordance only.
* Stage Rail remains on the left side, desktop-only at `1280px+`, and compresses the whole app layout instead of floating over it.
* Stage Rail should stay hidden while only one workspace route is open. Once a second workspace route appears, the left rail should animate into the layout instead of taking space from the first route.
* The Motion bridge should last around 300ms so the continuity is visible without feeling sluggish.
* Fullscreen Overview remains desktop-only and opens via `Cmd/Ctrl + Shift + M`.
* Non-desktop devices keep ordinary Workspace Tabs and do not need Stage Rail/Overview.
* Do not reintroduce the density selector.
* Do not introduce backend, auth provider, AI provider, database, generated schema, or maintainer-only tooling requirements.
* Keep generated starter output aligned with the monorepo app.

## Acceptance Criteria

* [ ] `motion-v` is added where needed for the monorepo app and generated starter dependencies.
* [ ] `StageTransitionGhost.vue` uses Motion semantics or is removed/replaced; old `left/top/width/height` CSS transition ghost code no longer exists.
* [ ] `useStageWindowActivation.ts` keeps activation flow small and reusable without hard-coded animation timers that duplicate Motion.
* [ ] Overview card activation and Stage Rail activation both drive a Motion-managed transition to the workspace target.
* [ ] Control Center -> Overview closes or layers correctly so the fullscreen Overview is visible and interactive.
* [ ] `resolveNextGroupWindow` / group activation no longer cycles when clicking the outer active group.
* [ ] Stage Rail stacked groups show a clear layered card stack and keep the rail free of descriptions, status text, and persistent actions.
* [ ] Stage Rail is hidden with a single workspace route and animates into the left layout once multiple routes exist.
* [ ] Motion transition timing is about 300ms.
* [ ] Tests cover Motion usage, removal of stale ghost semantics, Control Center overview behavior, group activation semantics, and generated starter dependency parity.
* [ ] Browser verification covers Control Center -> Overview, shortcut Overview, Overview click transition, Stage Rail click transition, grouped module behavior, stack visuals, and narrow viewport fallback.
* [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm validate:starter` pass.

## Definition of Done

* Code and tests are updated in the monorepo app and CLI-generated starter templates.
* Trellis research and implementation notes are stored under this task.
* No npm publish, dist-tag change, or push is performed.

## Technical Approach

Use `motion-v` directly in Vue SFCs. Preserve the existing activation pipeline only as an orchestration boundary: capture source rect, activate the target route, wait for the workspace target rect, then let a Motion component animate the transient bridge. Prefer Motion `motion.div` with explicit `initial` / `animate` values for the viewport-fixed bridge because the source and destination live across teleported overlays and route changes. Use `useReducedMotion` to provide a shorter opacity/scale fallback without hand-written transition timers.

For grouped Stage Rail activation, the outer group card should activate `group.activeTab`. Individual window switching belongs in the group drill-down view. This removes the hidden "cycle to next page" behavior from `resolveNextGroupWindow`.

For Control Center -> Overview, opening Overview should close Control Center before setting `stageOverviewOpen`, so the lower overview layer is not masked by the active Control Center modal.

## Decision (ADR-lite)

**Context**: The existing phase-1 ghost transition was intentionally temporary and uses manual DOM rect state plus CSS transitions. The current requirement asks for Motion, continuous shared-window behavior, and cleanup of obsolete logic.

**Decision**: Adopt `motion-v` and make Stage Manager's transient bridge a Motion component. Keep geometry capture for cross-route source/destination measurement, but move animation semantics into Motion and remove stale CSS transition rules/timer coupling. Add `motion-v` to both app and generated starter dependencies.

**Consequences**: The transition remains deterministic across teleported Overview, left rail, and workspace route changes. We avoid relying on browser View Transitions and keep the default scaffold frontend-only. Generated starter dependency size increases by one UI animation package.

## Out of Scope

* Supporting Stage Manager below `1280px`.
* Adding a side-rail shortcut customizer.
* Drag grouping/ungrouping or custom window layout editing.
* Backend/auth/AI provider integration.
* Publishing packages, changing npm dist-tags, or pushing.

## Technical Notes

* Relevant specs: `.trellis/spec/frontend/app-shell.md`, `.trellis/spec/frontend/state-management.md`, `.trellis/spec/shared/cli-starter-contract.md`.
* Prior task: `.trellis/tasks/archive/2026-06/06-15-stage-manager-rail-overview-transitions/`.
* Key code files: `apps/admin/src/workspace/StageRail.vue`, `StageOverview.vue`, `StageTransitionGhost.vue`, `useStageWindowActivation.ts`, `stage-manager.ts`, `apps/admin/src/shell/preferences/GlobalPreferences.vue`, `apps/admin/src/stores/preferences.store.ts`, `packages/cli/src/templates.ts`.
