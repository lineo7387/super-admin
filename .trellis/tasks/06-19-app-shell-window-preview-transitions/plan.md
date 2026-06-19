# App Shell Window Preview Transitions Plan

## Scope

Implement complete Stage Manager app-shell thumbnails that include the sidebar/header/chrome/tabs/workspace frame and real route content. Revert the dual simultaneous transition to the earlier lightweight single source-to-workspace ghost.

## Component Map

* `StageWindowPreview.vue`: hybrid mini shell renderer. Props down only: route component, preview model, unavailable label, variant.
* `StageDockThumb.vue`: generic flat thumbnail hit target. No route measurement data attributes.
* `StageOverviewCard.vue`: overview card composition. Receives component + preview model and forwards activation rect/actions.
* `StageRail.vue`: Stage Rail composition. Uses grouped/window component + preview models.
* `StageOverview.vue`: fullscreen overview composition. Uses all window component + preview models.
* `useStageWindows.ts`: Stage Manager metadata composer. Resolves route components and builds preview models from tabs, manifests, route meta, translations, and current layout preference.
* `useStageWindowActivation.ts`: runtime bridge. Captures source, switches route, waits for workspace target, and finishes the single incoming transition.
* `preferences.store.ts`: runtime transition state only. Stores single ghost geometry and title.
* `StageTransitionGhost.vue`: renders the lightweight single source-to-workspace motion ghost with `motion-v`.

## Steps

1. [x] Update Trellis PRD after user correction.
   * Record that previews must be full-shell thumbnails with real route bodies.
   * Record that the animation should revert to the previous lightweight behavior.

2. [x] Add/update tests first.
   * Update `StageManagerComponents.test.ts` so `StageWindowPreview` requires both `component?: Component` and `preview?: StageWindowPreviewModel`, renders shell layout markers, and mounts the real route component inside the shell route area.
   * Update `StageManagerSurfaces.test.ts` for component + preview model plumbing, no route measurement attributes, and single ghost transition state.
   * Update `packages/cli/src/generate-starter.test.mjs` parity strings affected by the Stage Manager source changes.

3. [x] Implement preview model + component plumbing.
   * Keep `StageWindowPreviewModel` and related preview tab types in `stage-manager.ts`.
   * Add `component` back to `StageWindowView` and `StageGroupView`.
   * Build `createWindowPreview()` in `useStageWindows.ts` from tab, manifest route metadata, translated labels/descriptions, current `layoutPreset`, and visible tab titles.
   * Resolve route components through `findActiveModule()` / `findModuleRoute()` for the real preview body.

4. [x] Refactor full-shell real previews.
   * Rewrite `StageWindowPreview.vue` to draw shell chrome for `tri-column`, `dual-column`, and `top-header`.
   * Mount the real route component inside `.stage-window-preview__route`.
   * Keep stable thumb/overview dimensions and token-driven styling.

5. [x] Wire Stage Rail and Overview to component + preview models.
   * Pass `stage.preview` / `stageGroup.preview` into `StageWindowPreview`.
   * Pass `stage.component` / `stageGroup.component` into `StageWindowPreview`.
   * Keep existing shared `StageWindowActions`, grouped rail behavior, and secondary window-level rail behavior.

6. [x] Revert transition to the previous single ghost.
   * Restore `useStageWindowActivation.activateStage(path, title, sourceRect)`.
   * Restore `preferences.startStageTransition(sourceRect, title)`.
   * Restore `StageTransitionGhost.vue` to the lightweight abstract chrome ghost.
   * Remove outgoing measurement markers and dual-plane state.

7. [x] Verify behavior and quality.
   * Run relevant Stage Manager tests first, then CLI generated starter parity tests.
   * Run `pnpm lint` and `pnpm typecheck`.
   * Start the app and do browser visual QA for desktop Stage Rail, fullscreen Overview, reduced motion, `tri-column` / `dual-column` / `top-header`, and light/dark/profile switching.

## Risks And Mitigations

* Route preview components can be heavier than semantic skeletons.
  * Mitigation: only use them in the thumbnail body as the app already did before this task, and keep the transition ghost lightweight.
* Preview model could drift from route metadata.
  * Mitigation: derive from manifest route meta and existing translation helpers, not duplicated per-page constants.
* Layout/theme switching could remount route caches.
  * Mitigation: do not change `WorkspaceRouterView` keys or `KeepAlive` behavior.
* Generated starter parity could silently diverge.
  * Mitigation: keep changes in `apps/admin` source model and update CLI parity tests.

## Verification Commands

* `pnpm --filter @super-admin/admin test -- StageManagerComponents.test.ts StageManagerSurfaces.test.ts`
* `pnpm --filter create-super-admin test -- generate-starter.test.mjs`
* `pnpm lint`
* `pnpm typecheck`
