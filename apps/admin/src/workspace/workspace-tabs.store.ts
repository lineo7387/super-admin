import {
  activateWorkspaceTab,
  closeWorkspaceTab,
  createWorkspaceTab,
  type KeepAlivePolicy,
  type WorkspaceTab,
  type WorkspaceTabsState
} from '@super-admin/core'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

export const useWorkspaceTabsStore = defineStore('workspace-tabs', () => {
  const state = reactive<WorkspaceTabsState>({
    tabs: [],
    activeTabId: null
  })

  const activeTab = computed(() => state.tabs.find((tab) => tab.id === state.activeTabId) ?? null)

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
  }

  function activateTab(tabId: string): void {
    const next = activateWorkspaceTab(state, tabId, Date.now())
    state.tabs = next.tabs
    state.activeTabId = next.activeTabId
  }

  function closeTab(tabId: string): WorkspaceTab | null {
    const next = closeWorkspaceTab(state, tabId)
    const nextActive = next.tabs.find((tab) => tab.id === next.activeTabId) ?? null
    state.tabs = next.tabs
    state.activeTabId = next.activeTabId
    return nextActive
  }

  function pinTab(tabId: string): void {
    const tab = state.tabs.find((item) => item.id === tabId)
    if (tab) {
      tab.pinned = !tab.pinned
    }
  }

  return {
    state,
    activeTab,
    activateTab,
    closeTab,
    openTab,
    pinTab
  }
})
