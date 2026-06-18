<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{
    component?: Component
    previewUnavailableLabel: string
    variant?: 'overview' | 'thumb'
  }>(),
  {
    variant: 'thumb'
  }
)
</script>

<template>
  <div
    class="stage-window-preview"
    :class="{
      'stage-window-preview--overview': props.variant === 'overview',
      'stage-window-preview--thumb': props.variant === 'thumb'
    }"
  >
    <div
      class="stage-window-scale"
      :class="{
        'stage-window-scale--overview': props.variant === 'overview',
        'stage-window-scale--thumb': props.variant === 'thumb'
      }"
    >
      <component :is="props.component" v-if="props.component" />
      <div v-else class="grid h-full place-items-center text-sm text-[var(--muted-foreground)]">
        {{ props.previewUnavailableLabel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage-window-preview {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.stage-window-preview--thumb {
  height: var(--stage-preview-thumb-height, 5.05rem);
}

.stage-window-preview--overview {
  min-height: 0;
  flex: 1 1 auto;
  height: auto;
}

.stage-window-scale {
  pointer-events: none;
  transform-origin: top left;
}

.stage-window-scale--thumb {
  width: 56rem;
  height: 38rem;
  padding: 0.85rem;
  transform: scale(var(--stage-preview-thumb-scale, 0.19));
}

.stage-window-scale--overview {
  width: 82rem;
  height: 52rem;
  padding: 1rem;
  transform: scale(var(--stage-overview-scale));
}
</style>
