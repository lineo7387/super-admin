<script setup lang="ts">
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-vue-next'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tone?: 'info' | 'success' | 'warning' | 'danger'
    title: string
    description?: string
  }>(),
  {
    tone: 'info',
    description: undefined
  }
)

const icon = computed(() => {
  if (props.tone === 'success') {
    return CheckCircle2
  }
  if (props.tone === 'warning') {
    return AlertTriangle
  }
  if (props.tone === 'danger') {
    return XCircle
  }
  return Info
})

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
  return 'var(--primary)'
})

const style = computed(() => ({
  borderColor: `color-mix(in srgb, ${toneColor.value} 42%, var(--border))`,
  backgroundColor: `color-mix(in srgb, ${toneColor.value} 10%, var(--surface))`,
  color: toneColor.value
}))
</script>

<template>
  <section class="flex gap-3 rounded-[var(--radius-md)] border p-3 text-sm shadow-[var(--card-shadow)]" :style="style">
    <component :is="icon" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <div class="min-w-0">
      <h3 class="font-medium text-[var(--foreground)]">{{ title }}</h3>
      <p v-if="description" class="mt-1 leading-5 text-[var(--muted-foreground)]">{{ description }}</p>
      <div v-if="$slots.default" class="mt-3 text-[var(--foreground)]">
        <slot />
      </div>
    </div>
  </section>
</template>
