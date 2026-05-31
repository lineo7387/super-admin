<script setup lang="ts">
import { ChevronRight, Pin, PinOff, RotateCw } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findActiveModule } from '@super-admin/core'
import { AdminButton } from '@super-admin/ui'
import { registeredModules } from '@/modules/module-registry'
import { useWorkspaceTabsStore } from './workspace-tabs.store'

const route = useRoute()
const tabs = useWorkspaceTabsStore()

const activeTab = computed(() => tabs.activeTab)
const activePath = computed(() => activeTab.value?.routePath ?? route.fullPath)
const activeTitle = computed(() => activeTab.value?.title ?? route.meta.workspaceTitle ?? route.meta.title ?? 'Workspace')
const activeModule = computed(() => findActiveModule(registeredModules, activePath.value))
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
    <nav aria-label="Workspace breadcrumb" class="flex min-w-0 items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
      <span class="shrink-0">Workspace</span>
      <ChevronRight class="size-3 shrink-0 opacity-55" />
      <span class="hidden shrink-0 sm:inline">{{ activeModule?.name ?? 'Current' }}</span>
      <ChevronRight class="hidden size-3 shrink-0 opacity-55 sm:block" />
      <span class="truncate font-medium text-[var(--foreground)]">{{ activeTitle }}</span>
    </nav>

    <div class="flex shrink-0 items-center gap-1">
      <AdminButton
        variant="ghost"
        size="sm"
        :disabled="!activeTab"
        :title="isPinned ? 'Unpin current workspace' : 'Pin current workspace'"
        @click="toggleActivePin"
      >
        <PinOff v-if="isPinned" class="size-3.5" />
        <Pin v-else class="size-3.5" />
        <span class="hidden sm:inline">{{ isPinned ? 'Unpin' : 'Pin' }}</span>
      </AdminButton>
      <AdminButton
        variant="secondary"
        size="sm"
        :disabled="!activeTab"
        title="Refresh current workspace"
        @click="refreshActiveWorkspace"
      >
        <RotateCw class="size-3.5" />
        <span class="hidden sm:inline">Refresh</span>
      </AdminButton>
    </div>
  </section>
</template>
