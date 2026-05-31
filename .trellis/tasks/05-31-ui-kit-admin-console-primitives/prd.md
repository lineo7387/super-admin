# UI Kit Admin Console Primitives

## Goal

Expand the current UI Kit from a lightweight component showcase into a realistic admin-console primitive reference that future Examples, module service work, API replacement seams, and CLI scaffold output can consume. This task is frontend-first: it strengthens `packages/ui` and the admin UI Kit routes without introducing backend, database, auth, AI provider, or reference API requirements.

## What I Already Know

- This task is the agreed next implementation task from `.trellis/tasks/05-31-roadmap-backend-api-scaffold-followups/`.
- UI Kit/admin primitives must happen before module service examples, API contract validation, reference backend validation, or CLI scaffold work.
- Default scaffold remains a Vue admin app with runtime layout/profile/theme switching, examples, mock data, and replaceable module services.
- Reference backend/API validation is a later maintainer-side task only; it must not enter this task's default scaffold scope.
- Current `packages/ui` already exports these primitives:
  - `AdminButton`
  - `AdminCard`
  - `AdminDataTable`
  - `AdminDrawer`
  - `AdminField`
  - `AdminFormFooter`
  - `AdminPagination`
  - `AdminScrollArea`
  - `AdminSelect`
  - `AdminSwitch`
  - `AdminTableFrame`
  - `AdminTableToolbar`
  - `AdminTextarea`
  - `AdminTextInput`
  - `EmptyState`
  - `MetricTile`
  - `StatusPill`
- Current UI Kit routes exist under `apps/admin/src/modules/ui-kit/`:
  - Foundations
  - Actions
  - Inputs
  - Forms
  - Tables
  - Overlays
  - Feedback
- Current Users examples already consume several shared primitives for a table and drawer form.
- Relevant frontend specs:
  - `.trellis/spec/frontend/index.md`
  - `.trellis/spec/frontend/components.md`
  - `.trellis/spec/frontend/design-profiles.md`
  - `.trellis/spec/frontend/css-design.md`
  - `.trellis/spec/frontend/directory-structure.md`
  - `.trellis/spec/frontend/type-safety.md`
  - `.trellis/spec/frontend/quality.md`
  - `.trellis/spec/shared/monorepo.md`

## Assumptions

- This task should refine and extend existing primitives before inventing larger application flows.
- Shared primitives belong in `packages/ui`; module-owned table columns, validation rules, business copy, and domain workflow state stay in feature modules.
- UI Kit showcase pages should demonstrate how primitives compose in realistic backend/admin screens, not just isolated atoms.
- The implementation should prefer small, typed Vue components over a large generic admin framework DSL.
- The task may add focused tests where behavior is meaningful, especially for typed component contracts or helper logic; purely visual components should be verified through typecheck and browser QA.
- `00-bootstrap-guidelines` remains active and must not be archived or modified as part of this task unless explicitly requested.

## Requirements

- Preserve the frontend-first boundary:
  - no backend app
  - no database or ORM
  - no auth provider
  - no AI provider
  - no required API response shape
  - no CLI scaffold implementation
- Expand UI Kit coverage so future admin Examples can reuse shared primitives for:
  - foundations/tokens
  - action controls
  - inputs and field states
  - forms and validation feedback
  - table shells, density, pagination, empty/loading/error states
  - overlays/drawers for create/edit flows
  - feedback, status, and recovery states
- Keep reusable UI in `packages/ui` with explicit exports from `packages/ui/src/index.ts`.
- Keep app-local showcase composition under `apps/admin/src/modules/ui-kit/`.
- Use profile-aware CSS variables and Tailwind utilities; avoid runtime-generated Tailwind class names.
- Verify UI across:
  - Crypto dark
  - Crypto light
  - Industrial light
  - Industrial dark
  - tri-column layout
  - dual-column layout
  - top-header layout
- Check Cyberpunk if touched by token/profile-sensitive changes, since it is now a built-in profile.
- Maintain keyboard and accessibility basics:
  - visible focus states
  - real buttons/inputs
  - accessible drawer close behavior
  - no essential hover-only controls
  - readable contrast in relevant modes
- Do not push module service examples, API contract validation, reference backend, or CLI work into this task.

## Candidate Primitive Gaps

These are implementation candidates to evaluate during the coding phase, not hard requirements to add every item:

- Table composition:
  - selectable rows
  - bulk action toolbar
  - sortable header affordances
  - density switch display
  - error action slot examples
  - responsive horizontal overflow confirmation
- Forms:
  - required/optional field language
  - disabled/read-only states
  - submitting state
  - field groups or section layout
  - validation summary pattern if useful
- Overlays:
  - drawer footer composition
  - destructive/confirm-style flow if needed by admin screens
  - focus/keyboard polish without introducing heavy dependencies
- Feedback:
  - loading blocks/skeletons
  - inline alert or callout pattern
  - not-configured/unavailable state for future integration examples
- Foundations:
  - clearer token swatches and surface/depth examples
  - compact admin typography examples
  - scroll behavior and stable layout examples

Implementation should choose the smallest set that makes the UI Kit useful for realistic admin screens and the next `module-service-examples` task.

## Acceptance Criteria

- [ ] `packages/ui` exposes the reusable primitives needed by realistic backend/admin console screens.
- [ ] UI Kit pages demonstrate those primitives in composed admin scenarios, including table, form, drawer, feedback, and foundation states.
- [ ] Reusable primitives remain profile-aware and do not contain module-specific business concepts.
- [ ] Showcase examples remain frontend-only and do not depend on backend/API/auth/database/AI code.
- [ ] Existing Users/admin pages continue to work with any changed primitives.
- [ ] Typecheck passes.
- [ ] Lint passes.
- [ ] Relevant tests pass or are added where component/helper behavior warrants tests.
- [ ] Browser QA covers the affected UI Kit routes across the required profile/mode/layout combinations.
- [ ] Any durable component convention discovered during implementation is reflected in `.trellis/spec/frontend/components.md` or a related frontend spec.

## Out Of Scope

- Building `module-service-examples`.
- Defining API validation contracts.
- Creating a reference backend/API.
- Adding database, auth, or AI provider integrations.
- Building CLI scaffold commands.
- Archiving or modifying `00-bootstrap-guidelines`.
- Reworking the entire shell/navigation architecture unless a small fix is necessary for UI Kit QA.

## Technical Notes

- Current UI package entrypoint: `packages/ui/src/index.ts`.
- Current UI primitives: `packages/ui/src/components/`.
- Current UI Kit pages: `apps/admin/src/modules/ui-kit/`.
- Current realistic consumer examples: `apps/admin/src/modules/users/components/UsersTable.vue` and `apps/admin/src/modules/users/components/UserDrawerForm.vue`.
- Current scripts:
  - `pnpm --filter @super-admin/ui typecheck`
  - `pnpm --filter @super-admin/admin typecheck`
  - `pnpm -r typecheck`
  - `pnpm -r test`
  - `pnpm -r lint`
- Implementation phase should load `trellis-before-dev` before code changes.
