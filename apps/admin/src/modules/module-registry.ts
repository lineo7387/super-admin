import type { ModuleManifest } from '@super-admin-org/core'
import type { AppModuleRedirect, AppModuleRegistry } from './app-module-registry'
import { createAppModuleRegistry } from './app-module-registry'
import { examplesRegistration } from './examples/examples.registration'
import { uiKitManifest } from './ui-kit/ui-kit.manifest'

export const appModuleRegistry: AppModuleRegistry = createAppModuleRegistry(
  [
    examplesRegistration,
    {
      manifest: uiKitManifest
    }
  ],
  {
    emptyPath: '/workspace'
  }
)

export const registeredModules: ModuleManifest[] = appModuleRegistry.manifests
export const defaultAuthenticatedPath: string = appModuleRegistry.defaultAuthenticatedPath
export const moduleCompatibilityRedirects: AppModuleRedirect[] = appModuleRegistry.redirects
