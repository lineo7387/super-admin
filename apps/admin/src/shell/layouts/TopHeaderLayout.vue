<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findActiveModule } from '@super-admin/core'
import { AdminScrollArea } from '@super-admin/ui'
import { registeredModules } from '@/modules/module-registry'
import WorkspaceHeader from '@/workspace/WorkspaceHeader.vue'
import WorkspaceTabs from '@/workspace/WorkspaceTabs.vue'
import PrimaryNav from '../PrimaryNav.vue'
import ShellHeader from '../ShellHeader.vue'

const route = useRoute()
const activeModule = computed(() => findActiveModule(registeredModules, route.path))
const subNavItems = computed(() => activeModule.value?.nav.children ?? [])
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader brand="full" nav="horizontal" :nav-depth="1" />
    <div class="grid h-[calc(100vh-3.5rem)] grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(212px,260px)_minmax(0,1fr)]">
      <aside class="hidden min-h-0 border-r border-[var(--border)] bg-[var(--nav-background)] p-3 lg:block">
        <div class="mb-4 px-1">
          <div class="[font-family:var(--font-display)] text-base text-[var(--foreground)]">{{ activeModule?.name ?? 'Navigation' }}</div>
          <div class="text-xs text-[var(--muted-foreground)]">Template directory</div>
        </div>
        <PrimaryNav v-if="subNavItems.length > 0" :items="subNavItems" :max-depth="2" />
      </aside>
      <main class="flex min-w-0 flex-col overflow-hidden bg-[var(--surface-sunken)]">
        <div v-if="subNavItems.length > 0" class="border-b border-[var(--border)] bg-[var(--nav-background)] p-2 lg:hidden">
          <AdminScrollArea axis="horizontal" view-class="min-w-max">
            <PrimaryNav :items="subNavItems" :max-depth="2" orientation="horizontal" />
          </AdminScrollArea>
        </div>
        <WorkspaceTabs placement="top" />
        <WorkspaceHeader />
        <AdminScrollArea class="flex-1" view-class="grid grid-cols-[minmax(0,1fr)] gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <slot name="workspace" />
          <section class="hidden xl:block">
            <slot name="context" />
          </section>
        </AdminScrollArea>
      </main>
    </div>
  </div>
</template>
