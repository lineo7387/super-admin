import type { ModuleManifest } from '@super-admin/core'
import WorkbenchPage from './WorkbenchPage.vue'

export const workbenchManifest: ModuleManifest = {
  id: 'workbench',
  name: 'Workbench',
  nav: {
    label: 'Workbench',
    path: '/workbench',
    icon: 'workbench',
    order: 20
  },
  routes: [
    {
      path: '/workbench',
      name: 'workbench',
      component: WorkbenchPage,
      meta: {
        title: 'Operations Workbench',
        description: 'Queue-oriented workspace for scheduled jobs and operator handoffs.',
        regions: ['tools', 'primary', 'activity'],
        keepAlive: { enabled: true }
      }
    }
  ]
}
