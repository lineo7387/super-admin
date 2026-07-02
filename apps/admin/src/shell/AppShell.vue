<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/stores/preferences.store'
import { translateRouteTitle } from '@/i18n/navigation'
import StageOverview from '@/workspace/StageOverview.vue'
import StageRail from '@/workspace/StageRail.vue'
import StageTransitionGhost from '@/workspace/StageTransitionGhost.vue'
import WorkspaceRouterView from '@/workspace/WorkspaceRouterView.vue'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'
import AiAssistantFloatingPanel from './AiAssistantFloatingPanel.vue'
import CommandPalette from './CommandPalette.vue'
import DualColumnLayout from './layouts/DualColumnLayout.vue'
import TopHeaderLayout from './layouts/TopHeaderLayout.vue'
import TriColumnLayout from './layouts/TriColumnLayout.vue'
import GlobalPreferences from './preferences/GlobalPreferences.vue'
import GlobalPreferencesTrigger from './preferences/GlobalPreferencesTrigger.vue'
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
const showStageRail = computed(() => preferences.stageManagerDesktopAvailable && preferences.stageManager.railEnabled && tabs.state.tabs.length > 1)
const controlCenterLabel = computed(() => t('shell.preferences.title'))

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
    <div v-if="preferences.stageManagerDesktopAvailable" class="stage-rail-shell" :aria-hidden="!showStageRail" :inert="!showStageRail">
      <StageRail />
    </div>
    <div class="stage-shell-frame__app">
      <component :is="activeLayout">
        <template #header-actions>
          <GlobalPreferencesTrigger animated-label :label="controlCenterLabel" :title="controlCenterLabel" @activate="openControlCenter" />
        </template>
        <template #workspace>
          <WorkspaceRouterView />
        </template>
      </component>
    </div>
  </div>
  <AiAssistantFloatingPanel />
  <CommandPalette :open="preferences.commandPaletteOpen" @close="preferences.closeCommandPalette()" />
  <StageOverview />
  <StageTransitionGhost />
  <GlobalPreferences trigger="none" />
</template>

<style scoped>
.stage-shell-frame {
  --stage-rail-width: 12rem;

  display: grid;
  position: relative;
  min-height: 100vh;
  grid-template-columns: 0rem minmax(0, 1fr);
  overflow-x: clip;
  background: var(--app-background);
  transition: grid-template-columns 300ms var(--easing);
}

.stage-shell-frame[data-stage-rail-open='true'] {
  grid-template-columns: var(--stage-rail-width) minmax(0, 1fr);
}

.stage-shell-frame__app {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
}

.stage-rail-shell {
  grid-column: 1;
  grid-row: 1;
  width: var(--stage-rail-width);
  min-height: 100vh;
  min-width: 0;
  overflow: visible;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-100%);
  transition:
    opacity 300ms var(--easing),
    transform 300ms var(--easing);
  will-change: opacity, transform;
}

.stage-shell-frame[data-stage-rail-open='true'] .stage-rail-shell {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
}

@media (max-width: 1279px) {
  .stage-shell-frame,
  .stage-shell-frame[data-stage-rail-open='true'] {
    grid-template-columns: 0rem minmax(0, 1fr);
  }
}
</style>
