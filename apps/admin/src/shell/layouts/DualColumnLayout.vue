<script setup lang="ts">
import { LayoutDashboard } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader>
      <template #actions>
        <slot name="header-actions" />
      </template>
    </ShellHeader>
    <div class="grid h-[calc(100vh-3.5rem)] grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
      <aside class="flex min-h-0 flex-col border-r border-[var(--border)] bg-[var(--nav-background)] p-3">
        <div
          class="mb-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-raised)] p-3 shadow-[var(--panel-shadow)]"
        >
          <div class="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-[var(--primary-foreground)]">
            <LayoutDashboard class="size-5" />
          </div>
          <div class="min-w-0">
            <div class="[font-family:var(--font-display)] text-base">Super Admin</div>
            <div class="truncate text-xs text-[var(--muted-foreground)]">{{ t('shell.navigation.operatorShell') }}</div>
          </div>
        </div>
        <PrimaryNav />
        <div class="mt-auto pt-4">
          <ShellAccountMenu variant="sidebar" />
        </div>
      </aside>
      <main class="flex min-w-0 flex-col overflow-hidden bg-[var(--surface-sunken)]">
        <WorkspaceTabs placement="top" />
        <WorkspaceHeader />
        <AdminScrollArea class="flex-1" view-class="p-4">
          <slot name="workspace" />
        </AdminScrollArea>
      </main>
    </div>
  </div>
</template>
