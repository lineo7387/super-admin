import type { KeepAlivePolicy } from './shell'
import type { ModuleManifest, ModuleNavItem } from './module'
import { isModuleNavItemActive } from './module'

export type WorkspaceTabId = string

export type WorkspaceTab = {
  id: WorkspaceTabId
  title: string
  routePath: string
  pinned: boolean
  keepAlive: KeepAlivePolicy
  refreshKey: number
  openedAt: number
  activatedAt: number
}

export type WorkspaceTabCloseStrategy = 'activate-left' | 'activate-right' | 'activate-nearest'

export type WorkspaceTabsState = {
  tabs: WorkspaceTab[]
  activeTabId: WorkspaceTabId | null
}

export type WorkspaceTabGroup = {
  id: string
  label: string
  moduleId: string
  moduleName: string
  routePath: string
  tabs: WorkspaceTab[]
  activeTab: WorkspaceTab
  isStacked: boolean
}

export function createWorkspaceTab(input: Omit<WorkspaceTab, 'openedAt' | 'activatedAt' | 'refreshKey'>, now: number): WorkspaceTab {
  return {
    ...input,
    refreshKey: 0,
    openedAt: now,
    activatedAt: now
  }
}

export function activateWorkspaceTab(state: WorkspaceTabsState, tabId: WorkspaceTabId, now: number): WorkspaceTabsState {
  return {
    activeTabId: tabId,
    tabs: state.tabs.map((tab) => (tab.id === tabId ? { ...tab, activatedAt: now } : tab))
  }
}

export function closeWorkspaceTab(
  state: WorkspaceTabsState,
  tabId: WorkspaceTabId,
  closeStrategy: WorkspaceTabCloseStrategy = 'activate-nearest'
): WorkspaceTabsState {
  const closingIndex = state.tabs.findIndex((tab) => tab.id === tabId)
  const closingTab = state.tabs[closingIndex]
  if (!closingTab || closingTab.pinned) {
    return {
      activeTabId: state.activeTabId,
      tabs: [...state.tabs]
    }
  }

  const tabs = state.tabs.filter((tab) => tab.id !== tabId)
  const activeTabId = state.activeTabId === tabId ? resolveNextActiveTabId(tabs, closingIndex, closeStrategy) : state.activeTabId

  return { tabs, activeTabId }
}

export function toggleWorkspaceTabPin(state: WorkspaceTabsState, tabId: WorkspaceTabId): WorkspaceTabsState {
  const toggledTab = state.tabs.find((tab) => tab.id === tabId)
  if (!toggledTab) {
    return {
      activeTabId: state.activeTabId,
      tabs: [...state.tabs]
    }
  }

  const nextPinned = !toggledTab.pinned
  const nextTab = { ...toggledTab, pinned: nextPinned }
  const otherTabs = state.tabs.filter((tab) => tab.id !== tabId)

  return {
    activeTabId: state.activeTabId,
    tabs: nextPinned ? [nextTab, ...otherTabs] : [...otherTabs.filter((tab) => tab.pinned), nextTab, ...otherTabs.filter((tab) => !tab.pinned)]
  }
}

export function refreshWorkspaceTab(state: WorkspaceTabsState, tabId: WorkspaceTabId, now: number): WorkspaceTabsState {
  return {
    activeTabId: state.activeTabId,
    tabs: state.tabs.map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            refreshKey: tab.refreshKey + 1,
            activatedAt: now
          }
        : tab
    )
  }
}

export function createWorkspaceTabGroups(tabs: WorkspaceTab[], manifests: ModuleManifest[]): WorkspaceTabGroup[] {
  const groups = new Map<string, Omit<WorkspaceTabGroup, 'activeTab' | 'isStacked'>>()

  for (const tab of tabs) {
    const descriptor = resolveWorkspaceTabGroup(tab.routePath, manifests)
    const existing = groups.get(descriptor.id)

    if (existing) {
      existing.tabs.push(tab)
      continue
    }

    groups.set(descriptor.id, {
      ...descriptor,
      tabs: [tab]
    })
  }

  const result: WorkspaceTabGroup[] = []

  for (const group of groups.values()) {
    const [firstTab, ...remainingTabs] = group.tabs
    if (!firstTab) {
      continue
    }

    const activeTab = remainingTabs.reduce((latest, tab) => (tab.activatedAt > latest.activatedAt ? tab : latest), firstTab)

    result.push({
      ...group,
      activeTab,
      isStacked: group.tabs.length > 1
    })
  }

  return result
}

function resolveWorkspaceTabGroup(routePath: string, manifests: ModuleManifest[]): Omit<WorkspaceTabGroup, 'tabs' | 'activeTab' | 'isStacked'> {
  const manifest = manifests.find((item) => isModuleNavItemActive(item.nav, routePath))

  if (!manifest) {
    return {
      id: routePath,
      label: routePath,
      moduleId: 'unknown',
      moduleName: 'Unknown',
      routePath
    }
  }

  const activeTrail = findActiveNavTrail(manifest.nav, routePath)
  const groupNavItem = manifest.id === 'examples' ? (activeTrail?.[1] ?? manifest.nav) : manifest.nav

  return {
    id: `${manifest.id}:${groupNavItem.path}`,
    label: groupNavItem.label,
    moduleId: manifest.id,
    moduleName: manifest.name,
    routePath: groupNavItem.path
  }
}

function findActiveNavTrail(item: ModuleNavItem, routePath: string): ModuleNavItem[] | null {
  for (const child of item.children ?? []) {
    const childTrail = findActiveNavTrail(child, routePath)
    if (childTrail) {
      return [item, ...childTrail]
    }
  }

  if (pathMatches(item.path, routePath)) {
    return [item]
  }

  return null
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

function resolveNextActiveTabId(tabs: WorkspaceTab[], closingIndex: number, closeStrategy: WorkspaceTabCloseStrategy): WorkspaceTabId | null {
  if (tabs.length === 0) {
    return null
  }

  const left = tabs[closingIndex - 1]
  const right = tabs[closingIndex]

  if (closeStrategy === 'activate-left') {
    return left?.id ?? right?.id ?? null
  }

  if (closeStrategy === 'activate-right') {
    return right?.id ?? left?.id ?? null
  }

  return right?.id ?? left?.id ?? null
}
