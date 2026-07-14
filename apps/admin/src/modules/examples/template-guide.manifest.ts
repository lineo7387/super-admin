import type { ModuleManifest } from '@super-admin-org/core'
import TemplateGuidePage from './TemplateGuidePage.vue'

export const templateGuideManifest: ModuleManifest = {
  id: 'template-guide',
  name: 'Template Guide',
  nav: {
    label: 'Template Guide',
    path: '/template-guide',
    order: 0
  },
  routes: [
    {
      path: '/template-guide',
      name: 'template-guide',
      component: TemplateGuidePage,
      meta: {
        title: 'Template Guide',
        description: 'Frontend-first map for mock data, API adapters, queries, and module reshaping.',
        regions: ['summary', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    }
  ]
}
