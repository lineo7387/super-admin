<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    tone?: 'neutral' | 'success' | 'warning' | 'danger'
  }>(),
  {
    tone: 'neutral'
  }
)

const toneColor = computed(() => {
  if (props.tone === 'success') {
    return 'var(--success)'
  }
  if (props.tone === 'warning') {
    return 'var(--warning)'
  }
  if (props.tone === 'danger') {
    return 'var(--danger)'
  }
  return 'var(--muted-foreground)'
})

const style = computed(() => ({
  color: toneColor.value,
  borderColor: props.tone === 'neutral' ? 'var(--border)' : `color-mix(in srgb, ${toneColor.value} 45%, transparent)`,
  backgroundColor: props.tone === 'neutral' ? 'var(--surface-raised)' : `color-mix(in srgb, ${toneColor.value} 12%, transparent)`
}))
</script>

<template>
  <span class="inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium" :style="style">
    {{ label }}
  </span>
</template>
