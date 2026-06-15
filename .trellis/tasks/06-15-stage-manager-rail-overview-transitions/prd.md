# brainstorm: Stage Manager rail and overview transitions

## Goal

Rework Stage Manager into a clearer signature experience by separating the persistent side Stage Rail from the fullscreen all-windows overview. The first implementation phase should fix the interaction architecture and transition continuity without introducing Motion yet; a later phase can add `motion-v` for richer shared-element and layout animations.

## What I already know

* The user chose option C: split the Stage Manager architecture first, then introduce Motion in a later task.
* Updated user direction: the Stage Rail should follow macOS Stage Manager more closely by living on the left side.
* The side Stage Rail should be enabled/opened from Control Center, compress the workspace, and show window thumbnails only.
* `Cmd/Ctrl + Shift + M` should default to opening the fullscreen Overview, not toggling the side Stage Rail.
* A future phase may support a configurable shortcut for the side Stage Rail.
* Phase 1 should include a geometry-aware ghost transition when activating a window from either Stage Rail or fullscreen Overview.
* Stage Manager as a whole is desktop-only. Neither side Stage Rail nor fullscreen Overview needs to support non-desktop devices.
* Non-desktop devices should rely on the existing ordinary Workspace Tabs behavior.
* Desktop-qualified Stage Manager availability starts at `1280px` viewport width.
* Future upgrades or expanded responsive behavior are out of scope for this first architecture pass and can be discussed in later tasks.
* UI quality is a first-order product requirement. Do not simplify the experience merely because the interaction model is complex; complexity should be managed through architecture and phased implementation, not by flattening the design ambition.
* Fullscreen overview should remain available as a global all-windows mode.
* The current side-dock behavior should stop being a floating overlay over the page.
* The new side Stage Rail should push/compress the admin workspace layout when opened.
* Transition continuity is a product requirement: clicking a window in fullscreen overview or side Stage Rail should feel like the window expands or transitions into the active page, not like a disconnected route jump.
* Current implementation uses `StageManagerOverlay.vue` as a teleported overlay for both `side-dock` and `all-windows`.
* Current spec describes `side-dock` as an overlay mounted on the left mask, so this task will require a spec update if implemented.

## Assumptions (temporary)

* Stage Rail is a real left-side shell/workspace layout region, not a modal dialog.
* Fullscreen overview remains a modal/overlay surface with backdrop behavior.
* Existing tab grouping, window-level drill-down, pin, refresh, close, and activate behavior should remain conceptually intact.
* Phase 1 may use Vue/CSS transitions only, but should structure DOM/state so a later `motion-v` shared-layout animation can be added without another rewrite.
* Generated starter should stay in parity with the monorepo app where Stage Manager is included, without requiring backend/auth/AI provider dependencies.
* `density` selector must not be reintroduced.

## Open Questions

* None for the first implementation pass.

## Requirements (evolving)

* Split Stage Manager product semantics into:
  * Stage Rail: persistent, layout-affecting, grouped left-side window thumbnail switcher.
  * Fullscreen Overview: temporary all-windows overlay.
* Stage Rail and fullscreen Overview are separate controls, not a `side-dock | all-windows` presentation-mode toggle:
  * Control Center enables/opens the left-side Stage Rail.
  * `Cmd/Ctrl + Shift + M` opens fullscreen Overview by default.
  * A future shortcut customization surface may bind a separate Stage Rail shortcut.
* Stage Manager is desktop-only:
  * render left-side Stage Rail only at `1280px` and wider
  * allow fullscreen Overview only at `1280px` and wider
  * do not provide compact/mobile Stage Rail or mobile Overview variants in this task
  * on non-desktop viewports, ordinary Workspace Tabs remain the window/task switching experience
  * Control Center should not imply that Stage Manager can be used on non-desktop viewports
  * Stage Manager shortcuts should no-op or avoid opening Stage Manager when the viewport is not desktop-qualified
* Treat Stage Rail as a polished signature UI surface, not a reduced side list:
  * keep visual grouping, window preview, stacked-group affordance, and current/hover states expressive
  * keep the rail itself window-only: window preview plus window title, without a rail header, status label, module description, or persistent action controls
  * preserve profile-specific material language via tokens such as glow, shadow, border, texture, and surface depth
  * make the rail feel physically connected to the workspace it compresses
* Preserve grouped workspace behavior:
  * group tabs by active module
  * stacked groups remain selectable
  * clicking current group can cycle to another recent window
  * secondary affordance enters window-level view for that group
  * pin, refresh, close, and activate actions still target individual tabs
* Preserve route and keep-alive state when toggling Stage Rail, opening overview, switching layout, or changing themes.
* Avoid turning Stage Rail and Workspace Tabs into mutually exclusive modes unless the user explicitly chooses that product direction.
* Preserve frontend-first starter boundaries:
  * no backend requirement
  * no auth provider requirement
  * no AI provider requirement
  * no maintainer-only workflow files in generated output
* Do not reintroduce a global density selector.

## Transition Direction

The desired transition model is a shared-window illusion:

* The clicked Stage Rail thumbnail or fullscreen overview card is the visual source.
* The active workspace route/page is the visual destination.
* The transition should bridge source and destination with continuous scale, position, opacity, and/or masking so the user feels the selected window becomes the page.
* Phase 1 must include a geometry-aware ghost transition:
  * capture the clicked Stage Rail thumbnail or fullscreen Overview card `DOMRect`
  * keep a temporary ghost visual alive while route activation begins
  * animate the ghost from the source rect toward the workspace route-view destination
  * fade/remove the ghost after the destination page is visible
  * respect reduced-motion preferences with a shorter fade-only fallback
* Phase 2 can introduce `motion-v` for layout animations, `AnimatePresence`, reduced-motion handling, and source-to-destination choreography.

## Acceptance Criteria (evolving)

* [x] Stage Rail is no longer a floating overlay; it is a left-side layout rail.
* [x] Fullscreen overview still opens as an all-windows overlay.
* [x] Clicking a window from either Stage Rail or fullscreen overview activates the corresponding route without a visually disconnected jump.
* [x] Window activation from either surface uses a source-to-workspace ghost transition or a reduced-motion fallback.
* [x] Toggling Stage Rail compresses the app workspace instead of covering it.
* [x] Stage Manager surfaces appear only on desktop-qualified viewports; non-desktop viewports rely on ordinary Workspace Tabs.
* [x] Existing Stage Manager grouping and window activation still work; window actions remain available in fullscreen Overview.
* [x] Control Center exposes the separated concepts clearly.
* [x] Generated starter and monorepo app remain consistent where the generated starter includes Stage Manager.
* [x] `density` remains compatibility state only and is not visible in Control Center.
* [x] No backend/auth/AI provider dependency is added.

## Definition of Done (team quality bar)

* Tests added/updated for state and shell placement behavior.
* Browser verification covers fullscreen overview, Stage Rail, route activation, layout switching, theme switching, and narrow viewport behavior.
* `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and relevant starter validation pass.
* Specs updated if Stage Manager semantics change.
* Rollout/rollback considered if the new layout model is risky.

## Out of Scope (explicit)

* Adding `motion-v` in the first architecture-splitting task, unless the user later decides to combine phases.
* Expanding Stage Manager support below `1280px`.
* Adding backend, auth provider, AI provider, database, or generated schema dependencies.
* Reintroducing global density controls.
* Implementing custom drag grouping/ungrouping.
* Publishing npm packages, changing dist-tags, or pushing.

## Technical Notes

* Relevant implementation files already inspected:
  * `apps/admin/src/workspace/StageManagerOverlay.vue`
  * `apps/admin/src/workspace/StageDockPanel.vue`
  * `apps/admin/src/workspace/StageOverviewCard.vue`
  * `apps/admin/src/workspace/stage-manager.ts`
  * `apps/admin/src/shell/AppShell.vue`
  * `apps/admin/src/stores/preferences.store.ts`
  * `packages/cli/src/templates.ts`
* Relevant specs already inspected:
  * `.trellis/spec/frontend/app-shell.md`
  * `.trellis/spec/frontend/state-management.md`
  * `.trellis/spec/frontend/css-design.md`
  * `.trellis/spec/shared/cli-starter-contract.md`
* `motion-v` is the official Motion Vue package documented by Motion.dev; it should be researched and introduced in a later task if Phase 2 proceeds.
