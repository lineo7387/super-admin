# Vue I18n Foundation Research

## Question

What is the right first i18n foundation for the Vue 3 admin app before CLI generation?

## Sources

- Vue I18n Composition API documentation: https://vue-i18n.intlify.dev/guide/advanced/composition
- Vue I18n getting started documentation: https://vue-i18n.intlify.dev/guide/essentials/started
- Vue I18n Vue 3 migration documentation: https://vue-i18n.intlify.dev/guide/migration/vue3

## Findings

- Vue I18n supports Vue 3 Composition API usage and is the standard ecosystem option for Vue i18n.
- For Composition API usage, Vue I18n requires `legacy: false` on `createI18n`.
- Vue I18n exposes `useI18n()` for `<script setup>` components, which matches the admin app's Vue 3 + Composition API convention.
- Vue I18n supports global messages, locale, fallback locale, named interpolation, pluralization, datetime formatting, and number formatting.
- The docs describe Legacy API mode as deprecated in later Vue I18n versions and recommend Composition API mode for new Vue 3 projects.

## Repository Fit

The current admin app:

- uses Vue 3, `<script setup lang="ts">`, Pinia, Vue Router, and Vite
- does not currently have an i18n dependency
- has no `apps/admin/src/i18n/` directory yet
- has hard-coded English text across shell, preferences, auth, workspace, users, examples, workbench, access, dashboard, and UI Kit surfaces
- already has a project spec requiring `zh-CN` default and optional `en-US`

## Options

### Option A: Use `vue-i18n` Composition API

Add `vue-i18n` to `@super-admin/admin`, create a global app-local i18n instance, and use `useI18n()` / typed message helpers in Vue components.

Pros:

- standard Vue ecosystem path
- supports future locale switching, formatting, and fallback behavior
- aligns with `<script setup>` conventions
- avoids inventing a translation runtime before CLI work

Cons:

- adds one dependency to the admin app
- tests need a small i18n mount helper or app plugin setup

### Option B: Build a tiny app-local `t()` helper first

Create a minimal message lookup helper under `apps/admin/src/i18n/` without adding a dependency.

Pros:

- no new dependency
- very small first implementation

Cons:

- quickly reimplements missing key handling, locale switching, interpolation, formatting, and Vue integration
- likely creates churn when moving to a mature library later
- less useful as a CLI-generated app foundation

## Recommendation

Use Option A: `vue-i18n` in Composition API mode.

Initial setup should:

- add `vue-i18n` only to `apps/admin`
- create `apps/admin/src/i18n/index.ts`
- create `apps/admin/src/i18n/locales/zh-CN.ts`
- create `apps/admin/src/i18n/locales/en-US.ts`
- set `locale: 'zh-CN'`
- set `fallbackLocale: 'zh-CN'`
- use namespaced keys by surface and module
- migrate a focused set of high-frequency text first

Keep the first task focused on the admin app. Do not add CLI generation, package-level catalogs, backend dependencies, or generated-project tests yet.

