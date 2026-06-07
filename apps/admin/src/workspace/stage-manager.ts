import type { Component } from 'vue'
import type { WorkspaceTab, WorkspaceTabGroup } from '@super-admin-org/core'

export type StageWindowView = {
  component: Component | undefined
  isActive: boolean
  tab: WorkspaceTab
  title: string
}

export type StageGroupView = WorkspaceTabGroup & {
  activeTabTitle: string
  component: Component | undefined
  isActive: boolean
}

export type StageOverviewLayout = {
  columns: number
  rows: number
  cardWidth: string
  cardHeight: string
  scale: number
}

type SortableStageGroup = {
  isActive: boolean
  activeTab: Pick<WorkspaceTab, 'activatedAt'>
}

export function resolveOverviewLayout(count: number, viewportWidth = Number.POSITIVE_INFINITY): StageOverviewLayout {
  const windowCount = Math.max(count, 1)
  const preferredColumns =
    windowCount === 1
      ? 1
      : windowCount <= 4
        ? Math.ceil(Math.sqrt(windowCount))
        : Math.max(1, Math.ceil(Math.sqrt(windowCount * 1.25)))
  const columns = viewportWidth <= 760 && windowCount > 4 ? Math.min(preferredColumns, 3) : preferredColumns
  const rows = Math.max(1, Math.ceil(windowCount / columns))
  const cardWidth = windowCount <= 2 ? '22rem' : windowCount <= 4 ? '20rem' : windowCount <= 9 ? '18rem' : '16rem'
  const cardHeight = windowCount <= 2 ? '15rem' : windowCount <= 4 ? '13rem' : windowCount <= 9 ? '11.5rem' : '10rem'
  const scale = windowCount <= 2 ? 0.27 : windowCount <= 4 ? 0.23 : windowCount <= 6 ? 0.2 : windowCount <= 9 ? 0.17 : 0.145

  return { columns, rows, cardWidth, cardHeight, scale }
}

export function sortStageGroupsForDock<T extends SortableStageGroup>(groups: readonly T[]): T[] {
  return [...groups].sort((left, right) => {
    const activeDelta = Number(right.isActive) - Number(left.isActive)
    if (activeDelta !== 0) {
      return activeDelta
    }

    return right.activeTab.activatedAt - left.activeTab.activatedAt
  })
}

export function resolveNextGroupWindow(
  group: Pick<WorkspaceTabGroup, 'activeTab' | 'isStacked' | 'tabs'>,
  currentRoutePath: string
): WorkspaceTab {
  if (!group.isStacked || !group.tabs.some((tab) => tab.routePath === currentRoutePath)) {
    return group.activeTab
  }

  const recentWindows = [...group.tabs].sort((left, right) => right.activatedAt - left.activatedAt)
  return recentWindows.find((tab) => tab.routePath !== currentRoutePath) ?? group.activeTab
}
