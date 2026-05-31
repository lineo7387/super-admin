# Admin UI Primitives

## Goal

Build the first reusable admin UI primitives for the Super Admin template so template users can copy, compose, and extend production-shaped table and form workflows without wiring a real backend. The MVP should improve the existing Users example into a credible reference implementation, keep mock services easy to replace, and introduce normalized configuration for nested module navigation so second- and third-level pages are rendered from config rather than page-local ad hoc nav.

## What I Already Know

- The repository is a frontend-first Vue 3 admin template using Composition API, Vite, TypeScript, Pinia, TanStack Query, Tailwind CSS, and shadcn-vue conventions.
- Shared UI currently lives in `packages/ui` and exports `AdminButton`, `AdminCard`, `EmptyState`, `MetricTile`, and `StatusPill`.
- `apps/admin/src/modules/users/UsersPage.vue` currently contains an inline mock user array, local search state, and raw table markup.
- `apps/admin/src/modules/access/AccessPage.vue` currently contains inline mock role data and card/list markup.
- Frontend specs say route/page components should compose sections and query hooks; reusable UI belongs in shared UI, and module-specific table columns/details belong in module folders.
- Module service specs recommend `<module>.types.ts`, `<module>.mock.ts`, `<module>.service.ts`, and `<module>.queries.ts` as the replacement point for real APIs.
- The project should remain frontend-only by default. This task should not require a backend.
- Codex is running in inline mode, so Phase 1 stays in this PRD until requirements are confirmed. No implementation should start before approval.

## Assumptions (Temporary)

- The first table primitive should be generic enough for ordinary CRUD/list pages, not a full TanStack Table integration.
- The first form primitive should provide layout, validation display, and action structure, while field state remains module-owned.
- Users create/edit should be demonstrated as drawer/sheet-over-list in the MVP, while the navigation/route model should not prevent route-backed create/edit pages later.
- Demo state controls are useful for template learning, but loading/empty/error scenarios should ultimately be driven through the mock data/query layer rather than hard-coded table UI flags.
- Admin extensibility matters: MVP primitives should stay small but leave clear slots/events/state boundaries for later batch actions, advanced filters, sorting, and route-backed workflows.
- Users is the best primary example because it already has a table and naturally demonstrates search, filters, status, row actions, pagination, and a create/edit form.
- Access can remain a secondary reference or be left untouched unless the MVP needs a second usage site.
- Secondary navigation is not currently demonstrated in the app. The existing manifest shape supports multiple routes per module, but only one top-level `nav` item; `PrimaryNav` renders a flat module list.
- The desired direction is normalized navigation config: future modules should be able to declare second- and third-level directory/page structure in configuration, and the shell should render that hierarchy consistently.
- Nested navigation should use a data model that can represent arbitrary depth, while the MVP UI intentionally renders only up to three levels.

## Requirements (Evolving)

- Add reusable table primitives that can support:
  - toolbar actions
  - search
  - filter slots or controls
  - column visibility
  - density
  - empty, loading, and error states
  - row actions
  - status badges
  - simple page pagination
- Defer batch selection/actions from the MVP, but do not design table primitives in a way that blocks adding selection and batch toolbars later.
- Add reusable form primitives that can support:
  - field layout
  - label, help, and error display
  - input, select, switch, and textarea composition
  - footer actions
  - dirty state display
  - validation summary or per-field validation display
  - a clear drawer/sheet/modal carrying strategy
- Use drawer/sheet-over-list as the MVP form carrier for Users create/edit.
- Keep route and navigation contracts compatible with future route-backed create/edit pages, but do not implement those pages in this MVP.
- Demonstrate the Users drawer form with `name`, `email`, `role`, `status`, `region`, and optional `notes`.
- Validate `name`, `email`, `role`, and `status`; show both per-field errors and dirty/footer action behavior.
- Keep data mocked, but structure it through module service and query files so users can replace the service with real API calls.
- Demonstrate loading, empty, and error states through mock service/query scenarios. The Users UI may expose a small preview control, but it should feed query/service params instead of bypassing the data layer.
- Provide at least one concrete module example that template users can copy and extend.
- Add a normalized navigation/page-directory contract so module manifests can describe nested child routes.
- Render nested navigation from configuration in the shell/navigation layer, not inside `UsersPage.vue`.
- Use Users as the first example of the normalized nested navigation contract.
- Support arbitrary-depth navigation data in TypeScript contracts, but constrain built-in shell rendering to top-level, second-level, and third-level entries for this MVP.
- Keep top-level navigation as the global module entry list. Render the active module's second- and third-level navigation through shared shell/navigation components.
- Place active-module nested navigation by layout: in the module/navigation column for `tri-column`, under the sidebar primary nav for `dual-column`, and as a compact workspace-level strip below the workspace header for `top-header`.
- Use one complete Users subpage plus lightweight child pages to prove nested navigation:
  - `Users > All Users`: complete table + drawer form example.
  - `Users > Pending Review`: lightweight list/table variant.
  - `Users > Invites`: lightweight placeholder, empty, or simple list example.
  - `Users > Activity`: lightweight activity-list example.

## Candidate MVP Scope

### Approach A: Users-First Table and Drawer Form (Selected)

Build generic shared table/form building blocks in `packages/ui`, then refactor Users into a richer mock-backed CRUD-style example. Use a drawer/sheet-style edit/create surface for forms.

Pros:
- Demonstrates the most common admin template workflow in one place.
- Keeps Access available for a later permission-matrix-specific task.
- Shows service/query replacement points clearly.

Cons:
- Users becomes a larger example page and needs careful component splitting.

### Approach B: Split Users Table + Access Form Patterns

Use Users for table primitives and Access for form/permission editing primitives.

Pros:
- Shows primitives across two modules.
- Avoids overloading Users with every concept.

Cons:
- Higher implementation surface and more cross-module design decisions.

### Approach C: Shared Primitives Only, Minimal Page Refactor

Create reusable components in `packages/ui` and lightly update the current Users page without a full module service/query structure.

Pros:
- Smallest change.
- Faster to verify.

Cons:
- Less useful as a template because the real copy/replace path remains unclear.

## Decision (ADR-lite)

**Context**: The template needs the first practical table/form primitive showcase without requiring a backend or spreading the example across too many modules. It also lacks a normalized secondary navigation example, which makes multi-page modules hard to evaluate.

**Decision**: Use Approach A, expanded with a normalized nested-navigation foundation. Build generic shared table/form building blocks in `packages/ui`, refactor Users into the primary mock-backed example, and update module navigation config so child pages can be declared once and rendered by the shell. Use a drawer/sheet-style create/edit surface for the MVP form workflow.

**Consequences**: Users becomes the main copyable CRUD-style reference and the first nested-navigation example. Access remains available for a later permission-matrix-specific task. Scope grows beyond pure table/form primitives because the template needs a real multi-page module pattern.

## Navigation Decision (ADR-lite)

**Context**: The app currently renders only top-level module navigation. Users need to see how a multi-page module exposes child pages without each module inventing its own local navigation.

**Decision**: `PrimaryNav` renders the normalized module tree directly. Module child pages appear inside the original module item, not in a separate module-local nav block. The manifest/navigation contract can represent arbitrary-depth trees, but the MVP Users example only needs direct child pages: All Users, Pending Review, Invites, and Activity.

**Consequences**: Navigation remains configuration-driven and reusable across modules, while the visible Users example stays simple with direct child pages. Deeper trees are preserved in the type contract for future modules that genuinely need them.

## Template Showcase Information Architecture Decision (ADR-lite)

**Context**: This repository is a reusable admin template, not a fixed business application. The default navigation should help template users discover copyable page patterns and theme-aware UI primitives, while still letting real projects promote examples into ordinary business modules later.

**Decision**: The target template-default information architecture should be showcase-oriented:

```text
Examples
  Dashboard
  Users
    All Users
    Pending Review
    Invites
    Activity
  Access
  Form Drawer
  Table States
  Empty / Error States

UI Kit
  Foundations
  Actions
  Inputs
  Forms
  Tables
  Overlays
  Feedback
```

`Examples` contains copyable business/page patterns. `UI Kit` contains theme-aware component demonstrations. The same normalized manifest tree should also support real-project navigation by promoting example domains into first-level business modules, such as `Users`, `Orders`, `Products`, `Access`, and `Settings`, without changing shell rendering code.

**Consequences**: Users and Access should not be treated as permanently special top-level modules in the template-default IA. They are examples by default, but the manifest model must keep them promotable to first-level business modules for real projects. A complete UI Kit/component gallery is valuable follow-up scope, not required to finish the current Users-first primitives MVP.

## Layout Navigation Placement Decision (ADR-lite)

**Context**: Adding a UI Kit makes dropdown-only top navigation too cramped, and the current tri-column/dual-column/top-header layouts need clearer responsibility for first-level versus nested navigation.

**Decision**: The target layout contract should be:

- `top-header`: render only first-level entries in the top nav, such as `Examples` and `UI Kit`; render the active or selected first-level entry's second/third-level tree in a left subnav, similar to a two-column layout.
- `dual-column`: do not split primary nav and module nav; the sidebar renders the full normalized nav tree directly.
- `tri-column`: keep a dedicated navigation column that can show the template tree or the active module tree, depending on the final showcase layout direction.
- Parent entries with `children` expand or select their nested tree first. Page navigation happens by selecting a leaf entry or explicit child/default entry.

**Consequences**: The shell should not encode a Users-only subnav or a UI-Kit-only menu. Layouts decide where the same manifest tree is presented. This can be implemented after the current primitives land, alongside the UI Kit/component gallery work.

## Users Navigation Example Decision (ADR-lite)

**Context**: The task must prove normalized child-page navigation without turning every Users child route into a full product surface.

**Decision**: Implement one complete Users page and several lightweight supporting routes. `Users > All Users` is the full table + drawer form example. `Users > Pending Review` is a lightweight table/list variant. `Users > Invites` and `Users > Activity` are lightweight examples that prove child navigation behavior and give template users copyable page shapes.

**Consequences**: The nested navigation contract is visible and testable, while implementation effort stays focused on the admin primitives rather than building four complete CRUD pages.

## Form Carrier Decision (ADR-lite)

**Context**: Users needs a copyable create/edit pattern, but route-backed edit pages would expand this task into deeper route lifecycle and workspace-tab behavior.

**Decision**: The MVP demonstrates create/edit in a drawer or sheet over the Users list. The navigation and route contracts should remain compatible with future route-backed create/edit pages, but those pages are not implemented in this task.

**Consequences**: The first form example stays fast and ergonomic for admin workflows. Future work can add linkable create/edit routes without replacing the form primitives or nested navigation model.

## Data State Demo Decision (ADR-lite)

**Context**: The template should visibly demonstrate table loading, empty, and error states, but those states should reflect the data/query boundary that users will replace with a real backend.

**Decision**: Model demo states in the mock service/query layer. The Users page may include a low-profile preview control for `normal`, `loading`, `empty`, and `error`, but that control should update query/service scenario params rather than passing one-off UI flags directly to the table.

**Consequences**: Template users can see every table state in the UI while still learning the intended replacement seam: page -> query composable -> module service -> mock data or user API.

## Table Scope Decision (ADR-lite)

**Context**: The first table primitive needs to feel useful for ordinary admin CRUD screens without becoming a full data-grid project.

**Decision**: MVP table controls include search, one or two filters, column visibility, density, row actions, status badges, simple page pagination, loading/empty/error states, and a toolbar primary action. Batch selection and batch actions are deferred.

**Consequences**: The table stays shippable and copyable in this task, while the component contracts should preserve extension points for future batch selection, bulk action toolbars, advanced filters, sorting, and server-backed state.

## Form Scope Decision (ADR-lite)

**Context**: The first form primitive should show realistic admin create/edit behavior without inventing fields only to showcase controls.

**Decision**: The Users drawer form demonstrates `name`, `email`, `role`, `status`, `region`, and optional `notes`. Required validation covers `name`, `email`, `role`, and `status`, with email format validation. The MVP must show label/help/error layout, footer actions, dirty state, and validation display. A switch primitive can exist if it naturally fits shared UI, but the Users form does not need an artificial switch-only field.

**Consequences**: The form example covers input, select, textarea, required validation, format validation, and dirty-action behavior while staying believable as a user-management template.

## Expansion Sweep

### Future Evolution

- The primitives may later grow into export/import workflows, saved views, server-side filters, and role-aware row actions.
- The component contracts should leave room for module-owned column definitions and service-backed pagination without forcing a universal CRUD DSL.
- Table primitive APIs should leave room for future batch selection/actions, advanced filters, sorting, and server-backed pagination.
- A follow-up UI Kit/component gallery should show theme-aware component variants, states, density, and copyable composition examples.
- The template-default navigation can evolve from business-module-first to showcase-first (`Examples` and `UI Kit`) while keeping the same manifest contract for real projects.

### Related Scenarios

- Users create/edit should match future module pages that need drawer or modal forms.
- Route-backed create/edit pages should remain a future-compatible extension, not a blocker for this MVP.
- Table empty/loading/error states should match query composable behavior and existing `EmptyState` conventions.
- Secondary navigation should become a reusable shell capability: a module with multiple routes should declare nested directory items once, and layout presets should render them consistently.
- UI Kit pages should render shared `@super-admin/ui` primitives through the active theme tokens rather than maintaining separate showcase-only component styles.

### Failure and Edge Cases

- Mock services should expose loading, empty, and error examples without pretending to be a production backend.
- Preview controls should remain clearly template/demo-oriented and should not become a required production data-provider abstraction.
- Form validation should be visible, keyboard accessible, and not hidden behind hover-only UI.
- Dirty/cancel behavior should be explicit enough that template users know where to plug confirmation prompts later.

## Acceptance Criteria (Evolving)

- [ ] The PRD is confirmed before implementation begins.
- [ ] Table primitives are reusable outside Users and exported from `@super-admin/ui`.
- [ ] Form primitives are reusable outside Users and exported from `@super-admin/ui`.
- [ ] Users demonstrates mock-backed search, filter, row actions, status display, and pagination or simple list paging.
- [ ] Users demonstrates column visibility and density controls.
- [ ] Table primitive contracts leave a clear future extension path for batch selection/actions without implementing them now.
- [ ] Users demonstrates create/edit form composition with validation display, dirty state, and footer actions.
- [ ] Users form includes `name`, `email`, `role`, `status`, `region`, and optional `notes`.
- [ ] Users form validates required fields and email format with per-field errors.
- [ ] Users create/edit opens in a drawer/sheet over the list for the MVP.
- [ ] The navigation/route model does not hard-code assumptions that would block route-backed create/edit pages later.
- [ ] The module manifest/navigation contract can describe child page entries.
- [ ] The navigation contract can represent arbitrary-depth trees without requiring the built-in shell to render every depth.
- [ ] The shell renders nested navigation from configuration rather than page-local markup.
- [ ] Built-in navigation UI renders at most three levels and handles deeper configured nodes predictably.
- [ ] Sidebar layouts render Users child pages inside the original Users nav item, not as a separate module-local directory block.
- [ ] Navigation decisions document the template-default `Examples` / `UI Kit` IA and the real-project promotion path for business modules.
- [ ] Navigation decisions document the target layout placement: top-header first-level nav plus side subnav, dual-column full tree, and no Users-only or UI-Kit-only local nav.
- [ ] Users includes at least one nested navigation example that proves the contract.
- [ ] Users includes `All Users`, `Pending Review`, `Invites`, and `Activity` route/nav entries.
- [ ] `All Users` is the complete table + drawer form example; supporting Users pages are lightweight examples rather than full CRUD builds.
- [ ] Mock data is routed through module service/query files rather than hard-coded directly in the page.
- [ ] Empty, loading, and error states can be exercised in the example.
- [ ] Demo state selection flows through the Users query/service layer rather than table-only local flags.
- [ ] The implementation passes project lint/typecheck/test commands selected during Phase 2.

## Definition of Done

- Tests added or updated where useful for pure logic, query/service behavior, or state helpers.
- Lint, typecheck, and relevant tests pass.
- Page/component structure follows `.trellis/spec/frontend/` guidance.
- No real backend dependency is introduced.
- Any durable new conventions discovered during implementation are considered for `.trellis/spec/`.

## Out of Scope (Draft)

- Connecting to a real backend.
- Adding authentication or permission enforcement.
- Building a full data-grid engine with virtualization, column resizing, drag reorder, or saved views.
- Building a universal CRUD schema or global data-provider DSL.
- Reworking every module page.
- Per-page bespoke secondary navigation that only works for Users.
- Full enterprise menu management, permissions-driven menu filtering, remote menu loading, or user-customizable menu trees.
- Built-in visual rendering for fourth-level-and-deeper navigation entries.
- Implementing route-backed create/edit pages in this MVP.
- A mandatory global demo-state framework for every module.
- Batch selection and batch actions in this MVP.
- Full server-side sorting or saved views in this MVP.
- Archiving `00-bootstrap-guidelines`.
- Creating any `docs/superpowers` or `.superpowers` artifacts.

## Technical Approach (Draft)

- Keep primitives design-profile-aware and Tailwind/CSS-variable based in `packages/ui`.
- Keep module-specific columns, row copy, validation rules, and mock data in `apps/admin/src/modules/users`.
- Use module service/query files for mock data and backend replacement seams.
- Add Users mock service/query parameters for preview scenarios such as `normal`, `loading`, `empty`, and `error`.
- Keep table controls module-owned where business semantics vary, but expose generic table layout/toolbar/state primitives from `packages/ui`.
- Extend the core module/navigation types so a module can expose a normalized navigation tree linked to route names/paths.
- Keep shell navigation rendering centralized. Layout presets may place the same nav differently, but should not require separate page-specific nav implementations.
- Model navigation tree children recursively, then define a shell rendering policy that displays levels 1-3 and treats deeper children as unsupported by the default UI for now.
- Keep `PrimaryNav` focused on rendering the normalized module tree, including active module child pages inline.
- Build form primitives so the same field/action layout can live inside a drawer now and a route-backed page later.
- Keep form field primitives generic; let module forms own domain-specific fields and validation rules.
- Prefer semantic HTML and keyboard-accessible controls. Use lucide icons for button icons where available.
- Use simple page pagination for ordinary CRUD lists, consistent with frontend module-service specs.

## Open Questions

- Confirmed by user; implementation is in progress.

## Technical Notes

- Relevant specs inspected:
  - `.trellis/spec/guides/index.md`
  - `.trellis/spec/frontend/index.md`
  - `.trellis/spec/frontend/components.md`
  - `.trellis/spec/frontend/module-services.md`
  - `.trellis/spec/frontend/data-and-query.md`
  - `.trellis/spec/frontend/directory-structure.md`
- Existing examples inspected:
  - `apps/admin/src/modules/users/UsersPage.vue`
  - `apps/admin/src/modules/access/AccessPage.vue`
  - `apps/admin/src/modules/users/users.manifest.ts`
  - `apps/admin/src/router/routes.ts`
  - `apps/admin/src/shell/PrimaryNav.vue`
  - `apps/admin/src/shell/layouts/TriColumnLayout.vue`
  - `apps/admin/src/shell/layouts/DualColumnLayout.vue`
  - `apps/admin/src/shell/layouts/TopHeaderLayout.vue`
  - `packages/core/src/module.ts`
  - `packages/core/src/shell.ts`
  - `packages/ui/src/index.ts`
  - `packages/ui/src/components/AdminButton.vue`
  - `packages/ui/src/components/AdminCard.vue`
  - `packages/ui/src/components/StatusPill.vue`
