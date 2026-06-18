# Info

## Current decisions

- The side Stage Rail group close action is a semantic group action: it must close every unpinned window in that group, and the close control is disabled if the group contains pinned windows so the UI does not imply a complete close while leaving pinned members behind.
- The drill-in animation should make the secondary window thumbnails enter from a folded, left-down stacked origin, matching the Rail's card-level stack visual.
- Returning from the secondary window list should reverse through the same folded target before switching back to grouped Rail cards; this is held by `isCollapsingWindowGroup` and the Motion completion callback.
- Stage Rail uses one dock-level 3D plane (`perspective(860px) rotateY(34deg)`) instead of per-window matrix/angle profiles. This makes the whole side rail read as one continuous Stage Manager space: upper windows slope down to the right, middle windows pass through near-flat, and lower windows slope up to the right.
- Individual thumbnails only restore scale from `0.98` to `1` on hover/touch; they must not own rotation, perspective, or per-window matrix profiles.
- The app-shell Rail column is intentionally `12rem`, matching the base thumbnail width. The dock's internal padding centers the rotated 3D plane visually; do not restore the old wider `14rem` column just to create transform slack.
- Rail thumbnail actions sit inside the same scaled thumbnail plane as the preview surface, so the top-right controls stay aligned while the rail-level 3D plane provides the angle.
- The implementation should reuse the Stage window composable/action layer and keep Overview/Rail/Tabs behavior consistent.

## Risks

- The working tree already contains unrelated control-center edits. Avoid broad file rewrites and stage only this task's files if committing later.
- `packages/cli/src/generate-starter.test.mjs` and `packages/cli/src/templates.ts` are already dirty from control-center work, so any Stage parity edits must be minimal and isolated.

## Verification

- RED/GREEN targeted tests:
  - `pnpm --filter @super-admin/admin exec vitest run src/workspace/StageManagerSurfaces.test.ts src/workspace/StageManagerComponents.test.ts`
  - `pnpm --filter create-super-admin exec vitest run src/generate-starter.test.mjs --testNamePattern "generates the default single-theme starter"`
- Browser validation on local Vite app:
  - stacked Users Rail card close removed the whole Users group and routed back to `/examples/dashboard`
  - single-tab state kept Stage Rail shell hidden/inert with `data-stage-rail-open="false"`
  - stacked group drill-in mounted three Motion window items and settled them to normal positions
  - stacked group return kept the window items mounted during collapse, then restored the grouped card view
  - Rail dock used one `matrix3d(...)` transform derived from the dock-level `perspective(860px) rotateY(34deg)` plane while keeping the original card content/chrome
  - Rail hover kept the dock-level angle unchanged and only restored each thumbnail from `0.98 -> 1` scale
  - Rail top-right close action stayed inside the scaled thumbnail plane after hover reveal
  - narrow viewport hid Stage Rail and fullscreen Overview while ordinary Workspace Tabs remained
  - fullscreen Overview close action reduced cards from three to two without closing the overlay
- Full gate passed:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `pnpm validate:starter`

## Slimming follow-up audit

- Removed the one-line `resolveStageGroupWindow()` helper. Rail group activation now reads `group.activeTab` directly; the behavior is guarded by the Stage Manager grouping contract, Rail source tests, and browser activation validation.
- Removed the unused `StageWindowActions.visibility` API and the old `always` action mode. Rail and Overview both use the same shared action component with hover/focus/touch reveal behavior; visibility is guarded by source tests and browser Overview action checks.
- Removed unused right-side `StageDockThumb` orientation support. The product contract fixes Stage Rail to the left, and browser checks cover left rail layout compression at desktop and hidden behavior below `1280px`.
- Removed unused `StageWindowPreview.stacked` styling. Module group stacking lives at the card level in `StageDockThumb`; tests and browser checks confirm `cardStacks > 0` and `previewStacks = 0`.
- Removed the unreachable mobile Overview layout branch and resize listener. Stage Overview is desktop-only, and narrow viewport browser checks confirm the overlay does not open while Workspace Tabs remain available.
- Removed per-window Stage Rail matrix/profile wiring (`stageThumb3dProfiles`, `resolveStageThumbStyle`, and `--stage-thumb-projection`). The rail-level dock transform now owns the 3D perspective, which reduces code and matches the accepted visual direction.
- Reduced source tests that only pinned implementation details, such as exact Motion offsets, exact destructuring order, and helper tautologies. Remaining tests guard shell placement, shared action wiring, group close semantics, Motion-powered drill-in, and generated starter parity.

## Slimming verification evidence

- Targeted tests passed:
  - `pnpm --filter @super-admin/admin exec vitest run src/workspace/stage-manager.test.ts src/workspace/StageManagerComponents.test.ts src/workspace/StageManagerSurfaces.test.ts`
  - `pnpm --filter create-super-admin exec vitest run src/generate-starter.test.mjs --testNamePattern "generates the default single-theme starter"`
- Browser validation on monorepo app:
  - one workspace tab kept Rail hidden/inert while preserving the reserved shell region;
  - two workspace tabs opened the left layout Rail with a `12rem`/about `192px` rail column and a dock-level `matrix3d(...)` transform;
  - after the final centering adjustment, the transformed thumbnails measured about `26px` left gap and `32px` right gap inside the rail shell, instead of the earlier visibly uneven `16px` / `40px`;
  - Users module group rendered one card-level stack and group close removed all three Users windows at once;
  - group drill-in mounted three Motion items, and back returned to grouped cards after the collapse motion;
  - `Cmd/Ctrl + Shift + M` opened Overview, and refresh/close/pin actions were present and usable;
  - 1024px viewport hid Rail/Overview and preserved ordinary Workspace Tabs.
- Generated default starter browser smoke after `pnpm validate:starter`:
  - one tab hidden Rail, two tabs opened the left Rail, Users group used card-level stack with no preview stack, and narrow viewport hid Rail/Overview while tabs remained visible.
- Full gate passed:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `pnpm validate:starter`
