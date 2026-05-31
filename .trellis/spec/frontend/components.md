# Vue Component Guidelines

## Component Style

- Use Vue 3 Composition API with `<script setup lang="ts">`.
- Keep SFC order: `<script setup>` then `<template>` then `<style>` when style is needed.
- Prefer props down and events up.
- Use `defineProps`, `defineEmits`, and typed slots when contracts matter.

## Split Rules

Split a component when it owns multiple responsibilities, such as:

- Page orchestration plus large presentational sections.
- Table toolbar plus table plus detail drawer.
- Form state plus unrelated dashboard cards.
- Repeated card/list item structures.

Route/page components should compose sections and query hooks. They should not contain all markup and logic for an entire feature.

## Shared vs Module Components

Put in shared UI / `packages/ui`:

- App shell primitives.
- Preferences popover primitives.
- Workspace tabs.
- Design-profile-aware button/card/input/table wrappers.
- Generic empty/loading/error states.
- Domain-neutral admin primitives such as alerts, validation summaries, skeletons, selects, checkboxes, radio groups, pagination, drawer carriers, and bulk-action bars.

Keep in modules:

- Users table columns.
- Workbench job cards.
- Access permission matrix.
- Dashboard metric arrangements.

## UI Kit and Shared Primitive Contracts

- Export shared primitives explicitly from `packages/ui/src/index.ts`.
- Keep pure shared behavior helpers in `packages/ui/src/lib/` and add unit tests next to the helper, such as `admin-table.test.ts`.
- Keep UI Kit pages under `apps/admin/src/modules/ui-kit/` as composed examples. They may use realistic admin copy, but business rules, table columns, and workflow semantics must not move into `packages/ui`.
- Shared table/form primitives should render generic states and slots: loading, empty, error, validation, selection, pagination, and recovery actions.
- Shared select, checkbox, radio, and switch controls should be custom/styled primitives rather than relying on browser-native visual chrome. Preserve keyboard access and typed `v-model` contracts.
- Module pages own field rules, service replacement copy, and domain-specific labels; shared primitives own accessible structure, focus states, and profile-aware styling.

## Accessibility

- Use semantic HTML before custom roles.
- Keep focus states visible in all design profiles.
- Buttons must be buttons, not clickable divs.
- Popovers/sheets/dialogs must be keyboard accessible.
- Do not hide essential controls behind hover-only UI.
