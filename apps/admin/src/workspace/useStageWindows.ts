import type { Component, ComputedRef } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  createWorkspaceTabGroups,
  findActiveModule,
  findModuleRoute,
  type WorkspaceTab
} from '@super-admin-org/core'
import { translateRouteTitle } from '@/i18n/navigation'
import { registeredModules } from '@/modules/module-registry'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'
import { sortStageGroupsForDock } from './stage-manager'
import type { StageGroupView, StageWindowView } from './stage-manager'
import { useStageWindowActivation } from './useStageWindowActivation'

export type StageWindowsContext = {
  activateStage: (path: string, title: string, sourceRect: DOMRect) => Promise<void>
  allWindowStages: ComputedRef<StageWindowView[]>
  closeStage: (tabId: string) => Promise<void>
  closeStageGroup: (group: Pick<StageGroupView, 'tabs'>) => Promise<void>
  createWindowView: (tab: WorkspaceTab) => StageWindowView
  refreshStage: (tabId: string) => void
  stageGroups: ComputedRef<StageGroupView[]>
  toggleStagePin: (tabId: string) => void
}

export function useStageWindows(): StageWindowsContext {
  const route = useRoute()
  const { t } = useI18n()
  const tabs = useWorkspaceTabsStore()
  const { activateStage, closeStage, refreshStage, toggleStagePin } = useStageWindowActivation()
  const activeRoutePath = computed(() => route.fullPath)

  function resolveTabComponent(routePath: string): Component | undefined {
    const module = findActiveModule(registeredModules, routePath)
    const moduleRoute = findModuleRoute(module, routePath)

    return moduleRoute?.component as Component | undefined
  }

  function resolveTabTitle(tab: WorkspaceTab): string {
    return translateRouteTitle(t, tab.routePath, tab.title)
  }

  function createWindowView(tab: WorkspaceTab): StageWindowView {
    return {
      tab,
      component: resolveTabComponent(tab.routePath),
      isActive: tab.routePath === activeRoutePath.value,
      title: resolveTabTitle(tab)
    }
  }

  const allWindowStages = computed<StageWindowView[]>(() =>
    [...tabs.state.tabs].sort((left, right) => right.activatedAt - left.activatedAt).map(createWindowView)
  )
  const stageGroups = computed<StageGroupView[]>(() =>
    sortStageGroupsForDock(
      createWorkspaceTabGroups(tabs.state.tabs, registeredModules).map((group) => ({
        ...group,
        activeTabTitle: resolveTabTitle(group.activeTab),
        component: resolveTabComponent(group.activeTab.routePath),
        isActive: group.tabs.some((tab) => tab.routePath === activeRoutePath.value)
      }))
    )
  )

  async function closeStageGroup(group: Pick<StageGroupView, 'tabs'>): Promise<void> {
    const activeTabId = tabs.state.activeTabId
    if (group.tabs.some((tab) => tab.pinned)) {
      return
    }

    for (const tab of group.tabs) {
      if (tab.id !== activeTabId) {
        await closeStage(tab.id)
      }
    }

    const activeTab = group.tabs.find((tab) => tab.id === activeTabId)
    if (activeTab) {
      await closeStage(activeTab.id)
    }
  }

  return {
    activateStage,
    allWindowStages,
    closeStage,
    closeStageGroup,
    createWindowView,
    refreshStage,
    stageGroups,
    toggleStagePin
  }
}
