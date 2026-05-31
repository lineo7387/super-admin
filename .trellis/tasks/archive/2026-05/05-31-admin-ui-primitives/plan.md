# Admin UI Primitives Implementation Plan

## Component Map

- `packages/core/src/module.ts`: extend module/navigation contracts and add pure helpers for active module and visible nested navigation.
- `apps/admin/src/shell/PrimaryNav.vue`: render the normalized manifest tree, including child pages inline under their original module item.
- `apps/admin/src/shell/layouts/*`: reuse `PrimaryNav` placement without separate child-directory blocks.
- `packages/ui/src/components/AdminTable*.vue`: shared table frame, toolbar, state, pagination, and control primitives.
- `packages/ui/src/components/AdminForm*.vue`: shared form shell, field, footer, drawer/sheet primitives.
- `apps/admin/src/modules/users/*`: module-owned types, mock data, service, query composables, validation, page components, and nested route examples.

## TDD Order

- [x] Add failing `packages/core` tests for nested navigation helpers.
- [x] Implement core navigation contracts/helpers.
- [x] Add failing Users service/validation tests for list scenarios and form validation.
- [x] Implement Users mock/service/validation/query helpers.
- [x] Add shared UI primitives and wire Users pages.
- [x] Integrate active-module nested nav into shell layouts.
- [x] Run lint/typecheck/tests and browser QA across layouts/themes.

## Implementation Steps

- [x] Extend `ModuleNavItem` to support recursive children and active matching.
- [x] Add helpers for resolving active module and rendering levels 1-3 while preserving deeper config.
- [x] Refactor Users manifest into nested routes:
  - `Users > All Users`
  - `Users > Pending Review`
  - `Users > Invites`
  - `Users > Activity`
- [x] Add Users module service/query files with mock scenario support: `normal`, `loading`, `empty`, `error`.
- [x] Build reusable table primitives in `packages/ui`.
- [x] Build reusable form/drawer primitives in `packages/ui`.
- [x] Implement complete `All Users` table + drawer form.
- [x] Implement lightweight supporting Users pages.
- [x] Verify route/nav/tab behavior in available local-browser QA.
