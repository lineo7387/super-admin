<script setup lang="ts">
import { Settings2 } from 'lucide-vue-next'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdminButton } from '@super-admin-org/ui'
import { usePreferencesStore } from '@/stores/preferences.store'
import { translateRouteTitle } from '@/i18n/navigation'
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
  <component :is="activeLayout">
    <template #workspace>
      <WorkspaceRouterView />
    </template>
  </component>
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
  <StageManagerOverlay />
  <GlobalPreferences trigger="none" />
</template>
