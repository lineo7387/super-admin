import type { ModuleManifest } from '@super-admin-org/core'
import AccessPage from './AccessPage.vue'

export const accessManifest: ModuleManifest = {
  id: 'access',
  name: 'Access',
  nav: {
    label: 'Access',
    path: '/access',
    icon: 'access',
    order: 40
  },
  routes: [
    {
      path: '/access',
      name: 'access',
      component: AccessPage,
      meta: {
        title: 'Access Control',
        description: 'Frontend-level permission metadata for demo navigation and actions.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    }
  ],
  permissions: [
    {
      action: 'access:review',
      description: 'Review mock roles and permission groups.'
    }
  ]
}
