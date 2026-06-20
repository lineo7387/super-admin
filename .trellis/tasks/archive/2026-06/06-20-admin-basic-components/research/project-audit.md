# Project Audit: Admin Basic Components

## Scope

Reviewed current source template, generated-starter boundary, `packages/ui`, UI Kit examples, Users/Workbench/Access examples, docs, and frontend specs to decide whether a new base-component pass is necessary now.

## Files And Guidance Reviewed

* `packages/ui/src/components/*`
* `packages/ui/src/index.ts`
* `apps/admin/src/modules/ui-kit/*`
* `apps/admin/src/modules/users/UsersAllPage.vue`
* `apps/admin/src/modules/users/components/UsersTable.vue`
* `apps/admin/src/modules/workbench/WorkbenchPage.vue`
* `apps/admin/src/modules/access/AccessPage.vue`
* `packages/cli/src/generate-starter.ts`
* `docs/guide/project-structure.md`
* `docs/guide/examples.md`
* `docs/guide/ai-collaboration.md`
* `.trellis/spec/frontend/components.md`
* `.trellis/spec/frontend/i18n.md`
* `.trellis/spec/shared/public-delivery.md`

## Current Component Coverage

`packages/ui` already covers the basic admin primitive set:

* Actions: `AdminButton`, `AdminFormFooter`, `AdminBulkActionBar`
* Inputs/forms: `AdminTextInput`, `AdminTextarea`, `AdminSelect`, `AdminCheckbox`, `AdminRadioGroup`, `AdminSwitch`, `AdminField`, `AdminValidationSummary`
* Tables: `AdminTableFrame`, `AdminTableToolbar`, `AdminDataTable`, `AdminPagination`, `getAdminPaginationRange`, `getAdminSelectionState`
* Feedback: `AdminAlert`, `EmptyState`, `AdminSkeleton`, `StatusPill`
* Surfaces: `AdminCard`, `AdminDrawer`, `AdminScrollArea`, `MetricTile`

This is enough for users to build normal CRUD/list/detail/admin pages today.

## Generated Starter Impact

`packages/cli/src/generate-starter.ts` copies `apps/admin/src` into generated starters, with only targeted transforms. Therefore Users, UI Kit, examples, and `packages/ui` contracts are not just source-repo demos; they shape the generated project experience.

## Signals Found

### Repeated List-Page Composition Exists

`UsersAllPage.vue` and `UiKitTablesPage.vue` both hand-compose:

* icon-leading search controls
* filter rows inside `AdminTableToolbar`
* density/sort/action buttons
* column toggles or selection state

This means `AdminSearchField` or `AdminFilterBar` could reduce repetition.

### But New Components Are Not Urgent

The repetition is visible but not severe. Existing primitives already let users compose the same UI with normal Vue/Tailwind. Adding new public components would increase API surface and maintenance obligations.

### More Concrete Issue: Existing UI Copy Contracts

Several existing shared primitives still contain English default or hard-coded user-facing copy:

* `AdminBulkActionBar.vue`: hard-coded bulk-action description and `Clear`
* `AdminPagination.vue`: default `Previous`, `Next`, and `Page ...`
* `AdminFormFooter.vue`: default `Cancel`, `Save changes`, `Saving...`, `Unsaved changes`, `No changes yet`
* `AdminDataTable.vue`: default empty/error title and description
* `AdminValidationSummary.vue`: default title
* `AdminSelect.vue`: default placeholder
* `AdminDrawer.vue`: default close labels
* `packages/ui/src/lib/admin-table.ts`: English selection labels

This conflicts more directly with `.trellis/spec/frontend/i18n.md` than the absence of new filter components. Shared packages should not import app i18n, so the likely fix is to expose label/message props and ensure app/UI Kit/generated examples pass localized text.

### UI Kit Localization Is Still Partial

UI Kit pages and `UiKitPage.vue` use English literal text in many places. The i18n spec explicitly lists UI Kit page titles, labels, state copy, and validation text as a migration target.

### Users Example Has One High-Value Polish Area

`UsersAllPage.vue` is the best generated-starter proof point. The current column toggle uses native checkbox markup instead of `AdminCheckbox`, and the toolbar/search area is useful but a bit hand-rolled. Improving this example may help users more than adding general primitives immediately.

### Feedback Components Need Real Example Visibility

The feedback primitive situation is mixed:

* `AdminAlert` appears in Dashboard, Workbench, Access, Auth, Template Guide, and UI Kit. Current implementation is an inline page notice (`<section>`), not a popup/overlay.
* `StatusPill` appears in Dashboard, Users, Workbench, Access, Template Guide, and UI Kit.
* `AdminSkeleton` appears in Dashboard, Workbench, Access, and UI Kit.
* `AdminValidationSummary` appears in Auth/Register/Login and UI Kit forms/overlays.
* `EmptyState` appears in `UsersInvitesPage.vue`, but the default invite list is nonempty, so generated-starter users may not see it without editing data.
* `AdminBulkActionBar` currently appears in UI Kit tables only.

This means the task should not claim all feedback components are UI Kit-only. The real gap is making copyable example usage more visible, especially for `EmptyState` and any bulk-action workflow we choose to expose.

If popup feedback is desired, it should be a separate primitive such as toast/notification or dialog/alert-dialog. Do not change `AdminAlert` into an overlay because existing examples use it as inline contextual feedback.

## Recommendation

Do not prioritize a broad new component pass right now.

Recommended first task:

1. Tighten existing `packages/ui` text/label contracts so primitives are easier to localize and replace.
2. Update UI Kit examples to pass localized/default Chinese copy where they demonstrate primitives.
3. Ensure feedback primitives have visible, copyable usage in real examples where appropriate; prioritize making `EmptyState` reachable/visible and decide whether `AdminBulkActionBar` belongs in the Users example or should remain UI Kit-only.
4. Polish the Users table toolbar only with existing primitives where possible, especially replacing native column checkboxes with existing `AdminCheckbox`.
5. Defer `AdminSearchField`, `AdminFilterBar`, `AdminFilterChip`, and `AdminConfirmDialog` until repeated demand is clearer.

## Why This Is Better For Users

* It improves generated starter quality immediately.
* It does not add much public API surface.
* It keeps users free to compose list pages their own way.
* It aligns with the project’s current i18n and public delivery rules.
* It reduces existing friction rather than inventing new abstractions.

## Deferred Component Ideas

Keep these as future candidates, not current MVP:

* `AdminSearchField`
* `AdminFilterBar`
* `AdminFilterChip`
* `AdminConfirmDialog`
* `AdminPageHeader`
* `AdminDescriptionList`
* `AdminTimeline`
