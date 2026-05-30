import type { KeepAlivePolicy } from './shell'

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

export function createWorkspaceTab(
  input: Omit<WorkspaceTab, 'openedAt' | 'activatedAt' | 'refreshKey'>,
  now: number
): WorkspaceTab {
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
  const activeTabId =
    state.activeTabId === tabId ? resolveNextActiveTabId(tabs, closingIndex, closeStrategy) : state.activeTabId

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
    tabs: nextPinned
      ? [nextTab, ...otherTabs]
      : [...otherTabs.filter((tab) => tab.pinned), nextTab, ...otherTabs.filter((tab) => !tab.pinned)]
  }
}

export function refreshWorkspaceTab(
  state: WorkspaceTabsState,
  tabId: WorkspaceTabId,
  now: number
): WorkspaceTabsState {
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

function resolveNextActiveTabId(
  tabs: WorkspaceTab[],
  closingIndex: number,
  closeStrategy: WorkspaceTabCloseStrategy
): WorkspaceTabId | null {
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
