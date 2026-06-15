# Implementation Plan

## Component Map

- `AppShell.vue`
  - Owns global composition: active layout, fixed Control Center trigger, AI panel, desktop Stage Rail, fullscreen Stage Overview, and transition ghost.
  - Wraps the active layout in a two-column shell frame when the desktop Stage Rail is enabled.

- `StageRail.vue`
  - New left-side desktop-only rail.
  - Composes grouped Stage thumbnails and group-window drill-down as a window-only surface.
  - Emits route/window actions through explicit handlers; no router/store logic inside thumbnail components.

- `StageOverview.vue`
  - Replaces the all-windows portion of the current teleported `StageManagerOverlay.vue`.
  - Keeps full-screen overview as a temporary overlay opened by shortcut/runtime command.

- `StageDockThumb.vue`
  - Remains a flat clickable hit target with a non-interactive 3D visual surface.
  - Emits source geometry for ghost transitions while keeping the left rail thumbnail tilt.

- `StageOverviewCard.vue`
  - Emits source geometry for ghost transitions.
  - Keeps reveal actions and preview behavior.

- `StageTransitionGhost.vue`
  - New runtime-only visual bridge from clicked thumbnail/card geometry to the workspace route area.
  - Reads Pinia runtime state and uses CSS transform/opacity/position transitions, with reduced-motion fallback.

- `preferences.store.ts`
  - Replaces `stageManagerOpen/presentationMode` with separate runtime and persisted concepts:
    - persisted `stageManager.railEnabled`
    - runtime `stageOverviewOpen`
    - runtime `stageManagerDesktopAvailable`
    - runtime `stageTransitionGhost`

## Steps

- [x] RED: update tests to describe the new Stage Manager semantics before production edits.
- [x] Update core preferences types/defaults/merge compatibility for `stageManager.railEnabled`.
- [x] Update app Pinia preferences store for desktop availability, rail toggle, overview runtime state, and ghost transition runtime state.
- [x] Add desktop availability binding (`min-width: 1280px`) and make shortcuts open fullscreen Overview only when available.
- [x] Split `StageManagerOverlay.vue` into fullscreen `StageOverview.vue` and left-side `StageRail.vue`.
- [x] Add source-rect emits to `StageDockThumb.vue` and `StageOverviewCard.vue`.
- [x] Add shared window activation behavior and `StageTransitionGhost.vue`.
- [x] Wrap app layouts in AppShell frame so Stage Rail compresses the whole project page on desktop.
- [x] Update Control Center copy and controls: Workspace Tabs, desktop Stage Rail, fullscreen Overview shortcut/status; remove presentation mode selector.
- [x] Update i18n locale copy.
- [x] Update generated starter templates and starter tests for parity.
- [x] Update `.trellis/spec/frontend/app-shell.md` and shared CLI starter contract to document the new contract.
- [x] Run targeted tests, then full validation: typecheck, lint, test, build, validate starter.
- [x] Browser QA desktop: tri-column, dual-column, top-header, Stage Rail, Overview shortcut, ghost transition, theme/mode switching.

## Notes

- Do not introduce `motion-v` in this task.
- Do not reintroduce density controls.
- Do not add backend/auth/AI provider dependencies.
- Stage Manager surfaces are desktop-only at `1280px+`; non-desktop keeps ordinary Workspace Tabs.
- Latest UX correction: Stage Rail is on the left, contains only window previews, visible window titles, and minimal stack/back affordances. It does not render a rail header, status text, module description, or persistent window actions.
