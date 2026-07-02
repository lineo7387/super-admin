<script setup lang="ts">
import { Pin, PinOff, RotateCw, X } from '@lucide/vue'

const props = defineProps<{
  canClose: boolean
  closeLabel: string
  pinned: boolean
  pinLabel: string
  refreshLabel: string
  unpinLabel: string
}>()

const emit = defineEmits<{
  close: []
  refresh: []
  togglePin: []
}>()
</script>

<template>
  <button
    type="button"
    class="stage-action stage-action--pin"
    :aria-label="props.pinned ? props.unpinLabel : props.pinLabel"
    :title="props.pinned ? props.unpinLabel : props.pinLabel"
    @click.stop="emit('togglePin')"
  >
    <PinOff v-if="props.pinned" class="size-3" aria-hidden="true" />
    <Pin v-else class="size-3" aria-hidden="true" />
  </button>
  <button type="button" class="stage-action stage-action--refresh" :aria-label="props.refreshLabel" :title="props.refreshLabel" @click.stop="emit('refresh')">
    <RotateCw class="size-3" aria-hidden="true" />
  </button>
  <button
    v-if="props.canClose"
    type="button"
    class="stage-action stage-action--close"
    :aria-label="props.closeLabel"
    :title="props.closeLabel"
    @click.stop="emit('close')"
  >
    <X class="size-3" aria-hidden="true" />
  </button>
</template>

<style scoped>
.stage-action {
  position: absolute;
  top: 0.4rem;
  z-index: 3;
  display: grid;
  width: 1.35rem;
  height: 1.35rem;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-raised);
  color: var(--foreground);
  pointer-events: none;
  opacity: 0;
  transform: translateY(-2px);
  transition:
    opacity var(--duration-base) var(--easing),
    border-color var(--duration-base) var(--easing),
    box-shadow var(--duration-base) var(--easing),
    transform var(--duration-base) var(--easing);
}

:global(.stage-action-host:hover .stage-action),
:global(.stage-action-host:focus-within .stage-action),
:global(.stage-action-host:active .stage-action) {
  pointer-events: auto;
  opacity: 0.86;
  transform: translateY(0);
}

.stage-action:hover,
.stage-action:focus-visible {
  border-color: var(--border-strong);
  box-shadow: var(--glow), var(--panel-shadow);
  opacity: 1;
  outline: none;
  transform: translateY(-1px);
}

.stage-action--close {
  right: 0.4rem;
}

.stage-action--refresh {
  right: 1.95rem;
}

.stage-action--pin {
  right: 3.5rem;
}
</style>
