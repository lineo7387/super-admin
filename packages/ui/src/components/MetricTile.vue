<script setup lang="ts">
defineProps<{
  label: string
  value: string
  meta?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}>()
</script>

<template>
  <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
    <div class="text-xs uppercase text-[var(--muted-foreground)]">{{ label }}</div>
    <div class="mt-3 [font-family:var(--font-display)] text-3xl leading-none text-[var(--foreground)]">{{ value }}</div>
    <div
      v-if="meta"
      class="mt-3 text-xs"
      :class="{
        'text-[var(--muted-foreground)]': !tone || tone === 'neutral',
        'text-[var(--success)]': tone === 'success',
        'text-[var(--warning)]': tone === 'warning',
        'text-[var(--danger)]': tone === 'danger'
      }"
    >
      {{ meta }}
    </div>
  </div>
</template>
