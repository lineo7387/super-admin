<script setup lang="ts">
import { Boxes, Gauge, ShieldCheck, Users } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { registeredModules } from '@/modules/module-registry'

const props = withDefaults(
  defineProps<{
    orientation?: 'vertical' | 'horizontal'
    iconOnly?: boolean
  }>(),
  {
    orientation: 'vertical',
    iconOnly: false
  }
)

const route = useRoute()

const icons = {
  dashboard: Gauge,
  workbench: Boxes,
  users: Users,
  access: ShieldCheck
}

const navItems = computed(() => registeredModules.map((module) => module.nav))
</script>

<template>
  <nav
    class="flex gap-1"
    :class="props.orientation === 'horizontal' ? 'flex-row items-center justify-center' : 'flex-col'"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="flex h-10 items-center rounded-[var(--radius-md)] border text-sm transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
      :class="[
        props.iconOnly ? 'w-10 justify-center px-0' : 'gap-3 px-3',
        props.orientation === 'horizontal' && !props.iconOnly ? 'min-w-28 justify-center' : '',
        route.path.startsWith(item.path)
          ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)]'
          : 'border-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'
      ]"
      :title="props.iconOnly ? item.label : undefined"
    >
      <component :is="icons[item.icon as keyof typeof icons]" class="size-4" />
      <span v-if="!props.iconOnly">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
