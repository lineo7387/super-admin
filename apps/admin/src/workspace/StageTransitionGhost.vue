<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { usePreferencesStore } from '@/stores/preferences.store'

const preferences = usePreferencesStore()

const ghostStyle = computed<CSSProperties>(() => {
  const ghost = preferences.stageTransitionGhost
  if (!ghost) {
    return {}
  }

  const rect = ghost.phase === 'source' ? ghost.source : ghost.target

  return {
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    opacity: ghost.phase === 'source' ? '0.86' : '0',
    top: `${rect.top}px`,
    width: `${rect.width}px`
  }
})
</script>

<template>
  <div
    v-if="preferences.stageTransitionGhost"
    :key="preferences.stageTransitionGhost.id"
    class="stage-transition-ghost"
    :data-phase="preferences.stageTransitionGhost.phase"
    :style="ghostStyle"
    aria-hidden="true"
  >
    <div class="stage-transition-ghost__chrome">
      <div class="stage-transition-ghost__title">{{ preferences.stageTransitionGhost.title }}</div>
      <div class="stage-transition-ghost__bars">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage-transition-ghost {
  position: fixed;
  z-index: 90;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  pointer-events: none;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, transparent), transparent 42%),
    var(--texture),
    color-mix(in srgb, var(--surface-raised) 82%, transparent);
  box-shadow: var(--glow), var(--panel-shadow);
  transform-origin: center center;
  transition:
    left 320ms var(--easing),
    top 320ms var(--easing),
    width 320ms var(--easing),
    height 320ms var(--easing),
    opacity 320ms ease;
  will-change: left, top, width, height, opacity;
}

.stage-transition-ghost__chrome {
  display: grid;
  height: 100%;
  min-height: 0;
  grid-template-rows: auto 1fr;
  padding: clamp(0.55rem, 1vw, 1rem);
}

.stage-transition-ghost__title {
  max-width: 24rem;
  overflow: hidden;
  color: var(--foreground);
  font-size: clamp(0.75rem, 1vw, 0.95rem);
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage-transition-ghost__bars {
  display: grid;
  align-content: center;
  gap: clamp(0.4rem, 0.8vw, 0.75rem);
  opacity: 0.6;
}

.stage-transition-ghost__bars span {
  display: block;
  height: clamp(0.3rem, 0.55vw, 0.55rem);
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 36%, var(--surface));
}

.stage-transition-ghost__bars span:nth-child(2) {
  width: 72%;
}

.stage-transition-ghost__bars span:nth-child(3) {
  width: 44%;
}

@media (prefers-reduced-motion: reduce) {
  .stage-transition-ghost {
    transition: opacity 120ms ease;
  }
}
</style>
