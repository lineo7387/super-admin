# PRD: Stage Manager group close and expand motion

## Problem

Stage Rail module groups currently expose the same hover controls as standalone windows, but the close action is bound to the active window inside the group. When the user clicks close on a module group entry, only one window closes instead of the whole group.

The module-group drill-in also switches abruptly from the folded stack entry to the secondary window list. The desired interaction is an animated unfold: the folded cards visually expand into the second-level window thumbnails.

## Requirements

- In the side Stage Rail, closing a module-group entry closes the whole module group, not just the active/previewed window.
- Group close behavior must be shared through the Stage window action/composable layer instead of one-off logic in the Rail template.
- If any window in the group is pinned, the group close affordance must not present an action that silently only closes part of the group.
- Clicking the module-group stack affordance to enter the second-level window view must animate the window entries from a folded/stacked state into the expanded list.
- The secondary-view animation should use the existing Motion stack where practical, respect reduced motion, and avoid the old ghost-transition pattern.
- Generated starter behavior must stay consistent with the monorepo app.

## Non-goals

- Do not change the Stage Rail side, breakpoint, or layout behavior from the previous task.
- Do not add persistent text, status labels, or always-visible actions to Rail module groups.
- Do not reintroduce density selector or backend/auth/AI-provider dependencies.

## Verification

- Unit/source tests prove Rail group close uses a group-level action.
- Unit/source tests prove secondary window entries mount with Motion-based unfold animation.
- Browser validation covers:
  - module-group close removes the whole group;
  - module-group drill-in animates from folded cards into expanded window entries;
  - narrow viewport keeps Rail/Overview hidden and tabs available.
- Full quality gate before completion:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `pnpm validate:starter`
