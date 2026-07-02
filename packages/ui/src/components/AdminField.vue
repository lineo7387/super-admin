<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    for?: string
    help?: string
    error?: string
    required?: boolean
    requiredLabel?: string
    optional?: boolean
    optionalLabel?: string
  }>(),
  {
    for: undefined,
    help: undefined,
    error: undefined,
    required: false,
    requiredLabel: 'Required',
    optional: false,
    optionalLabel: 'Optional'
  }
)
</script>

<template>
  <div class="grid gap-2">
    <label :for="props.for" class="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="text-xs font-normal text-[var(--danger)]">{{ props.requiredLabel }}</span>
      <span v-else-if="props.optional" class="text-xs font-normal text-[var(--muted-foreground)]">{{ props.optionalLabel }}</span>
    </label>
    <slot />
    <p v-if="props.error" class="text-xs text-[var(--danger)]">{{ props.error }}</p>
    <p v-else-if="props.help" class="text-xs leading-5 text-[var(--muted-foreground)]">{{ props.help }}</p>
  </div>
</template>
