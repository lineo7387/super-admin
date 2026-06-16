<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    orientation?: 'left' | 'right'
    stacked?: boolean
  }>(),
  {
    active: false,
    orientation: 'left',
    stacked: false
  }
)

const emit = defineEmits<{
  activate: [sourceRect: DOMRect]
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
    class="stage-thumb stage-action-host"
    :class="{
      'stage-thumb--active': props.active,
      'stage-thumb--right': props.orientation === 'right',
      'stage-thumb--stacked': props.stacked
    }"
  >
    <div v-if="props.stacked" class="stage-thumb__card-stack" aria-hidden="true">
      <span class="stage-thumb__stack-card stage-thumb__stack-card--back" />
      <span class="stage-thumb__stack-card stage-thumb__stack-card--middle" />
    </div>
    <button
      ref="button"
      type="button"
      class="stage-thumb__button block h-full w-full text-left focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
      @click="activate"
    >
      <div class="stage-thumb__surface">
        <slot />
      </div>
    </button>
    <slot name="cue" />
    <slot name="actions" />
  </article>
</template>

<style scoped>
.stage-thumb {
  position: relative;
  width: 12rem;
  flex: 0 0 var(--stage-thumb-height);
  border-radius: var(--radius-lg);
  background: transparent;
  isolation: isolate;
  transform-origin: center center;
}

.stage-thumb__card-stack {
  position: absolute;
  inset: 0.16rem 0.28rem 0.28rem 0.16rem;
  z-index: 1;
  border-radius: var(--radius-lg);
  pointer-events: none;
  transform: perspective(1000px) rotateY(18deg) scale(0.88);
  transform-origin: center center;
  transition: transform var(--duration-base) var(--easing);
}

.stage-thumb__stack-card {
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in srgb, var(--primary) 34%, var(--border));
  border-radius: inherit;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--primary) 12%, transparent), transparent 52%),
    color-mix(in srgb, var(--surface-raised) 70%, transparent);
  box-shadow: 0 0.75rem 1.8rem color-mix(in srgb, var(--app-background) 34%, transparent);
}

.stage-thumb__stack-card--back {
  opacity: 0.4;
  transform: translate(-1.35rem, 0.72rem) scale(0.92);
}

.stage-thumb__stack-card--middle {
  opacity: 0.62;
  transform: translate(-0.72rem, 0.36rem) scale(0.96);
}

.stage-thumb__button {
  position: relative;
  z-index: 2;
}

.stage-thumb__surface {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 0.55rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: transparent;
  backdrop-filter: blur(10px);
  pointer-events: none;
  transform: perspective(1000px) rotateY(18deg) scale(0.88);
  transform-origin: center center;
  transition:
    transform var(--duration-base) var(--easing),
    border-color var(--duration-base) var(--easing),
    box-shadow var(--duration-base) var(--easing);
}

.stage-thumb--active .stage-thumb__surface,
.stage-thumb:hover .stage-thumb__surface {
  border-color: var(--border-strong);
  box-shadow: var(--glow), var(--panel-shadow);
}

.stage-thumb--stacked .stage-thumb__surface {
  border-color: color-mix(in srgb, var(--primary) 38%, var(--border));
}

.stage-thumb__surface::after {
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

.stage-thumb--active .stage-thumb__surface::after,
.stage-thumb:hover .stage-thumb__surface::after {
  opacity: 0.2;
}

.stage-thumb:hover .stage-thumb__surface {
  transform: perspective(1000px) rotateY(9deg) scale(1);
}

.stage-thumb:hover .stage-thumb__card-stack {
  transform: perspective(1000px) rotateY(9deg) scale(1);
}

.stage-thumb--right .stage-thumb__surface {
  transform: perspective(1000px) rotateY(-16deg) scale(0.9);
}

.stage-thumb--right:hover .stage-thumb__surface {
  transform: perspective(1000px) rotateY(-7deg) scale(1);
}

.stage-thumb--active :deep(.stage-window-preview),
.stage-thumb:hover :deep(.stage-window-preview) {
  border-color: var(--border-strong);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--foreground) 14%, transparent), var(--glow);
}

@media (max-width: 760px) {
  .stage-thumb {
    width: 9.5rem;
  }
}
</style>
