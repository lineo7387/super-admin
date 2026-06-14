<script setup lang="ts">
withDefaults(
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
    <label :for="for" class="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
      <span>{{ label }}</span>
      <span v-if="required" class="text-xs font-normal text-[var(--danger)]">{{ requiredLabel }}</span>
      <span v-else-if="optional" class="text-xs font-normal text-[var(--muted-foreground)]">{{ optionalLabel }}</span>
    </label>
    <slot />
    <p v-if="error" class="text-xs text-[var(--danger)]">{{ error }}</p>
    <p v-else-if="help" class="text-xs leading-5 text-[var(--muted-foreground)]">{{ help }}</p>
  </div>
</template>
