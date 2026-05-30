<script setup lang="ts">
import { LayoutDashboard } from 'lucide-vue-next'
import WorkspaceHeader from '@/workspace/WorkspaceHeader.vue'
import WorkspaceTabs from '@/workspace/WorkspaceTabs.vue'
import PrimaryNav from '../PrimaryNav.vue'
import ShellHeader from '../ShellHeader.vue'
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader />
    <div class="grid h-[calc(100vh-3.5rem)] grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
      <aside class="flex min-h-0 flex-col border-r border-[var(--border)] bg-[var(--nav-background)] p-3">
        <div class="mb-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-raised)] p-3 shadow-[var(--panel-shadow)]">
          <div class="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-[var(--primary-foreground)]">
            <LayoutDashboard class="size-5" />
          </div>
          <div class="min-w-0">
            <div class="[font-family:var(--font-display)] text-base">Super Admin</div>
            <div class="truncate text-xs text-[var(--muted-foreground)]">Operator command shell</div>
          </div>
        </div>
        <PrimaryNav />
      </aside>
      <main class="flex min-w-0 flex-col overflow-hidden bg-[var(--surface-sunken)]">
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
  </div>
</template>
