<script setup lang="ts">
import { BarChart3, BookOpen, Boxes, ChevronDown, ChevronRight, Circle, Gauge, Palette, ShieldCheck, Users } from '@lucide/vue'
import { computed, onMounted, onUnmounted, reactive, shallowRef, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getVisibleModuleNavTree, isModuleNavItemActive } from '@super-admin-org/core'
import type { ModuleNavItem } from '@super-admin-org/core'
import { translateNavItemLabel } from '@/i18n/navigation'
import { registeredModules } from '@/modules/module-registry'

const props = withDefaults(
  defineProps<{
    orientation?: 'vertical' | 'horizontal'
    iconOnly?: boolean
    items?: ModuleNavItem[]
    maxDepth?: number
  }>(),
  {
    orientation: 'vertical',
    iconOnly: false,
    items: undefined,
    maxDepth: 3
  }
)

const route = useRoute()
const { t } = useI18n()

const icons = {
  examples: BookOpen,
  'ui-kit': Palette,
  charts: BarChart3,
  dashboard: Gauge,
  workbench: Boxes,
  users: Users,
  access: ShieldCheck
}

const navItems = computed(() => {
  const sourceItems = props.items ?? registeredModules.map((module) => module.nav)

  return sourceItems.map((item) => getVisibleModuleNavTree(item, props.maxDepth))
})

const openDropdownPath = shallowRef<string | null>(null)
const expandedPaths = reactive<Record<string, boolean>>({})

function getIcon(icon: string | undefined): object {
  if (!icon) {
    return Circle
  }
  return icons[icon as keyof typeof icons] ?? Circle
}

function visibleChildren(item: ModuleNavItem): ModuleNavItem[] {
  return item.children ?? []
}

function isActive(item: ModuleNavItem): boolean {
  return isModuleNavItemActive(item, route.path)
}

function navLabel(item: ModuleNavItem): string {
  return translateNavItemLabel(t, item)
}

function shouldRenderAsButton(item: ModuleNavItem): boolean {
  return visibleChildren(item).length > 0
}

function isExpanded(item: ModuleNavItem): boolean {
  return expandedPaths[item.path] ?? isActive(item)
}

function isDropdownOpen(item: ModuleNavItem): boolean {
  return openDropdownPath.value === item.path
}

function handleItemClick(item: ModuleNavItem, event: MouseEvent): void {
  if (shouldRenderAsButton(item)) {
    event.preventDefault()
    event.stopPropagation()
    if (props.orientation === 'horizontal') {
      openDropdownPath.value = openDropdownPath.value === item.path ? null : item.path
    } else {
      toggleExpanded(item)
    }
  }
}

function handleNestedItemClick(item: ModuleNavItem, event: MouseEvent): void {
  if (!shouldRenderAsButton(item)) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  toggleExpanded(item)
}

function toggleExpanded(item: ModuleNavItem): void {
  const current = expandedPaths[item.path] ?? isActive(item)
  expandedPaths[item.path] = !current
}

function closeDropdowns(): void {
  openDropdownPath.value = null
}

watch(
  () => route.path,
  () => {
    openDropdownPath.value = null
  }
)

onMounted(() => {
  window.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns)
})
</script>

<template>
  <nav class="flex gap-1" :class="props.orientation === 'horizontal' ? 'flex-row items-center justify-center' : 'flex-col'">
    <div v-for="item in navItems" :key="item.path" class="relative">
      <component
        :is="shouldRenderAsButton(item) ? 'button' : RouterLink"
        :to="shouldRenderAsButton(item) ? undefined : item.path"
        :type="shouldRenderAsButton(item) ? 'button' : undefined"
        :aria-expanded="shouldRenderAsButton(item) ? (props.orientation === 'horizontal' ? isDropdownOpen(item) : isExpanded(item)) : undefined"
        :aria-haspopup="shouldRenderAsButton(item) && props.orientation === 'horizontal' ? 'menu' : undefined"
        class="flex h-10 items-center rounded-[var(--radius-md)] border text-sm transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
        :class="[
          props.iconOnly ? 'w-10 justify-center px-0' : 'gap-3 px-3',
          props.orientation === 'horizontal' && !props.iconOnly ? 'min-w-28 justify-center' : '',
          props.orientation === 'vertical' ? 'w-full' : '',
          shouldRenderAsButton(item) ? 'cursor-pointer' : '',
          isActive(item)
            ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)] font-medium'
            : 'border-transparent bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'
        ]"
        :title="props.iconOnly ? navLabel(item) : undefined"
        @click="handleItemClick(item, $event)"
      >
        <component :is="getIcon(item.icon)" class="size-4" />
        <span v-if="!props.iconOnly" class="min-w-0 flex-1 text-left">{{ navLabel(item) }}</span>
        <ChevronRight
          v-if="!props.iconOnly && props.orientation === 'vertical' && visibleChildren(item).length > 0"
          class="size-3 transition-transform duration-200"
          :class="{ 'rotate-90': isExpanded(item) }"
        />
        <ChevronDown v-if="!props.iconOnly && props.orientation === 'horizontal' && visibleChildren(item).length > 0" class="size-3 ml-1 opacity-60" />
      </component>

      <div
        v-if="props.orientation === 'vertical' && !props.iconOnly && visibleChildren(item).length > 0 && isExpanded(item)"
        class="ml-5 mt-1 grid gap-1 border-l border-[var(--border)] pl-3"
      >
        <div v-for="child in visibleChildren(item)" :key="child.path">
          <component
            :is="shouldRenderAsButton(child) ? 'button' : RouterLink"
            :to="shouldRenderAsButton(child) ? undefined : child.path"
            :type="shouldRenderAsButton(child) ? 'button' : undefined"
            :aria-expanded="shouldRenderAsButton(child) ? isExpanded(child) : undefined"
            class="flex h-9 w-full items-center justify-between rounded-[var(--radius-md)] px-3 text-left text-sm transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
            :class="
              isActive(child)
                ? 'bg-[var(--surface-raised)] text-[var(--foreground)]'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'
            "
            @click="handleNestedItemClick(child, $event)"
          >
            <span>{{ navLabel(child) }}</span>
            <ChevronRight v-if="visibleChildren(child).length > 0" class="size-3" />
          </component>
          <div v-if="visibleChildren(child).length > 0 && isExpanded(child)" class="ml-3 grid gap-1 border-l border-[var(--border)] pl-2">
            <RouterLink
              v-for="grandchild in visibleChildren(child)"
              :key="grandchild.path"
              :to="grandchild.path"
              class="flex h-8 items-center rounded-[var(--radius-sm)] px-2 text-xs transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
              :class="
                isActive(grandchild)
                  ? 'bg-[var(--active-tab-background)] text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'
              "
            >
              {{ navLabel(grandchild) }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div
        v-if="props.orientation === 'horizontal' && isDropdownOpen(item) && visibleChildren(item).length > 0"
        class="absolute left-1/2 top-full z-50 mt-1.5 w-44 -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-raised)]/95 p-1.5 shadow-[var(--panel-shadow)] backdrop-blur-md"
        @click.stop
      >
        <div v-for="child in visibleChildren(item)" :key="child.path">
          <component
            :is="shouldRenderAsButton(child) ? 'button' : RouterLink"
            :to="shouldRenderAsButton(child) ? undefined : child.path"
            :type="shouldRenderAsButton(child) ? 'button' : undefined"
            :aria-expanded="shouldRenderAsButton(child) ? isExpanded(child) : undefined"
            class="flex h-9 w-full items-center justify-between rounded-[var(--radius-sm)] px-2.5 text-left text-xs transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
            :class="
              isActive(child)
                ? 'bg-[var(--active-tab-background)] text-[var(--foreground)] font-medium'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
            "
            @click="handleNestedItemClick(child, $event)"
          >
            <span>{{ navLabel(child) }}</span>
            <ChevronRight v-if="visibleChildren(child).length > 0" class="size-3" />
          </component>
          <div v-if="visibleChildren(child).length > 0 && isExpanded(child)" class="ml-3 grid gap-1 border-l border-[var(--border)] pl-2 my-1">
            <RouterLink
              v-for="grandchild in visibleChildren(child)"
              :key="grandchild.path"
              :to="grandchild.path"
              class="flex h-7 items-center rounded-[var(--radius-sm)] px-2 text-[10px] uppercase transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
              :class="
                isActive(grandchild)
                  ? 'bg-[var(--active-tab-background)] text-[var(--foreground)] font-semibold'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
              "
            >
              {{ navLabel(grandchild) }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
