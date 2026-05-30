<script setup lang="ts">
import { usePreferencesStore } from '@/app/preferences.store'
import WorkspaceTabs from '@/workspace/WorkspaceTabs.vue'
import ShellHeader from '../ShellHeader.vue'

const preferences = usePreferencesStore()
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader brand="full" nav="horizontal" />
    <div
      v-if="preferences.workspaceTabs.enabled"
      class="border-b border-[var(--border)] bg-[var(--nav-background)] px-4 py-2"
    >
      <WorkspaceTabs placement="top" />
    </div>
    <main class="min-w-0 overflow-hidden bg-[var(--surface-sunken)]">
      <div
        class="grid grid-cols-[minmax(0,1fr)] gap-4 overflow-auto p-4 xl:grid-cols-[minmax(0,1fr)_320px]"
        :class="preferences.workspaceTabs.enabled ? 'h-[calc(100vh-9.75rem)]' : 'h-[calc(100vh-7.25rem)]'"
      >
        <slot name="workspace" />
        <section class="hidden xl:block">
          <slot name="context" />
        </section>
      </div>
    </main>
  </div>
</template>
