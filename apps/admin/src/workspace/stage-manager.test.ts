import { describe, expect, it } from 'vitest'
import type { WorkspaceTab, WorkspaceTabGroup } from '@super-admin-org/core'
import { resolveOverviewLayout, sortStageGroupsForDock } from './stage-manager'

function createTab(routePath: string, activatedAt: number): WorkspaceTab {
  return {
    id: routePath,
    title: routePath,
    routePath,
    pinned: false,
    keepAlive: { enabled: true },
    refreshKey: 0,
    openedAt: activatedAt,
    activatedAt
  }
}

function createGroup(input: {
  id: string
  activeTab: WorkspaceTab
  tabs?: WorkspaceTab[]
  isActive?: boolean
}): WorkspaceTabGroup & { isActive: boolean } {
  const tabs = input.tabs ?? [input.activeTab]

  return {
    id: input.id,
    label: input.id,
    moduleId: input.id,
    moduleName: input.id,
    routePath: input.activeTab.routePath,
    tabs,
    activeTab: input.activeTab,
    isStacked: tabs.length > 1,
    isActive: input.isActive ?? false
  }
}

describe('stage manager logic', () => {
  it('fits a single overview window into one centered track', () => {
    expect(resolveOverviewLayout(1)).toEqual({
      columns: 1,
      rows: 1,
      cardWidth: '22rem',
      cardHeight: '15rem',
      scale: 0.27
    })
  })

  it('uses compact rows and columns as overview window count grows', () => {
    expect(resolveOverviewLayout(4)).toEqual({
      columns: 2,
      rows: 2,
      cardWidth: '20rem',
      cardHeight: '13rem',
      scale: 0.23
    })
    expect(resolveOverviewLayout(10)).toEqual({
      columns: 4,
      rows: 3,
      cardWidth: '16rem',
      cardHeight: '10rem',
      scale: 0.145
    })
  })

  it('sorts the active dock group before applying the four-slot visual cap', () => {
    const inactiveRecent = createGroup({ id: 'recent', activeTab: createTab('/recent', 30) })
    const inactiveOlder = createGroup({ id: 'older', activeTab: createTab('/older', 20) })
    const activeOld = createGroup({ id: 'active', activeTab: createTab('/active', 10), isActive: true })

    const input = [inactiveOlder, inactiveRecent, activeOld]
    const sorted = sortStageGroupsForDock(input)

    expect(sorted.map((group) => group.id)).toEqual(['active', 'recent', 'older'])
    expect(input.map((group) => group.id)).toEqual(['older', 'recent', 'active'])
  })
})
