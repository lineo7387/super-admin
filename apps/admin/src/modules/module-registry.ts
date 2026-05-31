import type { ModuleManifest } from '@super-admin/core'
import { sortModuleManifests } from '@super-admin/core'
import { examplesManifest } from './examples/examples.manifest'
import { uiKitManifest } from './ui-kit/ui-kit.manifest'

export const registeredModules: ModuleManifest[] = sortModuleManifests([
  examplesManifest,
  uiKitManifest
])
