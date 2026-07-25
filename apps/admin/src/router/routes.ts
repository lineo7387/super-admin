import type { RouteRecordRaw } from 'vue-router'
import { moduleCompatibilityRedirects, registeredModules } from '@/modules/module-registry'

export const moduleRoutes: RouteRecordRaw[] = [
  ...moduleCompatibilityRedirects.map((route) => ({ ...route })),
  ...registeredModules.flatMap((manifest) =>
    manifest.routes.map((route) => ({
      path: route.path,
      name: route.name,
      component: route.component,
      meta: {
        ...route.meta,
        workspaceTitle: route.meta.title
      }
    }))
  )
]
