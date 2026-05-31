<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

const model = defineModel<boolean>({ required: true })

withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
  }>(),
  {
    label: '',
    disabled: false
  }
)

const knobStyle = computed<CSSProperties>(() => ({
  backgroundColor: 'var(--surface)',
  borderColor: 'var(--border)',
  height: '20px',
  left: '1px',
  position: 'absolute',
  top: '1px',
  transform: model.value ? 'translateX(20px)' : 'translateX(0)',
  width: '20px'
}))

const trackStyle = computed<CSSProperties>(() => ({
  backgroundColor: model.value ? 'var(--primary)' : 'var(--surface-sunken)',
  borderColor: model.value ? 'var(--primary)' : 'var(--border-strong)',
  boxShadow: model.value ? 'var(--glow)' : 'none',
  height: '24px',
  width: '44px'
}))
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    class="inline-flex items-center gap-3 rounded-[var(--radius-md)] text-sm text-[var(--foreground)] outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
    @click="model = !model"
  >
    <span
      class="relative inline-flex shrink-0 rounded-full border transition"
      :style="trackStyle"
    >
      <span
        class="rounded-full border shadow-[var(--card-shadow)] transition"
        :style="knobStyle"
      />
    </span>
    <span>{{ label }}</span>
  </button>
</template>
