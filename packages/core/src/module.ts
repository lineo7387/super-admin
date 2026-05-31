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

export function sortModuleManifests(manifests: ModuleManifest[]): ModuleManifest[] {
  return [...manifests].sort((left, right) => (left.nav.order ?? 0) - (right.nav.order ?? 0))
}

function normalizePath(path: string): string {
  const [pathWithoutQuery = '/'] = path.split(/[?#]/)
  if (pathWithoutQuery.length > 1 && pathWithoutQuery.endsWith('/')) {
    return pathWithoutQuery.slice(0, -1)
  }
  return pathWithoutQuery
}

function pathMatches(navPath: string, routePath: string): boolean {
  const normalizedNavPath = normalizePath(navPath)
  const normalizedRoutePath = normalizePath(routePath)

  return normalizedRoutePath === normalizedNavPath || normalizedRoutePath.startsWith(`${normalizedNavPath}/`)
}

export function flattenModuleNav(
  item: ModuleNavItem,
  maxDepth = Number.POSITIVE_INFINITY,
  level = 1,
  parents: ModuleNavItem[] = []
): FlattenedModuleNavItem[] {
  if (level > maxDepth) {
    return []
  }

  return [
    { item, level, parents },
    ...(item.children ?? []).flatMap((child) => flattenModuleNav(child, maxDepth, level + 1, [...parents, item]))
  ]
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
