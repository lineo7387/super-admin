import type { KeepAlivePolicy } from './shell'

export type WorkspaceTabId = string

export type WorkspaceTab = {
  id: WorkspaceTabId
  title: string
  routePath: string
  pinned: boolean
  keepAlive: KeepAlivePolicy
  openedAt: number
  activatedAt: number
}

export type WorkspaceTabsState = {
  tabs: WorkspaceTab[]
  activeTabId: WorkspaceTabId | null
}

export function createWorkspaceTab(input: Omit<WorkspaceTab, 'openedAt' | 'activatedAt'>, now: number): WorkspaceTab {
  return {
    ...input,
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

export function closeWorkspaceTab(state: WorkspaceTabsState, tabId: WorkspaceTabId): WorkspaceTabsState {
  const tabs = state.tabs.filter((tab) => tab.id !== tabId || tab.pinned)
  const activeTabId = state.activeTabId === tabId ? tabs.at(-1)?.id ?? null : state.activeTabId

  return { tabs, activeTabId }
}
