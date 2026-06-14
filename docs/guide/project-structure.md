# Project Structure

Super Admin has two shapes:

- a generated starter project for your own admin app
- this source repository, which is a pnpm monorepo used to develop and publish Super Admin itself

Most users start in the generated starter. Contributors and maintainers work in the source repository.

## Generated Starter

A project created with `npm create super-admin@latest my-admin` is a focused Vue admin app. It does not include this documentation site, release automation, optional reference backend validation, or maintainer AI workflow files.

The app code follows the same frontend layers as the source template:

```text
src/
  app/                 # app bootstrap and providers
  api/                 # API adapters
  api/mock/            # mock API data sources
  i18n/                # locale messages and locale setup
  modules/             # feature and example modules
  router/              # route registration
  shell/               # app shell and layout presets
  stores/              # global Pinia stores
  styles/              # global CSS and Tailwind entrypoints
  super-admin/         # template bootstrap helpers
  workspace/           # workspace tabs and route surfaces
```

## Source Repository

The `lineo7387/super-admin` repository is the development workspace for the template, packages, docs, CLI, and maintainer validation.

```text
apps/
  admin/              # Vue admin app
  api/                # optional reference API for maintainer validation
packages/
  core/               # Shared frontend contracts
  theme/              # Design profiles and token helpers
  ui/                 # Admin UI primitives
  cli/                # create-super-admin scaffolder
docs/                 # VitePress documentation site
scripts/              # maintainer validation and release scripts
```

## Admin App

The source template app lives in `apps/admin/`. Generated starter projects use the same internal shape under their own `src/` directory.

```text
apps/admin/src/
  app/                 # app bootstrap, providers, router registration
  api/                 # API adapters
  api/mock/            # mock API data sources
  i18n/                # locale messages and locale setup
  modules/             # feature and example modules
  router/              # route registration
  shell/               # app shell and layout presets
  stores/              # global Pinia stores
  styles/              # global CSS and Tailwind entrypoints
  super-admin/         # template bootstrap helpers
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
