# Plan: Polish Existing UI Primitives And Example Feedback Usage

## Goal

Improve generated-starter quality by tightening existing `packages/ui` label/message contracts and making feedback primitives visible in real Examples/Auth contexts, without adding a new search/filter/confirm component layer.

## Context To Read

* `.trellis/tasks/06-20-admin-basic-components/prd.md`
* `.trellis/tasks/06-20-admin-basic-components/research/project-audit.md`
* `.trellis/spec/frontend/components.md`
* `.trellis/spec/frontend/i18n.md`
* `.trellis/spec/frontend/quality.md`
* `.trellis/spec/shared/public-delivery.md`

## Implementation Steps

### 1. Tighten Shared UI Label Contracts

Inspect these files for English-only default or hard-coded user-facing copy:

* `packages/ui/src/components/AdminBulkActionBar.vue`
* `packages/ui/src/components/AdminPagination.vue`
* `packages/ui/src/components/AdminFormFooter.vue`
* `packages/ui/src/components/AdminDataTable.vue`
* `packages/ui/src/components/AdminValidationSummary.vue`
* `packages/ui/src/components/AdminSelect.vue`
* `packages/ui/src/components/AdminDrawer.vue`
* `packages/ui/src/lib/admin-table.ts`

Add typed props/options where needed so app callers can pass localized copy. Keep shared packages free of app i18n imports.

Do not change `AdminAlert` into an overlay. It remains an inline page notice.

### 2. Update App/UI Kit Call Sites

Update generated-starter-visible app usage to pass localized labels/messages where shared primitives need caller-owned copy.

Likely areas:

* `apps/admin/src/modules/ui-kit/*`
* `apps/admin/src/modules/users/*`
* `apps/admin/src/modules/auth/*`

Use `useI18n()` from app components and add keys to:

* `apps/admin/src/i18n/locales/zh-CN.ts`
* `apps/admin/src/i18n/locales/en-US.ts`

Keep `zh-CN` as the default. Do not add English-only user-facing copy.

### 3. Improve Feedback Visibility In Real Examples

Ensure feedback primitives are visible in copyable example contexts, not only isolated UI Kit pages.

Required:

* Keep `AdminAlert` as inline notice in real query/auth states.
* Keep `AdminValidationSummary` in Auth/form validation contexts.
* Make `EmptyState` visible or reachable in at least one generated-starter example path or scenario.

Optional if scope remains small:

* Demonstrate `AdminBulkActionBar` in the Users table only if row selection/bulk actions can stay domain-neutral and not overcomplicate the example.
* Otherwise record in comments/tests/docs or PR notes that bulk workflows remain UI Kit-only for now.

### 4. Polish Users Example With Existing Primitives

In `apps/admin/src/modules/users/UsersAllPage.vue`, replace native checkbox column controls with existing `AdminCheckbox` where practical.

Keep Users table state/query flow unchanged:

```text
Page -> module query composable -> API adapter -> mock/user API
```

Do not add `AdminSearchField`, `AdminFilterBar`, `AdminFilterChip`, `AdminConfirmDialog`, toast, or popup feedback in this task unless the PRD is revised first.

### 5. Tests

Update or add focused tests for changed contracts.

Candidates:

* `packages/ui/src/components/AdminField.test.ts` or nearby component-contract tests for label props.
* `packages/ui/src/lib/admin-table.test.ts` if selection labels/options change.
* `apps/admin/src/i18n/i18n.test.ts` for new locale keys/parity.
* Existing users/auth tests if behavior or validation copy changes.

### 6. Verification

Run at minimum:

```bash
pnpm --filter @super-admin-org/ui typecheck
pnpm --filter @super-admin-org/ui test
pnpm --filter @super-admin-org/admin typecheck
pnpm --filter @super-admin-org/admin test
```

If changes touch generated-starter output or CLI template behavior, also run:

```bash
pnpm --filter create-super-admin test
pnpm validate:starter
```

Browser/visual QA should include the relevant generated-starter-visible routes:

* `/ui-kit/feedback`
* `/ui-kit/forms`
* `/ui-kit/tables`
* `/examples/users/all`
* the example route or scenario that makes `EmptyState` visible
* `/auth/login` or `/auth/register` validation state

Check at least one light and one dark profile if visual styling changes.

## Out Of Scope

* New `AdminSearchField`, `AdminFilterBar`, `AdminFilterChip`, `AdminConfirmDialog`, toast, notification, page header, timeline, avatar/user-cell, property grid, or local tabs.
* Changing `AdminAlert` from inline notice to popup/overlay.
* Backend, auth provider, database, API adapter, query, or route architecture changes.
* Moving module-specific columns/copy/workflows into `packages/ui`.

## Completion Report Required From Execution AI

Return:

* Files changed, grouped by purpose.
* Whether any new public props/contracts were added to `packages/ui`.
* Which feedback primitives now appear in real Examples/Auth contexts.
* Whether `EmptyState` is visible/reachable and where.
* Verification commands run and exact pass/fail result.
* Any intentionally deferred items or risks.
