<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="grid gap-5">
    <header class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">UI Kit</p>
      <h1 class="mt-2 [font-family:var(--font-display)] text-3xl text-[var(--foreground)]">{{ title }}</h1>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">{{ description }}</p>
    </header>
    <slot />
  </div>
</template>
