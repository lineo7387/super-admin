import type { PageShellMeta } from './shell'

export type ModuleRouteComponent = object | (() => Promise<object>)

export type ModuleNavItem = {
  label: string
  path: string
  icon: string
  order: number
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
  return [...manifests].sort((left, right) => left.nav.order - right.nav.order)
}
