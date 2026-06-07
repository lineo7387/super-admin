import {
  activateWorkspaceTab,
  closeWorkspaceTab,
  createWorkspaceTab,
  refreshWorkspaceTab,
  toggleWorkspaceTabPin,
  type KeepAlivePolicy,
  type WorkspaceTab,
  type WorkspaceTabsState
} from '@super-admin-org/core'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { usePreferencesStore } from '@/stores/preferences.store'

const STORAGE_KEY = 'super-admin:workspace-tabs'

type PersistedWorkspaceTab = Pick<WorkspaceTab, 'id' | 'title' | 'routePath' | 'pinned' | 'keepAlive' | 'openedAt' | 'activatedAt'>

function isPersistedWorkspaceTab(value: unknown): value is PersistedWorkspaceTab {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Partial<PersistedWorkspaceTab>
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.routePath === 'string' &&
    item.pinned === true &&
    typeof item.keepAlive === 'object' &&
    item.keepAlive !== null &&
    typeof item.openedAt === 'number' &&
    typeof item.activatedAt === 'number'
  )
}

function readPinnedTabs(restorePinnedTabs: boolean): WorkspaceTab[] {
  if (!restorePinnedTabs) {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isPersistedWorkspaceTab).map((tab) => ({
      ...tab,
      refreshKey: 0
    }))
  } catch {
    return []
  }
}

export const useWorkspaceTabsStore = defineStore('workspace-tabs', () => {
  const preferences = usePreferencesStore()
  const state = reactive<WorkspaceTabsState>({
    tabs: readPinnedTabs(preferences.workspaceTabs.restorePinnedTabs),
    activeTabId: null
  })

  const activeTab = computed(() => state.tabs.find((tab) => tab.id === state.activeTabId) ?? null)

  function persistPinnedTabs(): void {
    const pinnedTabs: PersistedWorkspaceTab[] = state.tabs
      .filter((tab) => tab.pinned)
      .map(({ id, title, routePath, pinned, keepAlive, openedAt, activatedAt }) => ({
        id,
        title,
        routePath,
        pinned,
        keepAlive,
        openedAt,
        activatedAt
      }))

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedTabs))
  }

  function openTab(input: {
    title: string
    routePath: string
    pinned?: boolean
    keepAlive: KeepAlivePolicy
  }): void {
    const existing = state.tabs.find((tab) => tab.routePath === input.routePath)
    const now = Date.now()
    if (existing) {
      const next = activateWorkspaceTab(state, existing.id, now)
      state.tabs = next.tabs
      state.activeTabId = next.activeTabId
      persistPinnedTabs()
      return
    }

    const tab = createWorkspaceTab(
      {
        id: input.routePath,
        title: input.title,
        routePath: input.routePath,
        pinned: input.pinned ?? false,
        keepAlive: input.keepAlive
      },
      now
    )

    state.tabs.push(tab)
    state.activeTabId = tab.id
    persistPinnedTabs()
  }

  function activateTab(tabId: string): void {
    const next = activateWorkspaceTab(state, tabId, Date.now())
    state.tabs = next.tabs
    state.activeTabId = next.activeTabId
    persistPinnedTabs()
  }

  function closeTab(tabId: string): WorkspaceTab | null {
    const next = closeWorkspaceTab(state, tabId, preferences.workspaceTabs.closeStrategy)
    const nextActive = next.tabs.find((tab) => tab.id === next.activeTabId) ?? null
    state.tabs = next.tabs
    state.activeTabId = next.activeTabId
    persistPinnedTabs()
    return nextActive
  }

  function pinTab(tabId: string): void {
    const next = toggleWorkspaceTabPin(state, tabId)
    state.tabs = next.tabs
    state.activeTabId = next.activeTabId
    persistPinnedTabs()
  }

  function refreshTab(tabId: string): void {
    const next = refreshWorkspaceTab(state, tabId, Date.now())
    state.tabs = next.tabs
    state.activeTabId = next.activeTabId
    persistPinnedTabs()
  }

  function getRefreshKey(routePath: string): number {
    return state.tabs.find((tab) => tab.routePath === routePath)?.refreshKey ?? 0
  }

  return {
    state,
    activeTab,
    activateTab,
    closeTab,
    getRefreshKey,
    openTab,
    pinTab,
    refreshTab
  }
})
