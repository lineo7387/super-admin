<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useAttrs } from 'vue'
import { cn } from '../lib/cn'

type ScrollAreaTag = 'div' | 'section' | 'aside' | 'main'
type ScrollAreaClass = string | string[] | Record<string, boolean | undefined>

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    as?: ScrollAreaTag
    axis?: 'vertical' | 'horizontal' | 'both'
    always?: boolean
    showScrollbar?: boolean
    minThumbSize?: number
    viewClass?: ScrollAreaClass
  }>(),
  {
    as: 'div',
    axis: 'vertical',
    always: false,
    showScrollbar: true,
    minThumbSize: 20,
    viewClass: undefined
  }
)

const attrs = useAttrs()
const classes = computed(() =>
  cn(
    'super-scroll min-h-0',
    attrs.class as ScrollAreaClass
  )
)

const rootAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const isScrolling = shallowRef(false)
const hasVerticalScroll = shallowRef(false)
const hasHorizontalScroll = shallowRef(false)
const verticalThumbSize = shallowRef(0)
const verticalThumbOffset = shallowRef(0)
const horizontalThumbSize = shallowRef(0)
const horizontalThumbOffset = shallowRef(0)
const scrollWrap = shallowRef<HTMLElement | null>(null)
const scrollView = shallowRef<HTMLElement | null>(null)
let scrollEndTimer: ReturnType<typeof window.setTimeout> | undefined
let wrapResizeObserver: ResizeObserver | undefined
let viewResizeObserver: ResizeObserver | undefined

const verticalThumbStyle = computed(() => ({
  height: `${verticalThumbSize.value}px`,
  transform: `translateY(${verticalThumbOffset.value}px)`
}))

const horizontalThumbStyle = computed(() => ({
  width: `${horizontalThumbSize.value}px`,
  transform: `translateX(${horizontalThumbOffset.value}px)`
}))

function updateThumbMetrics(element = scrollWrap.value): void {
  if (!element) {
    return
  }

  const verticalScrollable = element.scrollHeight > element.clientHeight + 1
  const horizontalScrollable = element.scrollWidth > element.clientWidth + 1

  hasVerticalScroll.value = verticalScrollable && props.axis !== 'horizontal'
  hasHorizontalScroll.value = horizontalScrollable && props.axis !== 'vertical'

  if (hasVerticalScroll.value) {
    const trackLength = element.clientHeight - 4
    const thumbSize = Math.min(trackLength, Math.max(props.minThumbSize, (element.clientHeight / element.scrollHeight) * trackLength))
    const maxOffset = Math.max(0, trackLength - thumbSize)
    const scrollableRange = Math.max(1, element.scrollHeight - element.clientHeight)

    verticalThumbSize.value = thumbSize
    verticalThumbOffset.value = (element.scrollTop / scrollableRange) * maxOffset
  }

  if (hasHorizontalScroll.value) {
    const trackLength = element.clientWidth - 4
    const thumbSize = Math.min(trackLength, Math.max(props.minThumbSize, (element.clientWidth / element.scrollWidth) * trackLength))
    const maxOffset = Math.max(0, trackLength - thumbSize)
    const scrollableRange = Math.max(1, element.scrollWidth - element.clientWidth)

    horizontalThumbSize.value = thumbSize
    horizontalThumbOffset.value = (element.scrollLeft / scrollableRange) * maxOffset
  }
}

function handleScroll(event: Event): void {
  updateThumbMetrics(event.currentTarget as HTMLElement)
  isScrolling.value = true
  if (scrollEndTimer) {
    window.clearTimeout(scrollEndTimer)
  }
  scrollEndTimer = window.setTimeout(() => {
    isScrolling.value = false
  }, 800)
}

function getScrollElement(): HTMLElement | null {
  return scrollWrap.value
}

function scrollBy(options: ScrollToOptions): void {
  scrollWrap.value?.scrollBy(options)
  window.requestAnimationFrame(() => updateThumbMetrics())
}

onMounted(() => {
  void nextTick(() => {
    updateThumbMetrics()
    if (typeof ResizeObserver !== 'undefined') {
      if (scrollWrap.value) {
        wrapResizeObserver = new ResizeObserver(() => updateThumbMetrics())
        wrapResizeObserver.observe(scrollWrap.value)
      }
      if (scrollView.value) {
        viewResizeObserver = new ResizeObserver(() => updateThumbMetrics())
        viewResizeObserver.observe(scrollView.value)
      }
    }
  })
})

onBeforeUnmount(() => {
  if (scrollEndTimer) {
    window.clearTimeout(scrollEndTimer)
  }
  wrapResizeObserver?.disconnect()
  viewResizeObserver?.disconnect()
})

defineExpose({
  getScrollElement,
  scrollBy,
  updateThumbMetrics
})
</script>

<template>
  <component
    :is="props.as"
    :class="classes"
    :data-always="props.always"
    :data-scrolling="isScrolling"
    v-bind="rootAttrs"
  >
    <div
      ref="scrollWrap"
      class="super-scroll__wrap"
      :data-axis="props.axis"
      @scroll="handleScroll"
    >
      <div ref="scrollView" class="super-scroll__view" :class="props.viewClass">
        <slot />
      </div>
    </div>

    <div v-if="props.showScrollbar && hasVerticalScroll" class="super-scroll__bar super-scroll__bar--vertical" aria-hidden="true">
      <div class="super-scroll__thumb" :style="verticalThumbStyle" />
    </div>
    <div v-if="props.showScrollbar && hasHorizontalScroll" class="super-scroll__bar super-scroll__bar--horizontal" aria-hidden="true">
      <div class="super-scroll__thumb" :style="horizontalThumbStyle" />
    </div>
  </component>
</template>
