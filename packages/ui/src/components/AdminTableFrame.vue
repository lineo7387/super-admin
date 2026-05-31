<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: undefined,
    description: undefined
  }
)
</script>

<template>
  <section class="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
    <div v-if="title || description || $slots.toolbar" class="border-b border-[var(--border)] p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div v-if="title || description" class="min-w-0">
          <h2 v-if="title" class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">{{ title }}</h2>
          <p v-if="description" class="mt-1 text-sm text-[var(--muted-foreground)]">{{ description }}</p>
        </div>
        <div v-if="$slots.toolbar" class="flex min-w-0 flex-wrap items-center gap-2">
          <slot name="toolbar" />
        </div>
      </div>
    </div>
    <slot />
  </section>
</template>
