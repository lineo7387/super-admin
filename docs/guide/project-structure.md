# Project Structure

Super Admin is a pnpm monorepo.

```text
apps/
  admin/              # Vue admin app
packages/
  core/               # Shared frontend contracts
  theme/              # Design profiles and token helpers
  ui/                 # Admin UI primitives
docs/                 # VitePress documentation site
```

## Admin App

The current app lives in `apps/admin/`.

```text
apps/admin/src/
  app/                 # app bootstrap, providers, router registration
  api/                 # API adapters
  api/mock/            # mock API data sources
  modules/             # feature and example modules
  shell/               # app shell and layout presets
  stores/              # global Pinia stores
  styles/              # global CSS and Tailwind entrypoints
  workspace/           # workspace tabs and route surfaces
```

## Module Shape

A data-backed module usually follows this shape:

```text
modules/users/
  users.manifest.ts
  users.types.ts
  users.queries.ts
  UsersAllPage.vue
  components/
```

The page composes UI and calls module query composables. Query composables call API adapters. API adapters normalize mock data or your real API responses into the module's frontend types.

## Shared Packages

- `packages/ui` owns domain-neutral admin primitives such as cards, buttons, alerts, tables, drawers, fields, selects, skeletons, and status pills.
- `packages/theme` owns built-in design profiles.
- `packages/core` owns shared frontend contracts and helpers.

Business-specific columns, copy, workflows, and validation rules should stay in modules rather than shared packages.
