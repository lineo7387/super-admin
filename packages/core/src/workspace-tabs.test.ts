import { describe, expect, it } from 'vitest'
import type { KeepAlivePolicy } from './shell'
import {
  activateWorkspaceTab,
  closeWorkspaceTab,
  createWorkspaceTab,
  createWorkspaceTabGroups,
  refreshWorkspaceTab,
  toggleWorkspaceTabPin,
  type WorkspaceTabsState
} from './workspace-tabs'
import type { ModuleManifest } from './module'

const keepAlive: KeepAlivePolicy = { enabled: true, cacheKey: 'demo' }

const examplesManifest: ModuleManifest = {
  id: 'examples',
  name: 'Examples',
  nav: {
    label: 'Examples',
    path: '/examples/template-guide',
    children: [
      { label: 'Dashboard', path: '/examples/dashboard' },
      {
        label: 'Users',
        path: '/examples/users/all',
        children: [
          { label: 'All Users', path: '/examples/users/all' },
          { label: 'Pending Review', path: '/examples/users/pending-review' },
          { label: 'Invites', path: '/examples/users/invites' },
          { label: 'Activity', path: '/examples/users/activity' }
        ]
      },
      { label: 'Access', path: '/examples/access' }
    ]
  },
  routes: []
}

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

  it('groups workspace tabs by module section and selects the most recently active tab', () => {
    const state: WorkspaceTabsState = {
      tabs: [tab('/examples/dashboard', 1), tab('/examples/users/all', 2), tab('/examples/users/pending-review', 3), tab('/examples/users/invites', 4)],
      activeTabId: '/examples/users/invites'
    }
    state.tabs[1]!.activatedAt = 20
    state.tabs[2]!.activatedAt = 60
    state.tabs[3]!.activatedAt = 40

    const groups = createWorkspaceTabGroups(state.tabs, [examplesManifest])

    const usersGroup = groups.find((group) => group.label === 'Users')
    expect(usersGroup?.tabs.map((item) => item.id)).toEqual(['/examples/users/all', '/examples/users/pending-review', '/examples/users/invites'])
    expect(usersGroup?.isStacked).toBe(true)
    expect(usersGroup?.activeTab.id).toBe('/examples/users/pending-review')
    expect(groups.find((group) => group.label === 'Dashboard')?.isStacked).toBe(false)
  })
})
