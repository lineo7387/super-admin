<script setup lang="ts">
import { ChevronLeft, ChevronRight, Pin, X } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdminScrollArea } from '@super-admin-org/ui'
import { translateRouteTitle } from '@/i18n/navigation'
import { usePreferencesStore } from '@/stores/preferences.store'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'

type ScrollAreaHandle = {
  getScrollElement: () => HTMLElement | null
  scrollBy: (options: ScrollToOptions) => void
  updateThumbMetrics: () => void
}

withDefaults(
  defineProps<{
    placement?: 'top'
  }>(),
  {
    placement: 'top'
  }
)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const tabs = useWorkspaceTabsStore()
const preferences = usePreferencesStore()

const scrollArea = shallowRef<ScrollAreaHandle | null>(null)
const canScrollLeft = shallowRef(false)
const canScrollRight = shallowRef(false)
const visibleTabs = computed(() => tabs.state.tabs)
const hasOverflow = computed(() => canScrollLeft.value || canScrollRight.value)

let scrollElement: HTMLElement | null = null
let resizeObserver: ResizeObserver | undefined

function activate(path: string): void {
  tabs.activateTab(path)
  void router.push(path)
}

function close(tabId: string): void {
  const next = tabs.closeTab(tabId)
  if (route.fullPath === tabId && next) {
    void router.push(next.routePath)
    return
  }

  if (route.fullPath === tabId) {
    void router.push('/examples/dashboard')
  }
}

function updateScrollState(): void {
  const element = scrollArea.value?.getScrollElement()
  if (!element) {
    canScrollLeft.value = false
    canScrollRight.value = false
    return
  }

  canScrollLeft.value = element.scrollLeft > 1
  canScrollRight.value = element.scrollLeft + element.clientWidth < element.scrollWidth - 1
}

function bindScrollElement(): void {
  const nextElement = scrollArea.value?.getScrollElement() ?? null
  if (nextElement === scrollElement) {
    updateScrollState()
    return
  }

  scrollElement?.removeEventListener('scroll', updateScrollState)
  resizeObserver?.disconnect()
  scrollElement = nextElement

  if (!scrollElement) {
    updateScrollState()
    return
  }

  scrollElement.addEventListener('scroll', updateScrollState, { passive: true })
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateScrollState())
    resizeObserver.observe(scrollElement)
    if (scrollElement.firstElementChild) {
      resizeObserver.observe(scrollElement.firstElementChild)
    }
  }
  updateScrollState()
}

function scrollTabs(direction: -1 | 1): void {
  const element = scrollArea.value?.getScrollElement()
  if (!element) {
    return
  }

  const distance = Math.max(180, Math.round(element.clientWidth * 0.7))
  scrollArea.value?.scrollBy({
    left: direction * distance,
    behavior: 'smooth'
  })
  window.setTimeout(updateScrollState, 260)
}

function handleTabWheel(event: WheelEvent): void {
  const element = scrollArea.value?.getScrollElement()
  if (!element || element.scrollWidth <= element.clientWidth + 1) {
    return
  }

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  if (delta === 0) {
    return
  }

  event.preventDefault()
  element.scrollBy({
    left: delta,
    behavior: 'auto'
  })
  updateScrollState()
  scrollArea.value?.updateThumbMetrics()
}

function scrollActiveTabIntoView(): void {
  const element = scrollArea.value?.getScrollElement()
  if (!element) {
    return
  }

  const activeTab = Array.from(element.querySelectorAll<HTMLElement>('[data-tab-id]')).find((tab) => tab.dataset.tabId === route.fullPath)
  activeTab?.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
    behavior: 'smooth'
  })
  window.setTimeout(updateScrollState, 260)
}

watch(
  () => [preferences.workspaceTabs.enabled, visibleTabs.value.length] as const,
  async () => {
    await nextTick()
    bindScrollElement()
    scrollActiveTabIntoView()
  },
  { immediate: true }
)

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    scrollActiveTabIntoView()
  }
)

onMounted(async () => {
  await nextTick()
  bindScrollElement()
})

onBeforeUnmount(() => {
  scrollElement?.removeEventListener('scroll', updateScrollState)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    v-if="preferences.workspaceTabs.enabled"
    class="group/tabs relative h-11 border-b border-[var(--border)] bg-[var(--surface-sunken)]"
    @wheel="handleTabWheel"
  >
    <button
      v-if="hasOverflow"
      type="button"
      :aria-label="t('workspace.scrollTabsLeft')"
      :title="t('workspace.scrollTabsLeft')"
      class="pointer-events-none absolute left-1 top-1/2 z-20 grid size-7 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)] opacity-0 shadow-[var(--panel-shadow)] transition hover:text-[var(--foreground)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none group-hover/tabs:pointer-events-auto group-focus-within/tabs:pointer-events-auto"
      :class="canScrollLeft ? 'group-hover/tabs:opacity-100 group-focus-within/tabs:opacity-100' : 'group-hover/tabs:opacity-35 group-focus-within/tabs:opacity-35'"
      :disabled="!canScrollLeft"
      @click="scrollTabs(-1)"
    >
      <ChevronLeft class="size-4" />
    </button>
    <AdminScrollArea
      ref="scrollArea"
      axis="horizontal"
      class="h-full"
      view-class="flex h-full items-center gap-1 px-2"
      :show-scrollbar="false"
      always
    >
      <div
        v-for="tab in visibleTabs"
        :key="tab.id"
        :data-tab-id="tab.id"
        class="group inline-flex h-8 max-w-56 shrink-0 items-center rounded-[var(--radius-sm)] border text-xs transition"
        :class="tab.routePath === route.fullPath ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'border-[var(--border)] bg-[var(--tab-background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'"
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-2 px-2 text-left outline-none focus-visible:shadow-[var(--focus-ring)]"
          @click="activate(tab.routePath)"
        >
          <Pin v-if="tab.pinned" class="size-3" />
          <span class="truncate">{{ translateRouteTitle(t, tab.routePath, tab.title) }}</span>
        </button>
        <button
          v-if="!tab.pinned"
          type="button"
          class="mr-1 grid size-4 place-items-center rounded-[var(--radius-xs)] text-[var(--muted-foreground)] opacity-60 transition hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)] group-hover:opacity-100 focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
          :title="t('workspace.closeTab')"
          @click.stop="close(tab.id)"
        >
          <X class="size-2.5" />
        </button>
      </div>
    </AdminScrollArea>
    <button
      v-if="hasOverflow"
      type="button"
      :aria-label="t('workspace.scrollTabsRight')"
      :title="t('workspace.scrollTabsRight')"
      class="pointer-events-none absolute right-1 top-1/2 z-20 grid size-7 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)] opacity-0 shadow-[var(--panel-shadow)] transition hover:text-[var(--foreground)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none group-hover/tabs:pointer-events-auto group-focus-within/tabs:pointer-events-auto"
      :class="canScrollRight ? 'group-hover/tabs:opacity-100 group-focus-within/tabs:opacity-100' : 'group-hover/tabs:opacity-35 group-focus-within/tabs:opacity-35'"
      :disabled="!canScrollRight"
      @click="scrollTabs(1)"
    >
      <ChevronRight class="size-4" />
    </button>
  </div>
</template>
