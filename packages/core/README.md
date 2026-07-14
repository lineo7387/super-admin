# @super-admin-org/core

Dependency-light Super Admin contracts and pure helpers for module navigation, workspace tabs, preferences, design profiles, shell metadata, AI context, and API results.

```bash
pnpm add @super-admin-org/core
```

The package does not own Vue components, router instances, backend clients, or theme profile packages. Apps compose those dependencies locally.

## Module Manifests

A feature manifest is the single source for its navigation, routes, route metadata, and permissions:

```ts
import type { ModuleManifest } from '@super-admin-org/core'

export const ordersManifest: ModuleManifest = {
  id: 'orders',
  name: 'Orders',
  nav: {
    label: 'Orders',
    path: '/orders',
    icon: 'orders',
    order: 20
  },
  routes: [
    {
      path: '/orders',
      name: 'orders',
      component: () => import('./OrdersPage.vue'),
      meta: {
        title: 'Orders',
        keepAlive: { enabled: true }
      }
    }
  ]
}
```

Mount that definition into another information architecture without mutating it:

```ts
import { composeModuleManifest, createModuleRegistry, mountModuleManifest } from '@super-admin-org/core'

const exampleOrders = mountModuleManifest(ordersManifest, {
  pathPrefix: '/examples',
  routeNamePrefix: 'examples'
})

const examplesManifest = composeModuleManifest({
  id: 'examples',
  name: 'Examples',
  nav: {
    label: 'Examples',
    path: '/examples/orders',
    order: 10
  },
  modules: [exampleOrders]
})

export const registeredModules = createModuleRegistry([examplesManifest])
```

- `mountModuleManifest` clones and prefixes nested nav paths and route paths, and can prefix route names.
- `composeModuleManifest` sorts child manifests and combines their nav, routes, permissions, and metadata.
- `createModuleRegistry` sorts top-level manifests and rejects duplicate module IDs, top-level nav paths, route paths, and route names.

Use app-local registries when a contract needs a framework component. For example, `LayoutPreset` belongs here, while the Vue component that renders a preset belongs in the generated app's `src/shell/layout-registry.ts`.

## Compatibility

The package is ESM-first and intended for TypeScript projects. Public identifiers such as `DesignProfileId` and `LayoutPresetId` permit app-defined strings; apps should resolve unknown component registrations through an explicit neutral fallback.
