<script setup lang="ts">
const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    id?: string
    type?: 'text' | 'email'
    placeholder?: string
    invalid?: boolean
  }>(),
  {
    id: undefined,
    type: 'text',
    placeholder: undefined,
    invalid: false
  }
)
</script>

<template>
  <input
    :id="id"
    v-model="model"
    :type="type"
    :placeholder="placeholder"
    :aria-invalid="invalid"
    class="h-9 w-full rounded-[var(--radius-md)] border bg-[var(--surface-sunken)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus-visible:shadow-[var(--focus-ring)]"
    :class="invalid ? 'border-[var(--danger)]' : 'border-[var(--border)]'"
  />
</template>
