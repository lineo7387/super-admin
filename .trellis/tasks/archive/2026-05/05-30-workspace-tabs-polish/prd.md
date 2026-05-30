# brainstorm: workspace tabs polish

## Goal

Polish the Super Admin workspace tab system so it behaves like a reliable admin shell primitive before deeper module examples are built. This task should complete the remaining tab lifecycle work from the foundation milestone: refresh, pin/unpin, pinned restore behavior, and keep-alive cache control that stays consistent with the Stage Manager overlay.

## What I already know

- The previous foundation task intentionally deferred workspace tab refresh and pin controls.
- The accepted product direction keeps traditional Workspace Tabs and Stage Manager as independent additive shell tools.
- `workspaceTabs.enabled` defaults to `true`.
- `stageManager.enabled` defaults to `true`.
- Current workspace state lives in `apps/admin/src/workspace/workspace-tabs.store.ts`.
- Current tab UI lives in `apps/admin/src/workspace/WorkspaceTabs.vue`.
- Current route cache wrapper lives in `apps/admin/src/workspace/WorkspaceRouterView.vue`.
- Current Stage Manager overlay reads the same workspace tab store from `apps/admin/src/workspace/StageManagerOverlay.vue`.
- `packages/core/src/workspace-tabs.ts` already defines `WorkspaceTab`, `WorkspaceTabsState`, `createWorkspaceTab`, `activateWorkspaceTab`, and `closeWorkspaceTab`.
- `WorkspaceTabs.vue` imports `Pin` and displays a pin icon if a tab is pinned, but does not expose a pin/unpin control.
- `workspace-tabs.store.ts` already has a `pinTab(tabId)` action, but persistence/restore and visual controls are not finished.
- `closeWorkspaceTab` currently filters with `tab.id !== tabId || tab.pinned`, meaning pinned tabs are not closed by the normal close path.
- `WorkspaceRouterView.vue` uses Vue `<KeepAlive :max="8">` for routes with `route.meta.keepAlive?.enabled`.
- The code-spec says refresh/close behavior should be able to drop cached state.
- The code-spec says theme/layout switching must not flush all tab caches.
- The user asked whether table/form components are missing; we agreed those belong in a later `admin-ui-primitives` task, after workspace lifecycle is stable.

## Assumptions (temporary)

- This task should not implement table/form primitives.
- This task should not deepen Dashboard/Workbench/Users/Access module content.
- Refresh should reset the active tab's kept-alive component instance without losing the tab itself.
- Closing an unpinned active tab should activate a deterministic neighboring tab.
- Pinned tabs should be restorable across reload when `workspaceTabs.restorePinnedTabs` is enabled.
- Pinning a tab should move it to the left pinned group; newly pinned tabs should appear first.
- Stage Manager should expose the same close/pin state or at least remain consistent after tab pin/close/refresh actions.
- Refresh is a current-workspace action, not a per-tab action. It belongs next to the workspace breadcrumb to avoid making every tab feel like a toolbar.

## Open Questions

- None blocking.

## Decisions

- Pinned tabs are protected from the normal close action. The tab bar should disable or hide the close affordance for pinned tabs, and users must unpin before closing. This makes pinning mean "keep this workspace open" instead of only "show a pin icon."
- Pinned tabs form a left-aligned group. Clicking pin moves that tab to the first position; clicking unpin moves it after any remaining pinned tabs.
- The compact tab bar should avoid three-button tabs. Tabs primarily navigate and close; current-workspace actions such as refresh and pin/unpin live in the workspace header beside the breadcrumb.

## Requirements (evolving)

- Add a visible refresh control for the active workspace in the workspace header.
- Refreshing a keep-alive route must drop that route's cached component instance and recreate it.
- Refreshing should not close the tab or remove it from the open route list.
- Add visible pin/unpin controls for the active workspace in the workspace header.
- Keep the tab bar compact: pinned tabs show pinned state, unpinned tabs show a close affordance, and refresh is not repeated per tab.
- Move newly pinned tabs to the first tab position and keep unpinned tabs after the pinned group.
- Persist pinned tabs safely and restore them on reload when `workspaceTabs.restorePinnedTabs` is true.
- Respect existing `workspaceTabs.closeStrategy`.
- Keep route list, active tab, and keep-alive behavior stable across theme/profile/layout changes.
- Keep Stage Manager and Workspace Tabs reading the same tab model.
- Avoid reintroducing `workspacePresentation` or any mutually exclusive tabs-vs-stage model.
- Keep page components independent from workspace tab internals.

## Acceptance Criteria (evolving)

- [ ] A user can pin and unpin the active workspace from the workspace header.
- [ ] Clicking pin moves the tab to the first position; clicking unpin moves it after remaining pinned tabs.
- [ ] Pinned tabs survive page reload when restore is enabled.
- [ ] A user can refresh the active workspace from the workspace header and see route-local kept-alive state reset.
- [ ] Refreshing one tab does not flush unrelated kept-alive route state.
- [ ] Closing the active unpinned tab activates the expected next tab based on `closeStrategy`.
- [ ] Pinned tabs cannot be closed by the normal close action; users must unpin first.
- [ ] Stage Manager remains consistent with tab close/pin/refresh state.
- [ ] Toggling Workspace Tabs or Stage Manager in Control Center does not lose open tabs or kept-alive state.
- [ ] Switching Crypto/Industrial/Cyberpunk and light/dark modes does not reset open tabs unnecessarily.
- [ ] Switching `tri-column`, `dual-column`, and `top-header` does not reset open tabs unnecessarily.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass.
- [ ] Browser verification covers tab pin/unpin, refresh, close, reload restore, and Stage Manager consistency.

## Definition of Done (team quality bar)

- Tests added/updated where appropriate.
- Lint / typecheck / CI green.
- Docs/notes updated if behavior changes.
- Rollout/rollback considered if risky.

## Out of Scope (explicit)

- Admin table primitives.
- Admin form primitives.
- Dashboard/Workbench/Users/Access module service/query expansion.
- User-facing README documentation.
- Full visual regression infrastructure.

## Technical Notes

- Relevant code:
  - `packages/core/src/workspace-tabs.ts`
  - `packages/core/src/preferences.ts`
  - `apps/admin/src/workspace/workspace-tabs.store.ts`
  - `apps/admin/src/workspace/WorkspaceTabs.vue`
  - `apps/admin/src/workspace/WorkspaceRouterView.vue`
  - `apps/admin/src/workspace/StageManagerOverlay.vue`
  - `apps/admin/src/shell/preferences/GlobalPreferences.vue`
- Relevant specs:
  - `.trellis/spec/frontend/app-shell.md`
  - `.trellis/spec/frontend/state-management.md`
  - `.trellis/spec/big-question/keepalive-tab-cache.md`
  - `.trellis/spec/big-question/theme-switching-state-loss.md`
- The first implementation plan should preserve the app-shell model from the archived foundation task and focus on workspace lifecycle only.
