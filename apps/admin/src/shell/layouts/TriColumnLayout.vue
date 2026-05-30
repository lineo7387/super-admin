<script setup lang="ts">
import { usePreferencesStore } from '@/app/preferences.store'
import WorkspaceTabs from '@/workspace/WorkspaceTabs.vue'
import PrimaryNav from '../PrimaryNav.vue'
import ShellHeader from '../ShellHeader.vue'

const preferences = usePreferencesStore()
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader />
    <div class="grid h-[calc(100vh-3.5rem)] grid-cols-[72px_minmax(168px,220px)_minmax(0,1fr)] xl:grid-cols-[72px_minmax(168px,220px)_minmax(0,1fr)_minmax(280px,340px)]">
      <div class="flex flex-col items-center gap-4 border-r border-[var(--border)] bg-[var(--nav-background)] p-3">
        <div
          aria-label="Super Admin logo"
          class="relative grid size-12 place-items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--glow)]"
          title="Super Admin"
        >
          <span class="[font-family:var(--font-display)] text-base font-black">SA</span>
          <span class="absolute -right-3 top-1 h-px w-10 rotate-45 bg-[var(--primary-foreground)] opacity-40" />
        </div>
        <div class="mt-2 grid gap-2">
          <span class="h-10 w-px bg-[var(--border-strong)]" />
          <span class="size-2 rounded-full bg-[var(--primary)] shadow-[var(--glow)]" />
          <span class="h-10 w-px bg-[var(--border)]" />
        </div>
      </div>
      <aside class="min-w-0 border-r border-[var(--border)] bg-[var(--nav-background)] p-3">
        <div class="mb-4 px-1">
          <div class="[font-family:var(--font-display)] text-base text-[var(--foreground)]">Super Admin</div>
          <div class="text-xs text-[var(--muted-foreground)]">Module command rail</div>
        </div>
        <PrimaryNav />
      </aside>
      <main class="min-w-0 overflow-hidden bg-[var(--surface-sunken)]">
        <WorkspaceTabs placement="top" />
        <div
          class="overflow-auto p-4"
          :class="preferences.workspaceTabs.enabled ? 'h-[calc(100%-2.75rem)]' : 'h-full'"
        >
          <slot name="workspace" />
        </div>
      </main>
      <section class="hidden border-l border-[var(--border)] bg-[var(--context-background)] xl:block">
        <slot name="context" />
      </section>
    </div>
  </div>
</template>
