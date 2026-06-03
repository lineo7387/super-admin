<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { findActiveModule } from '@super-admin/core'
import { AdminScrollArea } from '@super-admin/ui'
import { translateModuleName } from '@/i18n/navigation'
import { registeredModules } from '@/modules/module-registry'
import WorkspaceHeader from '@/workspace/WorkspaceHeader.vue'
import WorkspaceTabs from '@/workspace/WorkspaceTabs.vue'
import PrimaryNav from '../PrimaryNav.vue'
import ShellAccountMenu from '../ShellAccountMenu.vue'
import ShellHeader from '../ShellHeader.vue'

const route = useRoute()
const { t } = useI18n()
const activeModule = computed(() => findActiveModule(registeredModules, route.path))
const subNavItems = computed(() => activeModule.value?.nav.children ?? [])
const activeModuleName = computed(() => translateModuleName(t, activeModule.value, t('shell.navigation.fallback')))
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader brand="full" nav="horizontal" :nav-depth="1">
      <template #actions>
        <ShellAccountMenu variant="header" />
      </template>
    </ShellHeader>
    <div class="grid h-[calc(100vh-3.5rem)] grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(212px,260px)_minmax(0,1fr)]">
      <aside class="hidden min-h-0 border-r border-[var(--border)] bg-[var(--nav-background)] p-3 lg:block">
        <div class="mb-4 px-1">
          <div class="[font-family:var(--font-display)] text-base text-[var(--foreground)]">{{ activeModuleName }}</div>
          <div class="text-xs text-[var(--muted-foreground)]">{{ t('shell.navigation.templateDirectory') }}</div>
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
        <AdminScrollArea class="flex-1" view-class="p-4">
          <slot name="workspace" />
        </AdminScrollArea>
      </main>
    </div>
  </div>
</template>
