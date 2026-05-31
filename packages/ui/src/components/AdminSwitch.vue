<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

withDefaults(
  defineProps<{
    label: string
  }>(),
  {
    label: ''
  }
)
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    class="inline-flex items-center gap-2 text-sm text-[var(--foreground)] outline-none focus-visible:shadow-[var(--focus-ring)]"
    @click="model = !model"
  >
    <span
      class="relative inline-flex h-5 w-9 rounded-full border transition"
      :class="model ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border)] bg-[var(--surface-raised)]'"
    >
      <span
        class="absolute top-0.5 size-4 rounded-full bg-[var(--primary-foreground)] transition"
        :class="model ? 'left-4' : 'left-0.5'"
      />
    </span>
    <span>{{ label }}</span>
  </button>
</template>
