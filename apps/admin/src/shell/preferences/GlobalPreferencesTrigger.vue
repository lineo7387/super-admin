<script setup lang="ts">
import { Settings2 } from '@lucide/vue'
import { computed } from 'vue'
import { motion, useReducedMotion } from 'motion-v'
import { AdminButton } from '@super-admin-org/ui'

const props = withDefaults(
  defineProps<{
    animatedLabel?: boolean
    label: string
    title?: string
  }>(),
  {
    animatedLabel: false,
    title: undefined
  }
)

const emit = defineEmits<{
  activate: []
}>()

const prefersReducedMotion = useReducedMotion()
const triggerTitle = computed(() => props.title ?? props.label)
const labelUnits = computed(() =>
  Array.from(props.label).map((text, index) => ({
    id: `${text}-${index}`,
    delay: index * 0.07,
    text: text === ' ' ? '\u00a0' : text
  }))
)
const labelMotionInitial = { rotateX: 0, y: 0 }
const labelMotionAnimate = computed(() =>
  props.animatedLabel && !prefersReducedMotion.value
    ? { rotateX: [0, 18, -6, 0], y: [0, -3, 1, 0] }
    : labelMotionInitial
)

function labelMotionTransition(delay: number) {
  return props.animatedLabel && !prefersReducedMotion.value
    ? {
        delay,
        duration: 0.72,
        ease: [0.22, 1, 0.36, 1],
        repeat: Infinity,
        repeatDelay: 4.15
      }
    : { duration: 0 }
}
</script>

<template>
  <AdminButton
    variant="secondary"
    size="md"
    class="global-preferences-trigger shadow-[var(--card-shadow)]"
    :aria-label="triggerTitle"
    :title="triggerTitle"
    @click="emit('activate')"
  >
    <Settings2 class="size-4" aria-hidden="true" />
    <span class="global-preferences-trigger__label" aria-hidden="true">
      <template v-if="props.animatedLabel">
        <motion.span
          v-for="unit in labelUnits"
          :key="unit.id"
          class="global-preferences-trigger__glyph"
          :initial="labelMotionInitial"
          :animate="labelMotionAnimate"
          :transition="labelMotionTransition(unit.delay)"
        >
          {{ unit.text }}
        </motion.span>
      </template>
      <template v-else>
        {{ props.label }}
      </template>
    </span>
  </AdminButton>
</template>

<style scoped>
.global-preferences-trigger {
  gap: 0.48rem;
}

.global-preferences-trigger__label {
  display: inline-flex;
  align-items: center;
  perspective: 28rem;
}

.global-preferences-trigger__glyph {
  display: inline-block;
  transform-origin: 50% 78%;
  backface-visibility: hidden;
  will-change: transform;
}
</style>
