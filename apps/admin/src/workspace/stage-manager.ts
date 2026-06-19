import type { Component } from 'vue'
import type { LayoutPresetId, ShellRegion, WorkspaceTab, WorkspaceTabGroup } from '@super-admin-org/core'

export type StageWindowPreviewTab = {
  active: boolean
  id: string
  pinned: boolean
  routePath: string
  title: string
}

export type StageWindowPreviewModel = {
  description: string
  layoutPreset: LayoutPresetId
  moduleName: string
  regions: ShellRegion[]
  routePath: string
  tabs: StageWindowPreviewTab[]
  title: string
}

export type StageWindowView = {
  component: Component | undefined
  isActive: boolean
  preview: StageWindowPreviewModel
  tab: WorkspaceTab
  title: string
}

export type StageGroupView = WorkspaceTabGroup & {
  activeTabTitle: string
  component: Component | undefined
  isActive: boolean
  preview: StageWindowPreviewModel
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

export function resolveOverviewLayout(count: number): StageOverviewLayout {
  const windowCount = Math.max(count, 1)
  const preferredColumns =
    windowCount === 1
      ? 1
      : windowCount <= 4
        ? Math.ceil(Math.sqrt(windowCount))
        : Math.max(1, Math.ceil(Math.sqrt(windowCount * 1.25)))
  const columns = preferredColumns
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
