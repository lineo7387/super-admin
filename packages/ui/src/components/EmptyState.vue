<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div
    class="grid min-h-40 place-items-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--surface-sunken)] p-8 text-center"
  >
    <div>
      <h3 class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">{{ title }}</h3>
      <p v-if="description" class="mt-2 max-w-md text-sm text-[var(--muted-foreground)]">{{ description }}</p>
      <div v-if="$slots.default" class="mt-4">
        <slot />
      </div>
    </div>
  </div>
</template>
