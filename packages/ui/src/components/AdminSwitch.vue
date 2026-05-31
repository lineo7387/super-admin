<script setup lang="ts">
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
      class="relative inline-flex h-6 w-11 shrink-0 rounded-full border transition"
      :class="model ? 'border-[var(--primary)] bg-[var(--primary)] shadow-[var(--glow)]' : 'border-[var(--border-strong)] bg-[var(--surface-sunken)]'"
    >
      <span
        class="absolute left-px top-px size-5 rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)] transition-transform"
        :class="model ? 'translate-x-5' : 'translate-x-0'"
      />
    </span>
    <span>{{ label }}</span>
  </button>
</template>
