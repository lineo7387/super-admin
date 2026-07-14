<script setup lang="ts">
import { BarChart3, BookOpen, Boxes, ChevronDown, ChevronRight, Circle, Gauge, Palette, ShieldCheck, Users } from '@lucide/vue'
import { computed, nextTick, onMounted, onUnmounted, reactive, shallowRef, useId, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getVisibleModuleNavTree, isModuleNavItemActive } from '@super-admin-org/core'
import type { ModuleNavItem } from '@super-admin-org/core'
import { translateNavItemLabel } from '@/i18n/navigation'
import { registeredModules } from '@/modules/module-registry'
import { resolveHorizontalNavDropdownPosition } from './primary-nav-floating-menu'

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
const navInstanceId = useId()

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
const openDropdownTrigger = shallowRef<HTMLElement | null>(null)
const openDropdownPosition = shallowRef<ReturnType<typeof resolveHorizontalNavDropdownPosition> | null>(null)
const expandedPaths = reactive<Record<string, boolean>>({})

const dropdownStyle = computed<CSSProperties | undefined>(() => {
  const position = openDropdownPosition.value
  if (!position) {
    return undefined
  }

  return {
    left: `${position.left}px`,
    top: `${position.top}px`,
    width: `${position.width}px`
  }
})

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

function dropdownTriggerId(item: ModuleNavItem): string {
  return `${navInstanceId}-trigger-${encodeURIComponent(item.path)}`
}

function dropdownMenuId(item: ModuleNavItem): string {
  return `${navInstanceId}-menu-${encodeURIComponent(item.path)}`
}

function openDropdown(item: ModuleNavItem, trigger: HTMLElement): void {
  openDropdownPath.value = item.path
  openDropdownTrigger.value = trigger
  updateDropdownPosition()
}

async function focusFirstDropdownItem(item: ModuleNavItem): Promise<void> {
  await nextTick()
  document.getElementById(dropdownMenuId(item))?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
}

async function handleItemClick(item: ModuleNavItem, event: MouseEvent): Promise<void> {
  if (shouldRenderAsButton(item)) {
    event.preventDefault()
    event.stopPropagation()
    if (props.orientation === 'horizontal') {
      if (openDropdownPath.value === item.path) {
        closeDropdowns()
        return
      }

      if (event.currentTarget instanceof HTMLElement) {
        openDropdown(item, event.currentTarget)
        await focusFirstDropdownItem(item)
      }
    } else {
      toggleExpanded(item)
    }
  }
}

async function handleItemKeydown(item: ModuleNavItem, event: KeyboardEvent): Promise<void> {
  if (props.orientation !== 'horizontal' || !shouldRenderAsButton(item)) {
    return
  }

  if (event.key === 'Escape' && isDropdownOpen(item)) {
    event.preventDefault()
    event.stopPropagation()
    closeDropdownAndRestoreFocus()
    return
  }

  if (event.key !== 'ArrowDown') {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  if (event.currentTarget instanceof HTMLElement) {
    openDropdown(item, event.currentTarget)
    await focusFirstDropdownItem(item)
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
  openDropdownTrigger.value = null
  openDropdownPosition.value = null
}

function closeDropdownAndRestoreFocus(): void {
  const trigger = openDropdownTrigger.value
  closeDropdowns()
  trigger?.focus()
}

function handleDropdownKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  closeDropdownAndRestoreFocus()
}

function handleDropdownFocusout(event: FocusEvent): void {
  const menu = event.currentTarget
  const nextTarget = event.relatedTarget
  if (!(menu instanceof HTMLElement)) {
    return
  }

  if (nextTarget instanceof Node && (menu.contains(nextTarget) || openDropdownTrigger.value?.contains(nextTarget))) {
    return
  }

  closeDropdowns()
}

function updateDropdownPosition(): void {
  const trigger = openDropdownTrigger.value
  if (!trigger) {
    return
  }

  const triggerRect = trigger.getBoundingClientRect()
  openDropdownPosition.value = resolveHorizontalNavDropdownPosition({
    trigger: {
      bottom: triggerRect.bottom,
      left: triggerRect.left,
      width: triggerRect.width
    },
    viewportWidth: window.innerWidth
  })
}

watch(
  () => route.path,
  () => {
    openDropdownPath.value = null
  }
)

onMounted(() => {
  window.addEventListener('click', closeDropdowns)
  window.addEventListener('resize', updateDropdownPosition)
  window.addEventListener('scroll', closeDropdowns, true)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns)
  window.removeEventListener('resize', updateDropdownPosition)
  window.removeEventListener('scroll', closeDropdowns, true)
})
</script>

<template>
  <nav class="flex gap-1" :class="props.orientation === 'horizontal' ? 'flex-row items-center justify-center' : 'flex-col'">
    <div v-for="item in navItems" :key="item.path" class="relative">
      <component
        :is="shouldRenderAsButton(item) ? 'button' : RouterLink"
        :to="shouldRenderAsButton(item) ? undefined : item.path"
        :type="shouldRenderAsButton(item) ? 'button' : undefined"
        :id="shouldRenderAsButton(item) && props.orientation === 'horizontal' ? dropdownTriggerId(item) : undefined"
        :aria-expanded="shouldRenderAsButton(item) ? (props.orientation === 'horizontal' ? isDropdownOpen(item) : isExpanded(item)) : undefined"
        :aria-haspopup="shouldRenderAsButton(item) && props.orientation === 'horizontal' ? 'menu' : undefined"
        :aria-controls="shouldRenderAsButton(item) && props.orientation === 'horizontal' ? dropdownMenuId(item) : undefined"
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
        @keydown="handleItemKeydown(item, $event)"
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

      <Teleport to="body">
        <div
          v-if="props.orientation === 'horizontal' && isDropdownOpen(item) && visibleChildren(item).length > 0 && dropdownStyle"
          :id="dropdownMenuId(item)"
          data-primary-nav-dropdown
          class="fixed z-[72] rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-raised)]/95 p-1.5 shadow-[var(--panel-shadow)] backdrop-blur-md"
          :style="dropdownStyle"
          role="menu"
          :aria-labelledby="dropdownTriggerId(item)"
          @click.stop
          @keydown="handleDropdownKeydown"
          @focusout="handleDropdownFocusout"
        >
          <div v-for="child in visibleChildren(item)" :key="child.path" role="none">
            <component
              :is="shouldRenderAsButton(child) ? 'button' : RouterLink"
              :to="shouldRenderAsButton(child) ? undefined : child.path"
              :type="shouldRenderAsButton(child) ? 'button' : undefined"
              :aria-expanded="shouldRenderAsButton(child) ? isExpanded(child) : undefined"
              role="menuitem"
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
            <div v-if="visibleChildren(child).length > 0 && isExpanded(child)" class="ml-3 my-1 grid gap-1 border-l border-[var(--border)] pl-2">
              <RouterLink
                v-for="grandchild in visibleChildren(child)"
                :key="grandchild.path"
                :to="grandchild.path"
                role="menuitem"
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
      </Teleport>
    </div>
  </nav>
</template>
