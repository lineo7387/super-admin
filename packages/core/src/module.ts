import type { PageShellMeta } from './shell'

export type ModuleRouteComponent = object | (() => Promise<object>)

export type ModuleNavItem = {
  label: string
  path: string
  icon?: string
  order?: number
  children?: ModuleNavItem[]
}

export type FlattenedModuleNavItem = {
  item: ModuleNavItem
  level: number
  parents: ModuleNavItem[]
}

export type DemoPermission = {
  action: string
  description: string
}

export type ModuleRoute = {
  path: string
  name: string
  component: ModuleRouteComponent
  meta: PageShellMeta
}

export type ModuleManifest = {
  id: string
  name: string
  nav: ModuleNavItem
  routes: ModuleRoute[]
  permissions?: DemoPermission[]
}

export type MountModuleManifestOptions = {
  pathPrefix: string
  routeNamePrefix?: string
}

export type ComposeModuleManifestOptions = {
  id: string
  name: string
  nav: Omit<ModuleNavItem, 'children'>
  modules: readonly ModuleManifest[]
  permissions?: readonly DemoPermission[]
}

export function sortModuleManifests(manifests: readonly ModuleManifest[]): ModuleManifest[] {
  return [...manifests].sort((left, right) => (left.nav.order ?? 0) - (right.nav.order ?? 0))
}

function normalizePath(path: string): string {
  const [pathWithoutQuery = '/'] = path.split(/[?#]/)
  if (pathWithoutQuery.length > 1 && pathWithoutQuery.endsWith('/')) {
    return pathWithoutQuery.slice(0, -1)
  }
  return pathWithoutQuery
}

function joinModulePath(pathPrefix: string, path: string): string {
  if (!pathPrefix.startsWith('/')) {
    throw new Error(`Module path prefix must be absolute: "${pathPrefix}"`)
  }

  if (!path.startsWith('/')) {
    throw new Error(`Module path must be absolute: "${path}"`)
  }

  const normalizedPrefix = normalizePath(pathPrefix)
  const normalizedPath = normalizePath(path)

  if (normalizedPrefix === '/') {
    return normalizedPath
  }

  if (normalizedPath === '/') {
    return normalizedPrefix
  }

  return `${normalizedPrefix}${normalizedPath}`
}

function cloneModuleNavItem(item: ModuleNavItem, pathPrefix?: string): ModuleNavItem {
  return {
    ...item,
    path: pathPrefix ? joinModulePath(pathPrefix, item.path) : item.path,
    children: item.children?.map((child) => cloneModuleNavItem(child, pathPrefix))
  }
}

function cloneModuleRoute(route: ModuleRoute, pathPrefix?: string, routeNamePrefix?: string): ModuleRoute {
  return {
    ...route,
    path: pathPrefix ? joinModulePath(pathPrefix, route.path) : route.path,
    name: routeNamePrefix ? `${routeNamePrefix.replace(/-+$/, '')}-${route.name}` : route.name,
    meta: {
      ...route.meta,
      keepAlive: { ...route.meta.keepAlive },
      regions: route.meta.regions ? [...route.meta.regions] : undefined
    }
  }
}

function clonePermission(permission: DemoPermission): DemoPermission {
  return { ...permission }
}

export function mountModuleManifest(manifest: ModuleManifest, options: MountModuleManifestOptions): ModuleManifest {
  return {
    ...manifest,
    nav: cloneModuleNavItem(manifest.nav, options.pathPrefix),
    routes: manifest.routes.map((route) => cloneModuleRoute(route, options.pathPrefix, options.routeNamePrefix)),
    permissions: manifest.permissions?.map(clonePermission)
  }
}

function assertUniqueManifestValue(seen: Set<string>, value: string, label: string): void {
  if (seen.has(value)) {
    throw new Error(`Duplicate module ${label} "${value}"`)
  }

  seen.add(value)
}

export function createModuleRegistry(manifests: readonly ModuleManifest[]): ModuleManifest[] {
  const ids = new Set<string>()
  const navPaths = new Set<string>()
  const routePaths = new Set<string>()
  const routeNames = new Set<string>()

  for (const manifest of manifests) {
    assertUniqueManifestValue(ids, manifest.id, 'id')
    assertUniqueManifestValue(navPaths, normalizePath(manifest.nav.path), 'nav path')

    for (const route of manifest.routes) {
      assertUniqueManifestValue(routePaths, normalizePath(route.path), 'route path')
      assertUniqueManifestValue(routeNames, route.name, 'route name')
    }
  }

  return sortModuleManifests(manifests)
}

export function composeModuleManifest(options: ComposeModuleManifestOptions): ModuleManifest {
  const modules = createModuleRegistry(options.modules)
  const permissions = [...(options.permissions ?? []).map(clonePermission), ...modules.flatMap((module) => module.permissions?.map(clonePermission) ?? [])]

  return {
    id: options.id,
    name: options.name,
    nav: {
      ...options.nav,
      children: modules.map((module) => cloneModuleNavItem(module.nav))
    },
    routes: modules.flatMap((module) => module.routes.map((route) => cloneModuleRoute(route))),
    permissions: permissions.length > 0 ? permissions : undefined
  }
}

function pathMatches(navPath: string, routePath: string): boolean {
  const normalizedNavPath = normalizePath(navPath)
  const normalizedRoutePath = normalizePath(routePath)

  return normalizedRoutePath === normalizedNavPath || normalizedRoutePath.startsWith(`${normalizedNavPath}/`)
}

export function flattenModuleNav(item: ModuleNavItem, maxDepth = Number.POSITIVE_INFINITY, level = 1, parents: ModuleNavItem[] = []): FlattenedModuleNavItem[] {
  if (level > maxDepth) {
    return []
  }

  return [{ item, level, parents }, ...(item.children ?? []).flatMap((child) => flattenModuleNav(child, maxDepth, level + 1, [...parents, item]))]
}

export function isModuleNavItemActive(item: ModuleNavItem | undefined, routePath: string): boolean {
  if (!item) {
    return false
  }

  return pathMatches(item.path, routePath) || (item.children ?? []).some((child) => isModuleNavItemActive(child, routePath))
}

export function findActiveModule(manifests: ModuleManifest[], routePath: string): ModuleManifest | undefined {
  return manifests
    .filter((manifest) => isModuleNavItemActive(manifest.nav, routePath))
    .sort((left, right) => {
      const leftMatch = flattenModuleNav(left.nav).find((entry) => pathMatches(entry.item.path, routePath))
      const rightMatch = flattenModuleNav(right.nav).find((entry) => pathMatches(entry.item.path, routePath))

      return (rightMatch?.item.path.length ?? 0) - (leftMatch?.item.path.length ?? 0)
    })[0]
}

export function findModuleRoute(manifest: ModuleManifest | undefined, routePath: string): ModuleRoute | undefined {
  if (!manifest) {
    return undefined
  }

  const normalizedRoutePath = normalizePath(routePath)

  return manifest.routes.find((route) => normalizePath(route.path) === normalizedRoutePath)
}

export function getVisibleModuleNavTree(item: ModuleNavItem, maxDepth: number, level = 1): ModuleNavItem {
  if (level >= maxDepth) {
    return { ...item, children: [] }
  }

  return {
    ...item,
    children: (item.children ?? []).map((child) => getVisibleModuleNavTree(child, maxDepth, level + 1))
  }
}
