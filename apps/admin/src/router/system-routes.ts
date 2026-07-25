import type { RouteRecordRaw } from 'vue-router'

export const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/workspace',
    name: 'workspace-empty',
    component: () => import('@/shell/EmptyWorkspacePage.vue'),
    meta: {
      title: 'Workspace setup',
      workspaceTitle: 'Workspace setup',
      keepAlive: {
        enabled: false
      }
    }
  }
]
