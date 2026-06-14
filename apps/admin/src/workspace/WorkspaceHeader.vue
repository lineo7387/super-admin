<script setup lang="ts">
import { ChevronRight, Pin, PinOff, RotateCw } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { findActiveModule } from '@super-admin-org/core'
import { AdminButton } from '@super-admin-org/ui'
import { translateModuleName, translateRouteTitle } from '@/i18n/navigation'
import { registeredModules } from '@/modules/module-registry'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'

const route = useRoute()
const { t } = useI18n()
const tabs = useWorkspaceTabsStore()

const activeTab = computed(() => tabs.activeTab)
const activePath = computed(() => activeTab.value?.routePath ?? route.fullPath)
const activeTitle = computed(() =>
  translateRouteTitle(t, activePath.value, activeTab.value?.title ?? route.meta.workspaceTitle ?? route.meta.title ?? t('workspace.fallbackTitle'))
)
const activeModule = computed(() => findActiveModule(registeredModules, activePath.value))
const activeModuleName = computed(() => translateModuleName(t, activeModule.value, t('workspace.current')))
const isPinned = computed(() => activeTab.value?.pinned ?? false)

function refreshActiveWorkspace(): void {
  if (activeTab.value) {
    tabs.refreshTab(activeTab.value.id)
  }
}

function toggleActivePin(): void {
  if (activeTab.value) {
    tabs.pinTab(activeTab.value.id)
  }
}
</script>

<template>
  <section
    class="flex min-h-12 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3"
  >
    <nav :aria-label="t('workspace.breadcrumbRoot')" class="flex min-w-0 items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
      <span class="shrink-0">{{ t('workspace.breadcrumbRoot') }}</span>
      <ChevronRight class="size-3 shrink-0 opacity-55" />
      <span class="hidden shrink-0 sm:inline">{{ activeModuleName }}</span>
      <ChevronRight class="hidden size-3 shrink-0 opacity-55 sm:block" />
      <span class="truncate font-medium text-[var(--foreground)]">{{ activeTitle }}</span>
    </nav>

    <div class="flex shrink-0 items-center gap-1">
      <AdminButton
        variant="ghost"
        size="sm"
        :disabled="!activeTab"
        :title="isPinned ? t('workspace.unpinCurrent') : t('workspace.pinCurrent')"
        @click="toggleActivePin"
      >
        <PinOff v-if="isPinned" class="size-3.5" />
        <Pin v-else class="size-3.5" />
        <span class="hidden sm:inline">{{ isPinned ? t('workspace.unpin') : t('workspace.pin') }}</span>
      </AdminButton>
      <AdminButton
        variant="secondary"
        size="sm"
        :disabled="!activeTab"
        :title="t('workspace.refreshCurrent')"
        @click="refreshActiveWorkspace"
      >
        <RotateCw class="size-3.5" />
        <span class="hidden sm:inline">{{ t('workspace.refresh') }}</span>
      </AdminButton>
    </div>
  </section>
</template>
