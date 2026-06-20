import type { Component, ComputedRef } from 'vue'
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  createWorkspaceTabGroups,
  findActiveModule,
  findModuleRoute,
  type ModuleRouteComponent,
  type WorkspaceTab
} from '@super-admin-org/core'
import { translateModuleName, translateRouteDescription, translateRouteTitle } from '@/i18n/navigation'
import { registeredModules } from '@/modules/module-registry'
import { usePreferencesStore } from '@/stores/preferences.store'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'
import { sortStageGroupsForDock } from './stage-manager'
import type { StageGroupView, StageWindowPreviewModel, StageWindowPreviewTab, StageWindowView } from './stage-manager'
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
  const preferences = usePreferencesStore()
  const tabs = useWorkspaceTabsStore()
  const { activateStage, closeStage, refreshStage, toggleStagePin } = useStageWindowActivation()
  const activeRoutePath = computed(() => route.fullPath)

  function createPreviewTab(tab: WorkspaceTab, activeTab: WorkspaceTab): StageWindowPreviewTab {
    return {
      active: tab.id === activeTab.id,
      id: tab.id,
      pinned: tab.pinned,
      routePath: tab.routePath,
      title: resolveTabTitle(tab)
    }
  }

  function createPreviewTabs(sourceTabs: readonly WorkspaceTab[], activeTab: WorkspaceTab): StageWindowPreviewTab[] {
    return [...sourceTabs]
      .sort((left, right) => {
        const activeDelta = Number(right.id === activeTab.id) - Number(left.id === activeTab.id)
        if (activeDelta !== 0) {
          return activeDelta
        }

        return right.activatedAt - left.activatedAt
      })
      .slice(0, 4)
      .map((tab) => createPreviewTab(tab, activeTab))
  }

  function createWindowPreview(tab: WorkspaceTab, groupTabs: readonly WorkspaceTab[] = [tab]): StageWindowPreviewModel {
    const module = findActiveModule(registeredModules, tab.routePath)
    const moduleRoute = findModuleRoute(module, tab.routePath)

    return {
      description: translateRouteDescription(t, moduleRoute?.path ?? tab.routePath, moduleRoute?.meta.description ?? tab.routePath),
      layoutPreset: preferences.layoutPreset,
      moduleName: translateModuleName(t, module, t('workspace.current')),
      regions: moduleRoute?.meta.regions ?? ['primary'],
      routePath: tab.routePath,
      tabs: createPreviewTabs(groupTabs, tab),
      title: resolveTabTitle(tab)
    }
  }

  function resolveTabTitle(tab: WorkspaceTab): string {
    return translateRouteTitle(t, tab.routePath, tab.title)
  }

  function resolveRouteComponent(routeComponent: ModuleRouteComponent | undefined): Component | undefined {
    if (!routeComponent) {
      return undefined
    }

    if (typeof routeComponent === 'function') {
      const loader = routeComponent as () => Promise<Component>
      return defineAsyncComponent(loader)
    }

    return routeComponent as Component
  }

  function resolveTabComponent(routePath: string): Component | undefined {
    const module = findActiveModule(registeredModules, routePath)
    const moduleRoute = findModuleRoute(module, routePath)

    return resolveRouteComponent(moduleRoute?.component)
  }

  function createWindowView(tab: WorkspaceTab): StageWindowView {
    return {
      tab,
      component: resolveTabComponent(tab.routePath),
      isActive: tab.routePath === activeRoutePath.value,
      preview: createWindowPreview(tab),
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
        isActive: group.tabs.some((tab) => tab.routePath === activeRoutePath.value),
        preview: createWindowPreview(group.activeTab, group.tabs)
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
