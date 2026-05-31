<script setup lang="ts">
const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    id?: string
    placeholder?: string
    invalid?: boolean
  }>(),
  {
    id: undefined,
    placeholder: undefined,
    invalid: false
  }
)
</script>

<template>
  <textarea
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    :aria-invalid="invalid"
    rows="4"
    class="w-full resize-none rounded-[var(--radius-md)] border bg-[var(--surface-sunken)] px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus-visible:shadow-[var(--focus-ring)]"
    :class="invalid ? 'border-[var(--danger)]' : 'border-[var(--border)]'"
  />
</template>
