<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../lib/cn'

const props = withDefaults(
  defineProps<{
    padded?: boolean
    interactive?: boolean
  }>(),
  {
    padded: true,
    interactive: false
  }
)

const classes = computed(() =>
  cn(
    'border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]',
    'rounded-[var(--radius-lg)]',
    props.padded && 'p-4',
    props.interactive && 'transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]'
  )
)
</script>

<template>
  <section :class="classes">
    <slot />
  </section>
</template>
