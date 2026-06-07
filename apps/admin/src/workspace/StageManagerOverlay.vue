<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Component } from 'vue'
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { createWorkspaceTabGroups, findActiveModule, findModuleRoute } from '@super-admin-org/core'
import { AdminButton } from '@super-admin-org/ui'
import { translateRouteTitle } from '@/i18n/navigation'
import { usePreferencesStore } from '@/stores/preferences.store'
import { registeredModules } from '@/modules/module-registry'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'
import { resolveNextGroupWindow, resolveOverviewLayout, sortStageGroupsForDock } from './stage-manager'
import type { StageGroupView, StageWindowView } from './stage-manager'
import StageDockPanel from './StageDockPanel.vue'
import StageOverviewCard from './StageOverviewCard.vue'

const preferences = usePreferencesStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const tabs = useWorkspaceTabsStore()
const activeWindowGroupId = shallowRef<string | null>(null)
const stageViewportWidth = shallowRef(1024)

const stageGroups = computed<StageGroupView[]>(() =>
  sortStageGroupsForDock(
    createWorkspaceTabGroups(tabs.state.tabs, registeredModules).map((group) => {
      const module = findActiveModule(registeredModules, group.activeTab.routePath)
      const moduleRoute = findModuleRoute(module, group.activeTab.routePath)
      const isActive = group.tabs.some((tab) => tab.routePath === route.fullPath)

      return {
        ...group,
        activeTabTitle: translateRouteTitle(t, group.activeTab.routePath, group.activeTab.title),
        component: moduleRoute?.component as Component | undefined,
        isActive
      }
    })
  )
)
const activeWindowGroup = computed(() =>
  activeWindowGroupId.value ? stageGroups.value.find((group) => group.id === activeWindowGroupId.value) ?? null : null
)
const windowStages = computed<StageWindowView[]>(() =>
  (activeWindowGroup.value?.tabs ?? []).map((tab) => ({
    tab,
    component: resolveTabComponent(tab.routePath),
    isActive: tab.routePath === route.fullPath,
    title: translateRouteTitle(t, tab.routePath, tab.title)
  }))
)
const allWindowStages = computed<StageWindowView[]>(() =>
  [...tabs.state.tabs]
    .sort((left, right) => right.activatedAt - left.activatedAt)
    .map((tab) => ({
      tab,
      component: resolveTabComponent(tab.routePath),
      isActive: tab.routePath === route.fullPath,
      title: translateRouteTitle(t, tab.routePath, tab.title)
    }))
)
const overviewGridStyle = computed<Record<string, string>>(() => {
  const layout = resolveOverviewLayout(allWindowStages.value.length, stageViewportWidth.value)

  return {
    '--stage-overview-columns': String(layout.columns),
    '--stage-overview-rows': String(layout.rows),
    '--stage-overview-card-width': layout.cardWidth,
    '--stage-overview-card-height': layout.cardHeight,
    '--stage-overview-scale': String(layout.scale)
  }
})

function syncStageViewportWidth(): void {
  stageViewportWidth.value = window.innerWidth
}

onMounted(() => {
  syncStageViewportWidth()
  window.addEventListener('resize', syncStageViewportWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', syncStageViewportWidth)
})

function closeStageManager(): void {
  activeWindowGroupId.value = null
  preferences.closeStageManager()
}

function closeAllWindowsOnBackdrop(): void {
  if (preferences.stageManager.presentationMode !== 'all-windows') {
    return
  }

  closeStageManager()
}

function resolveTabComponent(routePath: string): Component | undefined {
  const module = findActiveModule(registeredModules, routePath)
  const moduleRoute = findModuleRoute(module, routePath)

  return moduleRoute?.component as Component | undefined
}

function activateStage(path: string): void {
  activeWindowGroupId.value = null
  tabs.activateTab(path)
  closeStageManager()
  void router.push(path)
}

function activateStageGroup(groupId: string): void {
  const group = stageGroups.value.find((item) => item.id === groupId)
  if (!group) {
    return
  }

  activateStage(resolveNextGroupWindow(group, route.fullPath).routePath)
}

function enterWindowGroup(groupId: string): void {
  activeWindowGroupId.value = groupId
}

function exitWindowGroup(): void {
  activeWindowGroupId.value = null
}

function closeStage(tabId: string): void {
  const next = tabs.closeTab(tabId)
  if (route.fullPath === tabId && next) {
    void router.push(next.routePath)
    return
  }

  if (route.fullPath === tabId) {
    void router.push('/examples/dashboard')
  }
}

function toggleStagePin(tabId: string): void {
  tabs.pinTab(tabId)
}

function refreshStage(tabId: string): void {
  tabs.refreshTab(tabId)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="preferences.stageManager.enabled && preferences.stageManagerOpen"
      class="stage-layer fixed inset-0 z-[75] pointer-events-auto"
      @keydown.esc="closeStageManager"
    >
      <section
        class="relative h-full w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-manager-title"
        @click="closeAllWindowsOnBackdrop"
      >
        <div v-if="preferences.stageManager.presentationMode === 'side-dock'" class="stage-side-mask" aria-hidden="true" />
        <div v-else-if="preferences.stageManager.presentationMode === 'all-windows'" class="stage-all-windows-mask" aria-hidden="true" />

        <header
          class="pointer-events-none absolute left-7 top-6 z-20 max-w-sm"
          :class="preferences.stageManager.presentationMode === 'all-windows' ? 'stage-header--muted' : ''"
        >
          <div>
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">{{ t('workspace.stage.title') }}</div>
            <h2 id="stage-manager-title" class="mt-1 [font-family:var(--font-display)] text-lg text-[var(--foreground)]">
              {{ t('workspace.stage.openWorkspaces') }}
            </h2>
          </div>
        </header>

        <AdminButton
          v-if="preferences.stageManager.presentationMode !== 'all-windows'"
          variant="secondary"
          size="icon"
          class="pointer-events-auto absolute left-[13.75rem] top-6 z-30 shadow-[var(--panel-shadow)]"
          :title="t('workspace.stage.close')"
          @click.stop="closeStageManager"
        >
          <X class="size-4" />
        </AdminButton>

        <StageDockPanel
          v-if="preferences.stageManager.presentationMode === 'side-dock'"
          :active-window-group="activeWindowGroup"
          :labels="{
            backToGroups: t('workspace.stage.backToGroups'),
            closeStage: t('workspace.stage.closeStage'),
            current: t('workspace.stage.current'),
            enterGroupWindows: t('workspace.stage.enterGroupWindows'),
            pin: t('workspace.stage.pin'),
            pinned: t('workspace.stage.pinned'),
            previewUnavailable: t('workspace.stage.previewUnavailable'),
            refresh: t('workspace.stage.refresh'),
            stages: t('workspace.stage.stages'),
            unpin: t('workspace.stage.unpin'),
            windows: t('workspace.stage.windows')
          }"
          :stage-groups="stageGroups"
          :window-stages="windowStages"
          @activate-group="activateStageGroup"
          @activate-window="activateStage"
          @close-window="closeStage"
          @enter-group="enterWindowGroup"
          @exit-group="exitWindowGroup"
          @refresh-window="refreshStage"
          @toggle-pin="toggleStagePin"
        />

        <div
          v-else-if="preferences.stageManager.presentationMode === 'all-windows'"
          class="stage-overview-grid"
          :style="overviewGridStyle"
          :aria-label="t('workspace.stage.stages')"
        >
          <StageOverviewCard
            v-for="stage in allWindowStages"
            :key="stage.tab.id"
            :active="stage.isActive"
            :close-label="t('workspace.stage.closeStage')"
            :component="stage.component"
            :current-label="t('workspace.stage.current')"
            :pin-label="t('workspace.stage.pin')"
            :pinned="stage.tab.pinned"
            :preview-unavailable-label="t('workspace.stage.previewUnavailable')"
            :refresh-label="t('workspace.stage.refresh')"
            :route-path="stage.tab.routePath"
            :title="stage.title"
            :unpin-label="t('workspace.stage.unpin')"
            @activate="activateStage(stage.tab.routePath)"
            @close="closeStage(stage.tab.id)"
            @refresh="refreshStage(stage.tab.id)"
            @toggle-pin="toggleStagePin(stage.tab.id)"
          />
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.stage-layer {
  --stage-side-mask-width: 17rem;
  --stage-dock-width: 12.6rem;

  background: transparent;
  perspective: 1400px;
}

.stage-side-mask {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 0;
  width: var(--stage-side-mask-width);
  pointer-events: none;
  border-right: 1px solid color-mix(in srgb, var(--border-strong) 70%, transparent);
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--app-background) 44%, transparent) 0%,
      color-mix(in srgb, var(--app-background) 28%, transparent) 68%,
      transparent 100%
    );
  backdrop-filter: blur(8px);
}

.stage-all-windows-mask {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: color-mix(in srgb, var(--app-background) 18%, transparent);
  backdrop-filter: blur(16px);
}

.stage-header--muted {
  opacity: 0.48;
}

.stage-overview-grid {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(var(--stage-overview-columns), minmax(0, var(--stage-overview-card-width)));
  grid-template-rows: repeat(var(--stage-overview-rows), minmax(0, var(--stage-overview-card-height)));
  place-content: center;
  justify-content: center;
  align-content: center;
  align-items: stretch;
  justify-items: stretch;
  gap: clamp(0.65rem, 1.4vw, 1.35rem);
  overflow: hidden;
  padding: clamp(5.5rem, 7vh, 7rem) clamp(2rem, 4vw, 4.5rem);
}

@media (max-width: 760px) {
  .stage-layer {
    --stage-side-mask-width: 12rem;
    --stage-dock-width: 10rem;
  }
}
</style>
