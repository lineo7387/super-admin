# Module Manifest

## Purpose

Define a simple module metadata shape that supports navigation, route registration, shell behavior, mock/service organization, demo permissions, and future CLI generation without becoming a backend schema or plugin framework.

## Core Principle

`ModuleManifest` describes frontend admin modules only.

It should answer:

- What is this module?
- Where does it appear in navigation?
- Which routes/pages does it provide?
- What shell behavior does it prefer?
- Which demo permissions/actions should the UI show?
- Where are its service/mock/query files?

It should not define:

- Database schema.
- Backend endpoint protocol.
- Full form schema.
- Universal API adapter rules.

## Suggested Type

```ts
export type ModuleManifest = {
  id: string
  title: string
  description?: string
  icon?: string
  order?: number
  group?: 'overview' | 'management' | 'system' | string
  navigation: ModuleNavigation
  routes: ModuleRoute[]
  shell?: ModuleShellDefaults
  demoPermissions?: DemoPermission[]
  files?: ModuleFileHints
}
```

## Navigation

```ts
export type ModuleNavigation = {
  level: 1 | 2 | 'hidden'
  parentId?: string
  label: string
  badge?: string
  showInDock?: boolean
  showInSidebar?: boolean
  showInHeader?: boolean
}
```

Rules:

- Level-1 modules are primary navigation items.
- Level-2 modules appear under a parent or inside a module section.
- Hidden modules can still provide routes, drawers, or detail pages.

Default level-1 modules:

```text
dashboard
workbench
users
access
```

Audit logs are not a level-1 module by default. They appear inside Dashboard/Workbench as previews or detail panels.

## Routes

```ts
export type ModuleRoute = {
  name: string
  path: string
  component: string
  title: string
  icon?: string
  nav?: {
    visible: boolean
    label?: string
  }
  shell?: PageShellMeta
}
```

`component` can be a local component path or route loader key depending on implementation.

Detail/create/edit routes should usually have `nav.visible = false` and open from parent pages.

## Shell Defaults

```ts
export type ModuleShellDefaults = {
  preferredPreset?: 'tri-column' | 'dual-column' | 'top-header'
  regions?: PageRegion[]
  contextBehavior?: 'panel' | 'drawer' | 'sheet' | 'inline'
  keepAlive?: boolean
}
```

Examples:

- Workbench prefers `tri-column`.
- Users prefers `dual-column`.
- Dashboard can work well in all presets.
- Access prefers `dual-column` or `top-header` depending on matrix width.

## Demo Permissions

```ts
export type DemoPermission = {
  key: string
  label: string
  description?: string
}
```

Purpose:

- Demonstrate menu/action visibility.
- Drive mock role/permission examples.
- Give users obvious names to map to their own auth system.

Rules:

- Permissions are demo frontend metadata by default.
- They must not imply a required backend auth implementation.

Example:

```ts
demoPermissions: [
  { key: 'users.view', label: 'View users' },
  { key: 'users.create', label: 'Create users' },
  { key: 'users.update', label: 'Update users' },
]
```

## File Hints

```ts
export type ModuleFileHints = {
  types?: string
  mock?: string
  service?: string
  queries?: string
}
```

Purpose:

- Help docs and CLI point users to the correct integration files.
- Keep the integration story simple.

Example:

```ts
files: {
  types: './users.types.ts',
  mock: './users.mock.ts',
  service: './users.service.ts',
  queries: './users.queries.ts',
}
```

## Example: Users

```ts
export const usersModule: ModuleManifest = {
  id: 'users',
  title: 'Users',
  icon: 'Users',
  order: 30,
  group: 'management',
  navigation: {
    level: 1,
    label: 'Users',
    showInDock: true,
    showInSidebar: true,
    showInHeader: true,
  },
  shell: {
    preferredPreset: 'dual-column',
    regions: ['tools', 'primary', 'context'],
    contextBehavior: 'drawer',
    keepAlive: true,
  },
  routes: [
    {
      name: 'users.index',
      path: '/users',
      component: './UsersPage.vue',
      title: 'Users',
      nav: { visible: true },
    },
    {
      name: 'users.detail',
      path: '/users/:id',
      component: './UserDetailPage.vue',
      title: 'User Detail',
      nav: { visible: false },
    },
  ],
  demoPermissions: [
    { key: 'users.view', label: 'View users' },
    { key: 'users.create', label: 'Create users' },
    { key: 'users.update', label: 'Update users' },
  ],
  files: {
    types: './users.types.ts',
    mock: './users.mock.ts',
    service: './users.service.ts',
    queries: './users.queries.ts',
  },
}
```

## Example: Workbench

```ts
export const workbenchModule: ModuleManifest = {
  id: 'workbench',
  title: 'Workbench',
  icon: 'PanelsTopLeft',
  order: 20,
  group: 'overview',
  navigation: {
    level: 1,
    label: 'Workbench',
    showInDock: true,
    showInSidebar: true,
    showInHeader: true,
  },
  shell: {
    preferredPreset: 'tri-column',
    regions: ['summary', 'primary', 'activity', 'context'],
    contextBehavior: 'panel',
    keepAlive: true,
  },
  routes: [
    {
      name: 'workbench.index',
      path: '/workbench',
      component: './WorkbenchPage.vue',
      title: 'Workbench',
      nav: { visible: true },
    },
  ],
}
```

## Manifest Registry

The app should collect manifests into a registry:

```ts
export const modules = [
  dashboardModule,
  workbenchModule,
  usersModule,
  accessModule,
]
```

The registry can derive:

- Navigation items.
- Route records.
- Demo permission matrix.
- Workspace tab metadata.
- CLI/docs module list.

## CLI Implication

The CLI can generate a module folder and manifest:

```text
modules/orders/
  orders.manifest.ts
  orders.types.ts
  orders.mock.ts
  orders.service.ts
  orders.queries.ts
  OrdersPage.vue
```

But the initial CLI should stay theme-first. Module generation can come after runtime contracts are stable.

## Guardrails

- Keep manifest readable by normal frontend developers.
- Avoid backend schema concerns.
- Avoid universal CRUD/provider DSL.
- Use manifest metadata for frontend registration and demo behavior only.
