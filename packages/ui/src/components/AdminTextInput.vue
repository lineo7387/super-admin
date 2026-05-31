<script setup lang="ts">
const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    id?: string
    type?: 'text' | 'email' | 'password' | 'search' | 'url'
    placeholder?: string
    invalid?: boolean
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    id: undefined,
    type: 'text',
    placeholder: undefined,
    invalid: false,
    disabled: false,
    readonly: false
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
    :disabled="disabled"
    :readonly="readonly"
    class="h-9 w-full rounded-[var(--radius-md)] border bg-[var(--surface-sunken)] px-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
    :class="[invalid ? 'border-[var(--danger)]' : 'border-[var(--border)]', readonly ? 'bg-[var(--surface-raised)]' : '']"
  />
</template>
