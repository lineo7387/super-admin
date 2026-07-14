<script setup lang="ts">
import { AdminScrollArea } from '@super-admin-org/ui'
import WorkspaceHeader from '@/workspace/WorkspaceHeader.vue'
import WorkspaceTabs from '@/workspace/WorkspaceTabs.vue'
import PrimaryNav from '../PrimaryNav.vue'
import ShellAccountMenu from '../ShellAccountMenu.vue'
import ShellHeader from '../ShellHeader.vue'

defineSlots<{
  'header-actions'(): unknown
  workspace(): unknown
}>()
</script>

<template>
  <div data-layout-fallback="neutral" class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader brand="full">
      <template #actions>
        <slot name="header-actions" />
        <ShellAccountMenu variant="header" />
      </template>
    </ShellHeader>
    <div class="flex h-[calc(100vh-3.5rem)] min-w-0 flex-col overflow-hidden">
      <div data-neutral-module-navigation class="border-b border-[var(--border)] bg-[var(--nav-background)] p-2">
        <PrimaryNav class="flex-wrap justify-start" orientation="horizontal" />
      </div>
      <main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--surface-sunken)]">
        <WorkspaceTabs placement="top" />
        <WorkspaceHeader />
        <AdminScrollArea class="flex-1" view-class="p-4">
          <slot name="workspace" />
        </AdminScrollArea>
      </main>
    </div>
  </div>
</template>
