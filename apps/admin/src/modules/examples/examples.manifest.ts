import type { ModuleManifest } from '@super-admin-org/core'
import { composeModuleManifest, mountModuleManifest } from '@super-admin-org/core'
import { accessManifest } from '../access/access.manifest'
// @starter-charts:start
import { chartsManifest } from '../charts/charts.manifest'
// @starter-charts:end
import { dashboardManifest } from '../dashboard/dashboard.manifest'
import { usersManifest } from '../users/users.manifest'
import { workbenchManifest } from '../workbench/workbench.manifest'
import { templateGuideManifest } from './template-guide.manifest'

export { templateGuideManifest } from './template-guide.manifest'

function mountAsExample(manifest: ModuleManifest): ModuleManifest {
  return mountModuleManifest(manifest, {
    pathPrefix: '/examples',
    routeNamePrefix: 'examples'
  })
}

export const exampleFeatureManifests: ModuleManifest[] = [
  mountAsExample(templateGuideManifest),
  mountAsExample(dashboardManifest),
  // @starter-charts:start
  mountAsExample(chartsManifest),
  // @starter-charts:end
  mountAsExample(workbenchManifest),
  mountAsExample(usersManifest),
  mountAsExample(accessManifest)
]

export const examplesManifest: ModuleManifest = composeModuleManifest({
  id: 'examples',
  name: 'Examples',
  nav: {
    label: 'Examples',
    path: '/examples/template-guide',
    icon: 'examples',
    order: 10
  },
  modules: exampleFeatureManifests,
  permissions: [
    {
      action: 'examples:view',
      description: 'View copyable template examples.'
    }
  ]
})
