# App Shell Window Preview Transitions

## Goal

Optimize the admin Stage Manager thumbnails so each preview reads as a complete app shell thumbnail, including shell chrome/sidebar/header/tabs/workspace frame and the current page body. Keep the Stage Manager activation animation on the previous lightweight source-to-workspace motion because the dual simultaneous ghost felt too janky in practice.

## Latest User Decision

* Window previews must be true whole-shell thumbnails, not just the route/page component thumbnail.
* The page body inside the thumbnail should remain the real resolved route component so the preview reflects actual page content.
* The thumbnail must add the missing shell context around that real page body: app chrome, side rail/sidebar or top header, workspace tabs, workspace header/frame, and current layout preset.
* Do not use iframe, canvas, screenshot renderer, backend capture, or browser capture.
* Revert the dual simultaneous incoming/outgoing transition. Use the earlier lightweight single incoming ghost from Stage Rail/Overview source to the workspace target.

## Requirements

* Stage Rail thumbnails and fullscreen Overview cards render a scaled mini app shell around the real route component.
* The mini shell expresses the active `layoutPreset`: `tri-column`, `dual-column`, or `top-header`.
* The preview includes shell chrome, sidebar/header structure, workspace tabs/frame, module/title metadata, and the current page body.
* The preview implementation remains frontend-only and mock-backed, with no iframe/canvas/screenshot renderer/backend/database/auth/AI/generated-schema requirement.
* Stage Rail and fullscreen Overview activations keep the previous source-to-workspace transition.
* The transition ghost remains runtime-only, lightweight, and not a full shell/component mount.
* Reduced-motion users keep the existing short, low-motion opacity/scale fallback.
* Existing workspace tabs, route activation, pin/refresh/close actions, and `KeepAlive` cache keys remain intact.
* Theme/profile/color-mode/layout switching must continue to work while previews use existing shell/design tokens.
* Generated starter output must remain aligned with `apps/admin` because the CLI copies the app source model.

## Acceptance Criteria

* [x] `StageWindowPreview` accepts both the resolved route `component` and a `StageWindowPreviewModel`.
* [x] `StageWindowPreview` renders a mini app shell frame with chrome/sidebar-or-header/tabs/workspace around the real route component.
* [x] Stage Rail group thumbnails, Stage Rail window thumbnails, and fullscreen Overview cards pass both `component` and `preview`.
* [x] The thumbnail visibly changes structure across `tri-column`, `dual-column`, and `top-header`.
* [x] Activation uses the previous single source-to-workspace ghost path and does not render outgoing/dual-plane transition previews.
* [x] The transition bridge keeps bounded target measurement and does not use duration-tied `setTimeout` cleanup.
* [x] `prefers-reduced-motion` reduces distance/intensity while preserving route activation.
* [x] Workspace tabs and kept-alive route state survive theme/profile/layout switching and Stage Manager activation.
* [x] `pnpm lint`, `pnpm typecheck`, and relevant workspace tests pass.
* [x] Browser visual QA confirms the thumbnail includes the app shell/sidebar and real page body, and switching motion is back to the smoother previous behavior.

## Definition of Done

* Existing shell/workspace implementation and relevant Trellis specs are inspected before code edits.
* This PRD is updated with final decisions.
* `.trellis/tasks/06-19-app-shell-window-preview-transitions/plan.md` contains an executable implementation plan.
* Tests are added/updated before production code changes where practical.
* Lint, typecheck, relevant tests, and browser visual QA are completed or any blocker is explicitly reported.

## Technical Approach

* Keep `StageWindowPreviewModel` in the Stage Manager layer for serializable shell metadata: `layoutPreset`, route title/path, module label, description, shell regions, and visible tab titles.
* Keep route component resolution in `useStageWindows` so preview bodies are the same resolved components previously shown in route-only thumbnails.
* Change `StageWindowView` and `StageGroupView` to carry both `component` and `preview`.
* Refactor `StageWindowPreview.vue` into a hybrid renderer: CSS mini shell + real route component mounted inside the workspace body.
* Revert `useStageWindowActivation`, `preferences.store`, and `StageTransitionGhost.vue` to the previous single incoming ghost API: `startStageTransition(sourceRect, title)` -> route switch -> target measurement -> finish/clear.
* Remove outgoing measurement markers such as `data-stage-window-route`.
* Update source-string tests around Stage Manager components/surfaces and generated-starter parity expectations.

## Decision (ADR-lite)

**Context**: A pure semantic skeleton preview expressed shell layout well but was not the requested "real thumbnail". The dual incoming/outgoing transition also felt too janky.

**Decision**: Use a hybrid whole-shell thumbnail. The shell frame is semantic CSS, while the page body is the real resolved route component. Keep the animation lightweight and revert to the previous single source-to-workspace ghost.

**Consequences**: Thumbnails now communicate the complete app shell and preserve real page content without iframe/canvas/screenshot dependencies. The route component is still mounted in previews as before, so this keeps the existing frontend-first behavior and avoids the heavier dual ghost path.

## Out of Scope

* Pixel-perfect macOS Stage Manager cloning.
* Dual simultaneous incoming/outgoing window transition.
* Drag grouping, drag ungrouping, custom shortcut bindings, or a new presentation-mode toggle.
* Full shell/layout rewrite.
* Real screenshot rendering through iframe, canvas, browser capture, or a service.
* Backend/API/auth/AI-provider/database/generated-schema work.
* Dependabot, docs landing, release, or public presentation changes unrelated to generated starter parity.

## Technical Notes

* Files inspected:
  * `apps/admin/src/shell/AppShell.vue`
  * `apps/admin/src/workspace/StageRail.vue`
  * `apps/admin/src/workspace/StageOverview.vue`
  * `apps/admin/src/workspace/StageOverviewCard.vue`
  * `apps/admin/src/workspace/StageDockThumb.vue`
  * `apps/admin/src/workspace/StageWindowPreview.vue`
  * `apps/admin/src/workspace/StageTransitionGhost.vue`
  * `apps/admin/src/workspace/useStageWindows.ts`
  * `apps/admin/src/workspace/useStageWindowActivation.ts`
  * `apps/admin/src/workspace/stage-manager.ts`
  * `apps/admin/src/stores/preferences.store.ts`
  * `apps/admin/src/workspace/WorkspaceRouterView.vue`
  * `apps/admin/src/workspace/WorkspaceTabs.vue`
  * `apps/admin/src/workspace/WorkspaceHeader.vue`
  * `apps/admin/src/shell/layouts/TriColumnLayout.vue`
  * `apps/admin/src/shell/layouts/DualColumnLayout.vue`
  * `apps/admin/src/shell/layouts/TopHeaderLayout.vue`
  * `apps/admin/src/workspace/StageManagerComponents.test.ts`
  * `apps/admin/src/workspace/StageManagerSurfaces.test.ts`
  * `packages/cli/src/generate-starter.test.mjs`
  * `packages/cli/src/generate-starter.ts`
* Relevant specs read:
  * `.trellis/spec/frontend/index.md`
  * `.trellis/spec/frontend/app-shell.md`
  * `.trellis/spec/frontend/components.md`
  * `.trellis/spec/frontend/state-management.md`
  * `.trellis/spec/frontend/css-design.md`
  * `.trellis/spec/frontend/type-safety.md`
  * `.trellis/spec/frontend/quality.md`
  * `.trellis/spec/shared/public-delivery.md`
  * `.trellis/spec/shared/cli-starter-contract.md`
  * `.trellis/spec/shared/typescript.md`
  * `.trellis/spec/shared/code-quality.md`
  * `.trellis/spec/guides/pre-implementation-checklist.md`
  * `.trellis/spec/guides/cross-layer-thinking-guide.md`
  * `.trellis/spec/guides/code-reuse-thinking-guide.md`
  * `.trellis/spec/guides/semantic-change-checklist.md`
  * `.trellis/spec/big-question/keepalive-tab-cache.md`
  * `.trellis/spec/big-question/theme-switching-state-loss.md`
