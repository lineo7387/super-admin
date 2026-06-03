<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences.store'
import StageManagerOverlay from '@/workspace/StageManagerOverlay.vue'
import WorkspaceRouterView from '@/workspace/WorkspaceRouterView.vue'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'
import AiAssistantFloatingPanel from './AiAssistantFloatingPanel.vue'
import DualColumnLayout from './layouts/DualColumnLayout.vue'
import TopHeaderLayout from './layouts/TopHeaderLayout.vue'
import TriColumnLayout from './layouts/TriColumnLayout.vue'
import GlobalPreferences from './preferences/GlobalPreferences.vue'
import { useShellShortcuts } from './shell-shortcuts'

const route = useRoute()
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

watch(
  () => route.fullPath,
  () => {
    if (!route.name || !route.meta.title) {
      return
    }

    tabs.openTab({
      title: route.meta.workspaceTitle ?? route.meta.title,
      routePath: route.fullPath,
      keepAlive: route.meta.keepAlive ?? { enabled: true }
    })
  },
  { immediate: true }
)
</script>

<template>
  <component :is="activeLayout">
    <template #workspace>
      <WorkspaceRouterView />
    </template>
  </component>
  <AiAssistantFloatingPanel />
  <StageManagerOverlay />
  <GlobalPreferences trigger="none" />
</template>
