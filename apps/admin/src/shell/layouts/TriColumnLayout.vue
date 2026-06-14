<script setup lang="ts">
import { BookOpen, Circle, Palette } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { findActiveModule, isModuleNavItemActive } from '@super-admin-org/core'
import type { ModuleNavItem } from '@super-admin-org/core'
import { AdminScrollArea } from '@super-admin-org/ui'
import { translateModuleName, translateNavItemLabel } from '@/i18n/navigation'
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

const icons = {
  examples: BookOpen,
  'ui-kit': Palette
}

function getIcon(icon: string | undefined): object {
  if (!icon) {
    return Circle
  }
  return icons[icon as keyof typeof icons] ?? Circle
}

function isActive(item: ModuleNavItem): boolean {
  return isModuleNavItemActive(item, route.path)
}

function navLabel(item: ModuleNavItem): string {
  return translateNavItemLabel(t, item)
}
</script>

<template>
  <div class="super-texture min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
    <ShellHeader />
    <div class="grid h-[calc(100vh-3.5rem)] grid-cols-[72px_minmax(168px,220px)_minmax(0,1fr)]">
      <div class="flex flex-col items-center gap-4 border-r border-[var(--border)] bg-[var(--nav-background)] p-3">
        <div
          aria-label="Super Admin logo"
          class="relative grid size-12 place-items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--glow)]"
          title="Super Admin"
        >
          <span class="[font-family:var(--font-display)] text-base font-black">SA</span>
          <span class="absolute -right-3 top-1 h-px w-10 rotate-45 bg-[var(--primary-foreground)] opacity-40" />
        </div>
        <nav :aria-label="t('shell.navigation.primary')" class="mt-2 grid gap-2">
          <RouterLink
            v-for="module in registeredModules"
            :key="module.id"
            :to="module.nav.path"
            :title="navLabel(module.nav)"
            class="grid size-11 place-items-center rounded-[var(--radius-md)] border text-[var(--muted-foreground)] transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
            :class="
              isActive(module.nav)
                ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)] shadow-[var(--glow)]'
                : 'border-transparent hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'
            "
          >
            <component :is="getIcon(module.nav.icon)" class="size-5" />
            <span class="sr-only">{{ navLabel(module.nav) }}</span>
          </RouterLink>
        </nav>
        <div class="mt-auto">
          <ShellAccountMenu variant="dock" />
        </div>
      </div>
      <aside class="min-w-0 border-r border-[var(--border)] bg-[var(--nav-background)] p-3">
        <div class="mb-4 px-1">
          <div class="[font-family:var(--font-display)] text-base text-[var(--foreground)]">{{ activeModuleName }}</div>
          <div class="text-xs text-[var(--muted-foreground)]">{{ t('shell.navigation.templateDirectory') }}</div>
        </div>
        <PrimaryNav v-if="subNavItems.length > 0" :items="subNavItems" :max-depth="2" />
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
