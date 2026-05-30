<script setup lang="ts">
import WorkspaceHeader from '@/workspace/WorkspaceHeader.vue'
import WorkspaceTabs from '@/workspace/WorkspaceTabs.vue'
import ShellHeader from '../ShellHeader.vue'
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader brand="full" nav="horizontal" />
    <main class="flex h-[calc(100vh-3.5rem)] min-w-0 flex-col overflow-hidden bg-[var(--surface-sunken)]">
      <WorkspaceTabs placement="top" />
      <WorkspaceHeader />
      <div class="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] gap-4 overflow-auto p-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <slot name="workspace" />
        <section class="hidden xl:block">
          <slot name="context" />
        </section>
      </div>
    </main>
  </div>
</template>
