import { describe, expect, it } from 'vitest'
import { mountModuleManifest } from '@super-admin-org/core'
import { accessManifest } from '../access/access.manifest'
import { chartsManifest } from '../charts/charts.manifest'
import { dashboardManifest } from '../dashboard/dashboard.manifest'
import { usersManifest } from '../users/users.manifest'
import { workbenchManifest } from '../workbench/workbench.manifest'
import { exampleFeatureManifests, examplesManifest } from './examples.manifest'
import { templateGuideManifest } from './template-guide.manifest'

describe('examples module manifest', () => {
  it('derives every mounted example from its feature manifest', () => {
    const sourceManifests = [templateGuideManifest, dashboardManifest, chartsManifest, workbenchManifest, usersManifest, accessManifest]
    const expected = sourceManifests.map((manifest) =>
      mountModuleManifest(manifest, {
        pathPrefix: '/examples',
        routeNamePrefix: 'examples'
      })
    )

    expect(exampleFeatureManifests).toEqual(expected)
    expect(examplesManifest.nav.children?.map((item) => item.label)).toEqual(['Template Guide', 'Dashboard', 'Charts', 'Workbench', 'Users', 'Access'])
    expect(examplesManifest.routes).toEqual(expected.flatMap((manifest) => manifest.routes))
  })

  it('preserves feature permissions instead of replacing them in the showcase group', () => {
    expect(examplesManifest.permissions?.map((permission) => permission.action)).toEqual(['examples:view', 'dashboard:view', 'users:manage', 'access:review'])
  })
})
