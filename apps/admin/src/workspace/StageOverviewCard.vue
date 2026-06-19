<script setup lang="ts">
import { useTemplateRef, type Component } from 'vue'
import type { StageWindowPreviewModel } from './stage-manager'
import StageWindowActions from './StageWindowActions.vue'
import StageWindowPreview from './StageWindowPreview.vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    closeLabel: string
    component?: Component
    currentLabel: string
    pinLabel: string
    pinned: boolean
    preview: StageWindowPreviewModel
    previewUnavailableLabel: string
    refreshLabel: string
    routePath: string
    title: string
    unpinLabel: string
  }>(),
  {
    active: false
  }
)

const emit = defineEmits<{
  activate: [sourceRect: DOMRect]
  close: []
  refresh: []
  togglePin: []
}>()

const buttonRef = useTemplateRef<HTMLButtonElement>('button')

function activate(): void {
  const sourceRect = buttonRef.value?.getBoundingClientRect()
  if (!sourceRect) {
    return
  }

  emit('activate', sourceRect)
}
</script>

<template>
  <article
    class="stage-overview-card stage-action-host"
    :class="props.active ? 'stage-overview-card--active' : ''"
    @click.stop
    >
    <button
      ref="button"
      type="button"
      class="stage-overview-card__button block h-full w-full text-left focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
      @click="activate"
    >
      <StageWindowPreview
        :component="props.component"
        :preview="props.preview"
        :preview-unavailable-label="props.previewUnavailableLabel"
        variant="overview"
      />
      <div class="mt-2 flex min-w-0 items-center justify-between gap-2">
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold text-[var(--foreground)]">
            {{ props.title }}
          </div>
          <div class="mt-0.5 truncate text-[11px] text-[var(--muted-foreground)]">
            {{ props.routePath }}
          </div>
        </div>
        <span v-if="props.active" class="text-[10px] uppercase tracking-[0.16em] text-[var(--primary)]">
          {{ props.currentLabel }}
        </span>
      </div>
    </button>
    <StageWindowActions
      :can-close="!props.pinned"
      :close-label="props.closeLabel"
      :pin-label="props.pinLabel"
      :pinned="props.pinned"
      :refresh-label="props.refreshLabel"
      :unpin-label="props.unpinLabel"
      @close="emit('close')"
      @refresh="emit('refresh')"
      @toggle-pin="emit('togglePin')"
    />
  </article>
</template>

<style scoped>
.stage-overview-card {
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: transparent;
  backdrop-filter: blur(10px);
  transition:
    transform var(--duration-base) var(--easing),
    border-color var(--duration-base) var(--easing),
    box-shadow var(--duration-base) var(--easing);
}

.stage-overview-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
  background-image: var(--texture);
  opacity: 0;
  transition: opacity var(--duration-base) var(--easing);
}

.stage-overview-card--active,
.stage-overview-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--glow), var(--panel-shadow);
}

.stage-overview-card--active::after,
.stage-overview-card:hover::after {
  opacity: 0.2;
}

.stage-overview-card:hover {
  transform: scale(1.025);
}

.stage-overview-card--active :deep(.stage-window-preview),
.stage-overview-card:hover :deep(.stage-window-preview) {
  border-color: var(--border-strong);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--foreground) 14%, transparent), var(--glow);
}

.stage-overview-card__button {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 0;
  flex-direction: column;
  padding: clamp(0.45rem, 0.75vw, 0.7rem);
}
</style>
