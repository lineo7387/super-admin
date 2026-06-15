<script setup lang="ts">
import { Settings2 } from '@lucide/vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdminButton } from '@super-admin-org/ui'
import { usePreferencesStore } from '@/stores/preferences.store'
import { translateRouteTitle } from '@/i18n/navigation'
import StageOverview from '@/workspace/StageOverview.vue'
import StageRail from '@/workspace/StageRail.vue'
import StageTransitionGhost from '@/workspace/StageTransitionGhost.vue'
import WorkspaceRouterView from '@/workspace/WorkspaceRouterView.vue'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'
import AiAssistantFloatingPanel from './AiAssistantFloatingPanel.vue'
import DualColumnLayout from './layouts/DualColumnLayout.vue'
import TopHeaderLayout from './layouts/TopHeaderLayout.vue'
import TriColumnLayout from './layouts/TriColumnLayout.vue'
import GlobalPreferences from './preferences/GlobalPreferences.vue'
import { useShellShortcuts } from './shell-shortcuts'

const route = useRoute()
const { t } = useI18n()
const preferences = usePreferencesStore()
const tabs = useWorkspaceTabsStore()

useShellShortcuts()

const activeLayout = computed(() => {
  if (preferences.layoutPreset === 'dual-column') {
    return DualColumnLayout
  }
  if (preferences.layoutPreset === 'top-header') {
    return TopHeaderLayout
  }
  return TriColumnLayout
})
const showStageRail = computed(
  () => preferences.stageManagerDesktopAvailable && preferences.stageManager.railEnabled && tabs.state.tabs.length > 1
)

function openControlCenter(): void {
  preferences.openControlCenter()
}

watch(
  () => route.fullPath,
  () => {
    if (!route.name || !route.meta.title) {
      return
    }

    tabs.openTab({
      title: translateRouteTitle(t, route.path, route.meta.workspaceTitle ?? route.meta.title),
      routePath: route.fullPath,
      keepAlive: route.meta.keepAlive ?? { enabled: true }
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="stage-shell-frame" :data-stage-rail-open="showStageRail">
    <Transition name="stage-rail-shell">
      <StageRail v-if="showStageRail" />
    </Transition>
    <div class="stage-shell-frame__app">
      <component :is="activeLayout">
        <template #workspace>
          <WorkspaceRouterView />
        </template>
      </component>
    </div>
  </div>
  <AdminButton
    variant="secondary"
    size="icon"
    class="fixed right-4 top-1/2 z-[64] -translate-y-1/2 shadow-[var(--panel-shadow)]"
    :title="t('shell.preferences.title')"
    @click="openControlCenter"
  >
    <Settings2 class="size-4" />
  </AdminButton>
  <AiAssistantFloatingPanel />
  <StageOverview />
  <StageTransitionGhost />
  <GlobalPreferences trigger="none" />
</template>

<style scoped>
.stage-shell-frame {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1fr);
  background: var(--app-background);
  transition: grid-template-columns 300ms var(--easing);
}

.stage-shell-frame[data-stage-rail-open="true"] {
  grid-template-columns: 14rem minmax(0, 1fr);
}

.stage-shell-frame__app {
  min-width: 0;
}

.stage-rail-shell-enter-active,
.stage-rail-shell-leave-active {
  transition:
    opacity 300ms var(--easing),
    transform 300ms var(--easing);
}

.stage-rail-shell-enter-from,
.stage-rail-shell-leave-to {
  opacity: 0;
  transform: translateX(-0.75rem);
}

@media (max-width: 1279px) {
  .stage-shell-frame,
  .stage-shell-frame[data-stage-rail-open="true"] {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
