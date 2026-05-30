import type { RouteRecordRaw } from 'vue-router'
import { registeredModules } from '@/modules/module-registry'

export const moduleRoutes: RouteRecordRaw[] = registeredModules.flatMap((manifest) =>
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
