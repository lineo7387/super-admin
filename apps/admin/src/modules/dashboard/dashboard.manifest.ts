import type { ModuleManifest } from '@super-admin-org/core'
import DashboardPage from './DashboardPage.vue'

export const dashboardManifest: ModuleManifest = {
  id: 'dashboard',
  name: 'Dashboard',
  nav: {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    order: 10
  },
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: {
        title: 'Operations Dashboard',
        description: 'Live control surface for revenue, risk, jobs, and audit signals.',
        regions: ['summary', 'primary', 'activity', 'context'],
        keepAlive: { enabled: true }
      }
    }
  ],
  permissions: [
    {
      action: 'dashboard:view',
      description: 'View operational metrics and audit previews.'
    }
  ]
}
