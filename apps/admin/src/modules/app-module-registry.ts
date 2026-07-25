import type { ModuleManifest } from '@super-admin-org/core'
import { createModuleRegistry } from '@super-admin-org/core'

export type AppModuleRedirect = {
  path: string
  redirect: string
}

export type AppModuleRegistration = {
  defaultPath?: string
  manifest: ModuleManifest
  redirects?: readonly AppModuleRedirect[]
}

export type AppModuleRegistry = {
  defaultAuthenticatedPath: string
  manifests: ModuleManifest[]
  redirects: AppModuleRedirect[]
}

export type AppModuleRegistryOptions = {
  emptyPath: string
}

function normalizeRoutePath(path: string): string {
  const [pathWithoutQuery = '/'] = path.split(/[?#]/)
  return pathWithoutQuery.length > 1 && pathWithoutQuery.endsWith('/') ? pathWithoutQuery.slice(0, -1) : pathWithoutQuery
}

function hasManifestRoute(manifest: ModuleManifest, path: string): boolean {
  const normalizedPath = normalizeRoutePath(path)
  return manifest.routes.some((route) => normalizeRoutePath(route.path) === normalizedPath)
}

export function createAppModuleRegistry(registrations: readonly AppModuleRegistration[], options: AppModuleRegistryOptions): AppModuleRegistry {
  const manifests = createModuleRegistry(registrations.map((registration) => registration.manifest))
  const registrationById = new Map(registrations.map((registration) => [registration.manifest.id, registration]))
  const redirects: AppModuleRedirect[] = []
  const registeredRoutePaths = new Set(manifests.flatMap((manifest) => manifest.routes.map((route) => normalizeRoutePath(route.path))))
  const redirectPaths = new Set<string>()

  for (const manifest of manifests) {
    const registration = registrationById.get(manifest.id)
    if (!registration) {
      throw new Error(`Missing app module registration for "${manifest.id}".`)
    }

    const defaultPath = registration.defaultPath ?? manifest.nav.path
    if (!hasManifestRoute(manifest, defaultPath)) {
      throw new Error(`Module "${manifest.id}" default path "${defaultPath}" must match one of its routes.`)
    }

    for (const redirect of registration.redirects ?? []) {
      const normalizedRedirectPath = normalizeRoutePath(redirect.path)

      if (registeredRoutePaths.has(normalizedRedirectPath)) {
        throw new Error(`App module redirect path "${redirect.path}" conflicts with a registered module route.`)
      }

      if (redirectPaths.has(normalizedRedirectPath)) {
        throw new Error(`Duplicate app module redirect path "${redirect.path}".`)
      }

      if (!hasManifestRoute(manifest, redirect.redirect)) {
        throw new Error(`Module "${manifest.id}" redirect target "${redirect.redirect}" must match one of its routes.`)
      }

      redirectPaths.add(normalizedRedirectPath)
      redirects.push({ ...redirect })
    }
  }

  const firstManifest = manifests[0]
  const firstRegistration = firstManifest ? registrationById.get(firstManifest.id) : undefined

  return {
    defaultAuthenticatedPath: firstManifest ? (firstRegistration?.defaultPath ?? firstManifest.nav.path) : options.emptyPath,
    manifests,
    redirects
  }
}
