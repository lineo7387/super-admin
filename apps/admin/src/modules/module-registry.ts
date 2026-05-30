import type { ModuleManifest } from '@super-admin/core'
import { sortModuleManifests } from '@super-admin/core'
import { accessManifest } from './access/access.manifest'
import { dashboardManifest } from './dashboard/dashboard.manifest'
import { usersManifest } from './users/users.manifest'
import { workbenchManifest } from './workbench/workbench.manifest'

export const registeredModules: ModuleManifest[] = sortModuleManifests([
  dashboardManifest,
  workbenchManifest,
  usersManifest,
  accessManifest
])
