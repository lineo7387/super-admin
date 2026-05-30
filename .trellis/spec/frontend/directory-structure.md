# Frontend Directory Structure

## Expected Shape

The first app should live under `apps/admin/` once implementation begins.

Recommended app structure:

```text
apps/admin/src/
  app/                 # app bootstrap, providers, router registration
  shell/               # app shell, layouts, header, tabs, preferences
  modules/             # feature/demo modules
  shared/              # app-local shared helpers/components
  styles/              # global Tailwind/CSS variable entrypoints
```

Recommended module structure:

```text
modules/users/
  users.manifest.ts
  users.types.ts
  users.mock.ts
  users.service.ts
  users.queries.ts
  UsersPage.vue
  components/
```

## Rules

- Keep route/page components as composition surfaces.
- Put module-specific UI under the module folder.
- Put reusable shell/UI primitives in `shell/`, `shared/`, or future `packages/ui`.
- Put theme/profile definitions in future `packages/theme`, not inside feature modules.
- Do not create backend-specific folders in the frontend app.

## Naming

- Vue page/component files use PascalCase: `UsersPage.vue`, `MetricCard.vue`.
- Module helper files use kebab or module-prefix names: `users.service.ts`, `users.queries.ts`.
- Composables use `use` prefix: `useUsersQuery.ts` or exported from `users.queries.ts`.
- Manifest files use `<module>.manifest.ts`.

