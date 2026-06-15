<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { motion, useReducedMotion } from 'motion-v'
import { usePreferencesStore } from '@/stores/preferences.store'
import type { StageTransitionRect } from '@/stores/preferences.store'

type StageMotionTarget = {
  filter: string
  height: number
  opacity: number
  scale: number
  width: number
  x: number
  y: number
}

const preferences = usePreferencesStore()
const prefersReducedMotion = useReducedMotion()

const baseStyle = computed<CSSProperties>(() => ({
  height: '0px',
  left: '0px',
  position: 'fixed',
  top: '0px',
  width: '0px'
}))

const initialRect = computed<StageMotionTarget>(() => {
  const ghost = preferences.stageTransitionGhost
  return createMotionTarget(ghost?.source, 0.92)
})

const targetRect = computed<StageMotionTarget>(() => {
  const ghost = preferences.stageTransitionGhost
  if (!ghost || ghost.status === 'measuring') {
    return createMotionTarget(ghost?.source, 0.92)
  }

  return createMotionTarget(ghost.target, 0)
})

const motionTransition = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0.18, ease: 'easeOut' }
    : {
        default: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }
)

function createMotionTarget(rect: StageTransitionRect | undefined, opacity: number): StageMotionTarget {
  return {
    filter: opacity === 0 ? 'blur(1.5px)' : 'blur(0px)',
    height: rect?.height ?? 0,
    opacity,
    scale: prefersReducedMotion.value && opacity === 0 ? 0.98 : 1,
    width: rect?.width ?? 0,
    x: rect?.left ?? 0,
    y: rect?.top ?? 0
  }
}

function isStageMotionTarget(value: unknown): value is StageMotionTarget {
  return typeof value === 'object' && value !== null && 'opacity' in value
}

function handleMotionComplete(definition: unknown): void {
  if (preferences.stageTransitionGhost?.status !== 'animating') {
    return
  }

  if (!isStageMotionTarget(definition) || definition.opacity !== 0) {
    return
  }

  preferences.clearStageTransition()
}
</script>

<template>
  <motion.div
    v-if="preferences.stageTransitionGhost"
    :key="preferences.stageTransitionGhost.id"
    class="stage-transition-ghost"
    :initial="initialRect"
    :animate="targetRect"
    :style="baseStyle"
    :transition="motionTransition"
    :on-animation-complete="handleMotionComplete"
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
  </motion.div>
</template>

<style scoped>
.stage-transition-ghost {
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
  will-change: transform, width, height, opacity, filter;
}

.stage-transition-ghost__chrome {
  display: grid;
  height: 100%;
  min-height: 0;
  grid-template-rows: auto 1fr;
  padding: clamp(0.55rem, 1rem, 1rem);
}

.stage-transition-ghost__title {
  max-width: 24rem;
  overflow: hidden;
  color: var(--foreground);
  font-size: 0.88rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage-transition-ghost__bars {
  display: grid;
  align-content: center;
  gap: 0.62rem;
  opacity: 0.6;
}

.stage-transition-ghost__bars span {
  display: block;
  height: 0.45rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 36%, var(--surface));
}

.stage-transition-ghost__bars span:nth-child(2) {
  width: 72%;
}

.stage-transition-ghost__bars span:nth-child(3) {
  width: 44%;
}
</style>
