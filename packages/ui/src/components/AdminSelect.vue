<script setup lang="ts">
const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    id?: string
    invalid?: boolean
    fluid?: boolean
  }>(),
  {
    id: undefined,
    invalid: false,
    fluid: true
  }
)
</script>

<template>
  <select
    :id="id"
    v-model="model"
    :aria-invalid="invalid"
    class="h-9 rounded-[var(--radius-md)] border bg-[var(--surface-sunken)] px-3 text-sm text-[var(--foreground)] outline-none focus-visible:shadow-[var(--focus-ring)]"
    :class="[fluid ? 'w-full' : '', invalid ? 'border-[var(--danger)]' : 'border-[var(--border)]']"
  >
    <slot />
  </select>
</template>
