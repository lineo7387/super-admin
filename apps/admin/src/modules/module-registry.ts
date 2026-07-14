import type { ModuleManifest } from '@super-admin-org/core'
import { createModuleRegistry } from '@super-admin-org/core'
import { examplesManifest } from './examples/examples.manifest'
import { uiKitManifest } from './ui-kit/ui-kit.manifest'

export const registeredModules: ModuleManifest[] = createModuleRegistry([examplesManifest, uiKitManifest])
