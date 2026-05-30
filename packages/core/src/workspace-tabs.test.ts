import { describe, expect, it } from 'vitest'
import type { KeepAlivePolicy } from './shell'
import {
  activateWorkspaceTab,
  closeWorkspaceTab,
  createWorkspaceTab,
  refreshWorkspaceTab,
  toggleWorkspaceTabPin,
  type WorkspaceTabsState
} from './workspace-tabs'

const keepAlive: KeepAlivePolicy = { enabled: true, cacheKey: 'demo' }

function tab(id: string, now: number, pinned = false) {
  return createWorkspaceTab(
    {
      id,
      title: id,
      routePath: id,
      pinned,
      keepAlive
    },
    now
  )
}

describe('workspace tab state', () => {
  it('protects pinned tabs from the normal close action', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/dashboard', 1, true), tab('/users', 2)],
      activeTabId: '/dashboard'
    }

    const next = closeWorkspaceTab(state, '/dashboard')

    expect(next.tabs.map((item) => item.id)).toEqual(['/dashboard', '/users'])
    expect(next.activeTabId).toBe('/dashboard')
  })

  it('toggles pinned state explicitly', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/dashboard', 1)],
      activeTabId: '/dashboard'
    }

    const pinned = toggleWorkspaceTabPin(state, '/dashboard')
    const unpinned = toggleWorkspaceTabPin(pinned, '/dashboard')

    expect(pinned.tabs[0]?.pinned).toBe(true)
    expect(unpinned.tabs[0]?.pinned).toBe(false)
  })

  it('moves newly pinned tabs to the front of the tab list', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/dashboard', 1), tab('/workbench', 2), tab('/users', 3)],
      activeTabId: '/users'
    }

    const next = toggleWorkspaceTabPin(state, '/users')

    expect(next.tabs.map((item) => item.id)).toEqual(['/users', '/dashboard', '/workbench'])
    expect(next.activeTabId).toBe('/users')
  })

  it('moves unpinned tabs after the remaining pinned tabs', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/users', 1, true), tab('/dashboard', 2, true), tab('/workbench', 3)],
      activeTabId: '/users'
    }

    const next = toggleWorkspaceTabPin(state, '/users')

    expect(next.tabs.map((item) => item.id)).toEqual(['/dashboard', '/users', '/workbench'])
    expect(next.tabs.find((item) => item.id === '/users')?.pinned).toBe(false)
  })

  it('increments a refresh key without removing the tab', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/users', 1)],
      activeTabId: '/users'
    }

    const refreshed = refreshWorkspaceTab(state, '/users', 10)

    expect(refreshed.tabs).toHaveLength(1)
    expect(refreshed.tabs[0]?.refreshKey).toBe(1)
    expect(refreshed.tabs[0]?.activatedAt).toBe(10)
    expect(refreshed.activeTabId).toBe('/users')
  })

  it('uses the configured close strategy when closing the active tab', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/dashboard', 1), tab('/workbench', 2), tab('/users', 3)],
      activeTabId: '/workbench'
    }

    expect(closeWorkspaceTab(state, '/workbench', 'activate-left').activeTabId).toBe('/dashboard')
    expect(closeWorkspaceTab(state, '/workbench', 'activate-right').activeTabId).toBe('/users')
    expect(closeWorkspaceTab(state, '/workbench', 'activate-nearest').activeTabId).toBe('/users')
  })

  it('keeps activation separate from refresh state', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/dashboard', 1), tab('/users', 2)],
      activeTabId: '/dashboard'
    }

    const activated = activateWorkspaceTab(state, '/users', 20)

    expect(activated.activeTabId).toBe('/users')
    expect(activated.tabs.find((item) => item.id === '/users')?.refreshKey).toBe(0)
  })
})
