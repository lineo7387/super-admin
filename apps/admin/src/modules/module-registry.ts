import type { ModuleManifest } from '@super-admin-org/core'
import { sortModuleManifests } from '@super-admin-org/core'
import { examplesManifest } from './examples/examples.manifest'
import { uiKitManifest } from './ui-kit/ui-kit.manifest'

export const registeredModules: ModuleManifest[] = sortModuleManifests([examplesManifest, uiKitManifest])
