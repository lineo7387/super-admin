# Showcase IA and UI Kit Navigation

## Goal

Evolve the Super Admin template from business-module-first navigation into a showcase-oriented information architecture that helps template users discover copyable examples and theme-aware UI primitives. The same normalized manifest tree should continue to support real projects that promote examples into first-level business modules.

## What I Already Know

- The previous `05-31-admin-ui-primitives` task added reusable admin table/form/drawer primitives and refactored Users into nested child routes.
- `ModuleManifest.nav.children` now supports recursive navigation data, and `packages/core/src/module.ts` includes helpers for active module matching, route matching, flattening, and max-depth visible trees.
- Current default modules are still first-level entries: Dashboard, Workbench, Users, and Access.
- `Examples` and `UI Kit` should be implemented as real first-level manifest/nav entries, not shell-only grouping wrappers.
- All currently existing pages should be treated as `Examples` pages in the default template IA, including Dashboard, Workbench, Users, and Access.
- Existing page names should remain stable in the first pass. `Dashboard` and `Workbench` stay named as-is under `Examples`; do not rename them or rewrite their page copy just to say "example".
- Page-level UI pieces that are generic enough should be extracted into `UI Kit` / shared UI primitives before existing pages are switched to consume the finalized primitives.
- The preferred implementation order is to build `UI Kit` first, then migrate current page content to use the same extracted primitives and move examples under `Examples`.
- Future reusable UI that appears while building or expanding Examples should be planned into `UI Kit` / `packages/ui` first, showcased there, and then imported by Examples. Examples should not accumulate reusable component implementations inline.
- Global scrolling should be treated as a reusable UI primitive: scrollable shell surfaces, drawers, tables, and settings panels should use a shared themed scroll area component instead of raw browser-default scrollbars. The component should follow the Element Plus-style structure of outer container, scroll wrap, content view, and absolute overlay bars so scroll feedback does not consume layout space.
- The desired template-default IA is showcase-oriented:
  - `Examples` contains all existing copyable page/workflow patterns.
  - `UI Kit` contains theme-aware component demonstrations.
- Real projects should still be able to promote domains into first-level business modules such as Users, Orders, Products, Access, and Settings without changing shell rendering code.
- Top-header should eventually show only first-level entries, such as Examples and UI Kit, with the selected tree's children in a left subnav.
- Dual-column should eventually render the full normalized tree directly without a separate primary/module split.
- Tri-column should render first-level navigation such as Examples and UI Kit in the far-left logo rail, then render the active first-level entry's child tree in the adjacent navigation column.
- `00-bootstrap-guidelines` is a separate Trellis initialization task and should remain active unless explicitly handled later.

## Assumptions (Temporary)

- This task should focus on IA and navigation shell behavior, not on building a complete UI Kit gallery with exhaustive component examples.
- A small UI Kit skeleton is useful if it proves the navigation model, but the full gallery can be follow-up scope.
- The current `ModuleManifest` contract should be reused if possible; add new types only if grouping Examples/UI Kit cannot be represented cleanly.
- The default template can keep lightweight example pages while avoiding fake production business complexity.

## Open Questions

- Which current page-level UI pieces should be promoted into reusable UI Kit/shared primitives in the first pass, versus staying module-owned examples?

## Requirements (Evolving)

- Define the template-default IA around `Examples` and `UI Kit`.
- Implement `Examples` and `UI Kit` as real first-level manifest/nav entries.
- Build the `UI Kit` foundation first, then migrate current example pages to use those extracted primitives where appropriate.
- Use a reusable-first component pipeline:
  - identify reusable UI needed by Examples
  - implement or refine it in `packages/ui`
  - showcase it in `UI Kit`
  - import it into Examples
- Add a reusable themed scroll area primitive with non-layout overlay thumbs and apply it to primary global scroll surfaces.
- Add workspace tab overflow controls: keep tabs single-row, preserve horizontal scroll without showing the scroll area's own bar, show left/right arrows as non-layout overlays on hover/focus when overflow exists, prevent disabled arrows from passing clicks through to underlying tabs, translate mouse wheel over the tab strip into horizontal scrolling, and auto-reveal the active tab.
- Move the existing default pages under `Examples` in the template IA:
  - Dashboard
  - Workbench
  - Users
  - Access
- Keep existing example page titles and business-oriented demo copy stable in the first pass; the `Examples` parent makes their showcase role clear.
- Keep the same normalized manifest tree usable for real-project business-module navigation.
- Avoid hard-coded Users-only, Access-only, or UI-Kit-only shell behavior.
- Update shell navigation placement rules for:
  - `top-header`: first-level top nav plus left subnav for children.
  - `dual-column`: full normalized tree in the sidebar.
  - `tri-column`: first-level entries in the far-left rail, active child tree in the adjacent navigation column.
- Preserve existing Users child route behavior.
- Preserve a clear boundary between generic UI primitives, UI Kit demo pages, and module-specific example composition.
- Keep workspace tabs, active module/page resolution, and route titles correct after regrouping.
- Keep the default scaffold frontend-only and mock-data based.

## Decision (ADR-lite)

**Context**: The template should teach both component usage and page-pattern composition. If `Examples` and `UI Kit` are shell-only wrappers, the shell needs special grouping behavior and real projects cannot reuse the same manifest shape cleanly.

**Decision**: Implement `Examples` and `UI Kit` as real first-level manifest/nav entries. All existing default pages move under `Examples`, including Dashboard, Workbench, Users, and Access. Start with `UI Kit`: extract generic page-level UI pieces into shared primitives or UI Kit demonstration components where they are reusable, then update current example pages to consume those primitives and move them under `Examples`.

**Consequences**: The template-default IA becomes configuration-driven instead of shell-special. Existing business-looking pages become explicit examples rather than implied product modules. The first implementation stage should be careful not to over-extract module-specific workflows: Users table columns, mock user domain logic, and business copy stay in Examples, while theme-aware controls, table frames, form fields, drawers, state displays, and reusable layout primitives belong in `packages/ui` and are showcased by UI Kit pages.

## Naming Decision (ADR-lite)

**Context**: Dashboard and Workbench are currently business-oriented demo pages. Renaming them to verbose labels such as "Dashboard Example" would make the nav noisier and create copy churn without improving the underlying IA.

**Decision**: Keep existing page names and page copy stable in the first pass. `Dashboard` and `Workbench` appear under `Examples`, which is enough to communicate that they are copyable patterns in the default template.

**Consequences**: The IA shift stays focused on navigation structure and reusable UI foundations. Copy refinement can happen later if the UI Kit/showcase tone needs more polish.

## Reusable Component Pipeline Decision (ADR-lite)

**Context**: Examples are copyable page patterns, but they will naturally reveal reusable UI needs over time. If those reusable pieces stay embedded inside example pages, the template becomes harder to learn and reuse because component APIs are scattered across business-looking demos.

**Decision**: Any reusable UI introduced for current or future Examples should be planned into `UI Kit` and shared primitives first. The expected sequence is: extract or implement in `packages/ui`, showcase in `UI Kit`, then import into the relevant Example page. Module-specific domain composition, copy, mock data, table columns, validation rules, and workflow-specific state stay inside Examples.

**Consequences**: UI Kit becomes the source of truth for reusable theme-aware primitives, while Examples demonstrate realistic composition. This may add a small upfront step when building future examples, but it prevents hidden component duplication and keeps the template scalable.

## Acceptance Criteria (Evolving)

- [ ] PRD captures the chosen IA approach before implementation begins.
- [ ] `Examples` and `UI Kit` are represented without shell-specific hard-coding.
- [ ] `Examples` and `UI Kit` are real first-level manifest/nav entries.
- [ ] UI Kit pages showcase the extracted shared primitives before example pages depend on them.
- [ ] Reusable UI needed by Examples is represented in UI Kit before Examples import it.
- [ ] Global scroll surfaces use the shared themed scroll area styling without reserving native scrollbar gutter space.
- [ ] Dashboard, Workbench, Users, and Access appear under `Examples` in the default template navigation.
- [ ] Dashboard and Workbench keep their current names in the first pass.
- [ ] Users remains discoverable as a copyable example.
- [ ] Existing Users child routes still resolve active nav, workspace title, and Stage Manager metadata correctly.
- [ ] Layout behavior is documented and implemented consistently across top-header, dual-column, and tri-column.
- [ ] The implementation passes project lint/typecheck/test/build checks.
- [ ] Browser QA covers at least the affected layouts and light/dark theme modes.

## Definition of Done

- Tests added or updated for new navigation helpers or manifest behavior.
- Lint, typecheck, tests, build, and `git diff --check` pass.
- Relevant `.trellis/spec/frontend/*` docs are updated if navigation contracts change.
- The current task is committed before `/finish-work`.

## Out of Scope (Explicit)

- Do not build a full exhaustive UI Kit gallery in the MVP unless required to prove routing/navigation.
- Do not add a backend.
- Do not archive or modify `00-bootstrap-guidelines` as part of this task.
- Do not create `docs/superpowers` or `.superpowers` artifacts.

## Technical Notes

- Relevant existing spec: `.trellis/spec/frontend/app-shell.md`.
- Relevant core file: `packages/core/src/module.ts`.
- Relevant tests: `packages/core/src/module-navigation.test.ts`.
- Relevant shell files: `apps/admin/src/shell/PrimaryNav.vue`, layout components under `apps/admin/src/shell/layouts/`, and workspace metadata consumers.
- Prior work commit: `baf1cf1 feat: add admin ui primitives`.
