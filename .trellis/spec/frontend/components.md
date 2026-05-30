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

Put in shared UI / future `packages/ui`:

- App shell primitives.
- Preferences popover primitives.
- Workspace tabs.
- Design-profile-aware button/card/input/table wrappers.
- Generic empty/loading/error states.

Keep in modules:

- Users table columns.
- Workbench job cards.
- Access permission matrix.
- Dashboard metric arrangements.

## Accessibility

- Use semantic HTML before custom roles.
- Keep focus states visible in all design profiles.
- Buttons must be buttons, not clickable divs.
- Popovers/sheets/dialogs must be keyboard accessible.
- Do not hide essential controls behind hover-only UI.

