<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    for?: string
    help?: string
    error?: string
  }>(),
  {
    for: undefined,
    help: undefined,
    error: undefined
  }
)
</script>

<template>
  <div class="grid gap-2">
    <label :for="for" class="text-sm font-medium text-[var(--foreground)]">{{ label }}</label>
    <slot />
    <p v-if="error" class="text-xs text-[var(--danger)]">{{ error }}</p>
    <p v-else-if="help" class="text-xs leading-5 text-[var(--muted-foreground)]">{{ help }}</p>
  </div>
</template>
