# Workspace Tabs Polish Implementation Plan

## Goal

Finish the workspace tab lifecycle foundation before building deeper admin modules: pin/unpin, protected pinned close behavior, refresh-driven cache reset, pinned restore, and Stage Manager consistency.

## Tasks

- [x] 1. Capture PRD and pin-close decision.
  - Pinned tabs are protected from normal close.
  - Users must unpin before closing a pinned workspace.

- [x] 2. Add core workspace tab tests.
  - Pinned tabs are protected from close.
  - Pin state toggles explicitly.
  - Pinned tabs move into the left pinned group.
  - Refresh increments a tab refresh key.
  - Close strategy chooses the next active tab predictably.
  - Activation stays separate from refresh state.

- [x] 3. Implement core workspace tab model updates.
  - Add `WorkspaceTab.refreshKey`.
  - Add `WorkspaceTabCloseStrategy`.
  - Add `toggleWorkspaceTabPin`.
  - Reorder tabs when pinning or unpinning so pinned workspaces stay left-aligned.
  - Add `refreshWorkspaceTab`.
  - Update `closeWorkspaceTab` to respect pinned tabs and close strategy.

- [x] 4. Wire app workspace state.
  - Persist pinned tabs under safe local UI storage.
  - Restore pinned tabs when `workspaceTabs.restorePinnedTabs` is enabled.
  - Use the configured `workspaceTabs.closeStrategy`.

- [x] 5. Wire workspace UI.
  - Add workspace header breadcrumb with active-workspace pin/unpin and refresh controls.
  - Keep the tab bar compact: pinned state plus close for unpinned tabs.
  - Hide normal close for pinned tabs.
  - Add Stage Manager pin/refresh controls and hide normal close for pinned stages.

- [x] 6. Wire refresh into route view keys.
  - Keep route keys stable across theme/layout changes.
  - Change only the target route key when refresh is requested.

- [x] 7. Verify quality and browser behavior.
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
  - Browser checks for pin/unpin, protected close, refresh, reload restore, and Stage Manager consistency.

- [x] 8. Finish Trellis quality flow.
  - Run `trellis-check`.
  - Update specs if a durable convention was learned.
  - Present commit plan before committing.
