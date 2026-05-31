# Showcase IA and UI Kit Navigation Implementation Plan

## Scope

Build the next navigation/IA layer for the Super Admin template:

- `Examples` and `UI Kit` become real first-level manifest/nav entries.
- Existing pages move under `Examples` by default:
  - Dashboard
  - Workbench
  - Users
  - Access
- `UI Kit` gets a lightweight but route-complete skeleton:
  - Foundations
  - Actions
  - Inputs
  - Forms
  - Tables
  - Overlays
  - Feedback
- Reusable UI needed by Examples follows the pipeline:
  - extract or implement in `packages/ui`
  - showcase in `UI Kit`
  - import into Examples

## Component / Module Map

- `packages/core/src/module.ts`: verify current recursive nav helpers still support top-level grouping entries and nested example pages.
- `packages/core/src/module-navigation.test.ts`: add or update tests for Examples/UI Kit grouping behavior and active matching.
- `apps/admin/src/modules/module-registry.ts`: register the template-default tree with Examples and UI Kit as first-level entries.
- `apps/admin/src/modules/examples/*`: add an Examples manifest that owns current page patterns as child routes or imports existing page components.
- `apps/admin/src/modules/ui-kit/*`: add UI Kit manifest and lightweight showcase pages.
- `packages/ui/src/components/AdminScrollArea.vue`: shared themed scroll component for shell, drawer, table, and settings surfaces with outer/wrap/view/bar structure and non-layout overlay thumbs.
- `apps/admin/src/workspace/WorkspaceTabs.vue`: single-row workspace tab strip with hidden scroll bar, non-layout hover/focus overflow arrows, mouse-wheel horizontal scroll, and active-tab auto reveal.
- `apps/admin/src/styles/main.css`: global scroll styling that hides native scrollbar tracks and uses theme tokens for overlay feedback.
- `apps/admin/src/shell/PrimaryNav.vue`: adjust rendering if needed so first-level grouping entries, child routes, and layout-specific behavior remain predictable.
- `apps/admin/src/shell/layouts/*`: ensure tri-column, dual-column, and top-header place the same normalized tree according to the PRD. Tri-column uses the far-left rail for first-level entries and the adjacent column for active children.
- `.trellis/spec/frontend/app-shell.md`: update if implementation refines or changes the manifest/layout contract.

## TDD / Verification Order

- [x] Add or update core navigation tests for first-level grouping entries:
  - Examples active for `/examples/...`
  - UI Kit active for `/ui-kit/...`
  - Users child routes remain matched under Examples
  - deeper child config is preserved while built-in rendering limits depth
- [x] Implement manifest/route structure for `Examples`.
- [x] Implement manifest/route structure for `UI Kit`.
- [x] Add lightweight UI Kit pages using existing `@super-admin/ui` primitives.
- [x] Add shared themed scroll area primitive and showcase it in UI Kit.
- [x] Move current default page navigation under `Examples` without renaming Dashboard or Workbench.
- [x] Verify workspace header, Stage Manager, and active nav metadata after regrouping.
- [x] Review reusable component candidates found during implementation:
  - promote generic pieces to `packages/ui`
  - showcase promoted primitives in UI Kit
  - keep domain-specific Examples logic module-owned
- [x] Run project checks:
  - `pnpm -r test`
  - `pnpm -r lint`
  - `pnpm -r build`
  - `git diff --check`
- [x] Browser QA affected layouts/themes:
  - tri-column
  - dual-column
  - top-header
  - light/dark modes

## Implementation Steps

- [x] Confirm current route paths and decide whether new paths should be `/examples/dashboard`, `/examples/workbench`, `/examples/users/all`, and `/examples/access`.
- [x] Add `examples.manifest.ts` as a real first-level manifest entry.
- [x] Add `ui-kit.manifest.ts` as a real first-level manifest entry.
- [x] Create UI Kit route pages with concise component-state showcases.
- [x] Update module registry to expose template-default IA.
- [x] Update any route redirects or default paths needed for the new IA.
- [x] Update active module/page resolution tests and consumers if regrouping changes assumptions.
- [x] Apply shared scroll area to shell, table, drawer, context, and settings scroll surfaces.
- [x] Add workspace tab overflow arrows while preserving horizontal scroll.
- [x] Update app-shell spec only for reusable implementation lessons not already captured.

## Out of Scope For This Task

- Full documentation-site behavior for UI Kit.
- Exhaustive component variants beyond what is needed to prove the IA.
- Backend integration.
- Renaming Dashboard or Workbench.
- Archiving or modifying `00-bootstrap-guidelines`.
- Superpowers artifacts.
