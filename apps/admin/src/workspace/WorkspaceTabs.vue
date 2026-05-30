<script setup lang="ts">
import { Pin, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePreferencesStore } from '@/app/preferences.store'
import { useWorkspaceTabsStore } from './workspace-tabs.store'

withDefaults(
  defineProps<{
    placement?: 'top'
  }>(),
  {
    placement: 'top'
  }
)

const route = useRoute()
const router = useRouter()
const tabs = useWorkspaceTabsStore()
const preferences = usePreferencesStore()

const visibleTabs = computed(() => tabs.state.tabs)

function activate(path: string): void {
  tabs.activateTab(path)
  void router.push(path)
}

function close(tabId: string): void {
  const next = tabs.closeTab(tabId)
  if (route.fullPath === tabId && next) {
    void router.push(next.routePath)
    return
  }

  if (route.fullPath === tabId) {
    void router.push('/dashboard')
  }
}

</script>

<template>
  <div
    v-if="preferences.workspaceTabs.enabled"
    class="flex h-11 items-center gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--surface-sunken)] px-2"
  >
    <div
      v-for="tab in visibleTabs"
      :key="tab.id"
      class="group inline-flex h-8 max-w-56 shrink-0 items-center rounded-[var(--radius-sm)] border text-xs transition"
      :class="tab.routePath === route.fullPath ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'border-[var(--border)] bg-[var(--tab-background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2 px-2 text-left outline-none focus-visible:shadow-[var(--focus-ring)]"
        @click="activate(tab.routePath)"
      >
        <Pin v-if="tab.pinned" class="size-3" />
        <span class="truncate">{{ tab.title }}</span>
      </button>
      <button
        v-if="!tab.pinned"
        type="button"
        class="mr-1 grid size-4 place-items-center rounded-[var(--radius-xs)] text-[var(--muted-foreground)] opacity-60 transition hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)] group-hover:opacity-100 focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
        title="Close workspace tab"
        @click.stop="close(tab.id)"
      >
        <X class="size-2.5" />
      </button>
    </div>
  </div>
</template>
