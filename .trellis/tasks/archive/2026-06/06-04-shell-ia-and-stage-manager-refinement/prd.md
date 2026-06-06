# Shell IA And Stage Manager Refinement

## Goal

Refine the authenticated shell information architecture so account actions, project/workspace settings, shortcuts, and Stage Manager each live in the right place. Expand Stage Manager from a flat tab list into a macOS-inspired grouped workspace overview that can stack multiple tabs from the same module and reveal them on demand.

## What I already know

- `ShellAccountMenu` is the avatar-triggered user menu.
- The current account menu contains Control Center/settings, shortcuts/Stage Manager, and sign out.
- The current "Settings / Control Center" entry mixes personal account settings with project/workspace settings.
- The current shortcuts entry immediately opens Stage Manager and shows only `Stage Manager - Cmd/Ctrl+Shift+M`, which makes shortcuts feel locked to one feature instead of being a discoverable/editable surface.
- `GlobalPreferences` is currently mounted once from `AppShell` with `trigger="none"`.
- Current specs say Stage Manager should open from account menu and keyboard shortcut, but this should change for the new IA.
- `StageManagerOverlay` currently renders a flat list of `tabs.state.tabs`.
- `WorkspaceTab` currently has route/title/path/pin/keepAlive/refresh metadata, but no explicit module grouping metadata.
- A route can be mapped back to its module with `findActiveModule(registeredModules, tab.routePath)`.
- Apple Stage Manager keeps current work centered, recently used apps/windows on the side, supports grouping, and has all-windows vs one-window behavior for windows from one app.

## Research References

- [`research/macos-stage-manager.md`](research/macos-stage-manager.md) — Map macOS Stage Manager grouping concepts to Super Admin module/tab groups.

## Assumptions

- Account menu should become personal/user-scoped only.
- Control Center should become a stable global project/workspace settings entry outside the avatar menu.
- Shortcuts should open a shortcuts panel/drawer/modal instead of directly opening Stage Manager.
- Shortcut editing is out of MVP; viewing grouped shortcuts is the first step.
- Stage Manager grouping should be automatic by module, not manually draggable in MVP.
- Multiple tabs from the same module, such as Users All/Pending/Invites/Activity, should appear as one stacked group with secondary expansion.

## Open Questions

- [x] Where should the global Control Center trigger live across all shell layouts? Use a fixed right-side vertically centered floating gear button.

## Requirements (Evolving)

- Remove project/workspace Control Center from the avatar account menu.
- Replace account-menu "Settings" with a personal account/profile settings entry or placeholder surface.
- Replace account-menu "Shortcuts" behavior with a shortcuts viewer entry.
- The shortcuts surface should be read-only in MVP.
- The shortcuts surface should list Stage Manager as `Cmd/Ctrl + Shift + M`.
- The shortcuts surface should reserve rows for Control Center, AI Assistant, and search/command palette as unbound future shortcuts.
- Add a stable Control Center trigger outside the account menu as a fixed right-side vertically centered floating gear button.
- Keep Control Center mounted above layout presets so live layout/profile changes do not close it.
- Keep Stage Manager openable through `Cmd/Ctrl+Shift+M`.
- Stage Manager should group workspace tabs by module.
- Module groups should show a stacked thumbnail when they contain multiple tabs.
- Clicking a collapsed module group should activate the group's most recently active tab.
- A module group with multiple tabs should support secondary expansion to reveal individual tab previews/actions.
- Preserve existing tab pin, refresh, close, and activate semantics.
- Keep workspace tabs and Stage Manager additive; do not make one replace the other.

## Acceptance Criteria (Evolving)

- [x] Avatar menu contains user-scoped actions and sign out, not project/workspace Control Center.
- [x] Control Center has a fixed right-side vertically centered floating gear trigger outside the avatar menu in every layout.
- [x] Shortcut entry opens a shortcuts surface that lists Stage Manager shortcut and leaves room for future shortcuts.
- [x] Shortcut surface is read-only and does not offer custom shortcut editing.
- [x] Stage Manager groups Users tabs into a single Users group when multiple Users routes are open.
- [x] Expanding a Users group reveals its individual tabs.
- [x] Activating a group chooses the most recently active tab in that module.
- [x] Pin/refresh/close behavior continues to operate on individual tabs.
- [x] Tests cover menu IA, Control Center placement, shortcut surface wiring, and Stage Manager grouping.
- [x] Browser QA covers tri-column, dual-column, and top-header layouts.

## Definition of Done

- [x] Tests added/updated for shell account menu IA and Stage Manager grouping.
- [x] Relevant `.trellis/spec/frontend/app-shell.md` contracts updated to match the new IA.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm docs:build` pass.
- [x] Browser spot-check verifies Control Center access, shortcuts surface, and grouped Stage Manager behavior.

## Completion Notes

- Stage Manager now separates orchestration, pure grouping/layout logic, dock thumbnails, overview cards, previews, and shared window actions.
- Side-dock mode keeps a fixed four-window/group visual cap and no longer exposes a scroll-overflow preference.
- All-windows mode remains ungrouped, centered, non-scrolling, and uses the same hover/focus reveal action behavior as side-dock cards.
- Legacy persisted `stageManager.scrollOverflow` data is filtered during preference merge and is not written back.
- Verification completed with targeted Stage Manager tests, full workspace tests, lint, typecheck, build, docs build, and browser QA.

## Out of Scope

- Real backend-backed personal profile editing.
- Fully customizable shortcut bindings with conflict detection.
- Drag-to-group or drag-to-ungroup Stage Manager behavior.
- Persisting manual Stage Manager groups.
- Replacing traditional workspace tabs.

## Technical Notes

- Likely files:
  - `apps/admin/src/shell/ShellAccountMenu.vue`
  - `apps/admin/src/shell/AppShell.vue`
  - `apps/admin/src/shell/preferences/GlobalPreferences.vue`
  - `apps/admin/src/workspace/StageManagerOverlay.vue`
  - `apps/admin/src/stores/workspace-tabs.store.ts`
  - `packages/core/src/workspace-tabs.ts`
  - `apps/admin/src/i18n/locales/zh-CN.ts`
  - `apps/admin/src/i18n/locales/en-US.ts`
  - `.trellis/spec/frontend/app-shell.md`
