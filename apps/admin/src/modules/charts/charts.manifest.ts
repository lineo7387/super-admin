import type { ModuleManifest } from '@super-admin-org/core'

export const chartsManifest: ModuleManifest = {
  id: 'charts',
  name: 'Charts',
  nav: {
    label: 'Charts',
    path: '/charts',
    icon: 'charts',
    order: 15
  },
  routes: [
    {
      path: '/charts',
      name: 'charts',
      component: () => import('./ChartsPage.vue'),
      meta: {
        title: 'Charts',
        description: 'Theme-adapted ECharts examples that users can keep, override, or remove.',
        regions: ['summary', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    }
  ]
}
