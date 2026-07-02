<script setup lang="ts">
withDefaults(
  defineProps<{
    lines?: number
  }>(),
  {
    lines: 3
  }
)
</script>

<template>
  <div class="grid gap-2" aria-hidden="true">
    <div v-for="line in lines" :key="line" class="h-3 animate-pulse rounded-full bg-[var(--surface-raised)]" :class="line === lines ? 'w-2/3' : 'w-full'" />
  </div>
</template>
