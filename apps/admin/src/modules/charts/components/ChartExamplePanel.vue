<script setup lang="ts">
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  title: string
  description: string
  option: EChartsOption
}>()
</script>

<template>
  <section class="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
    <div class="flex min-h-16 flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">{{ props.title }}</h2>
        <p class="mt-1 max-w-xl text-sm text-[var(--muted-foreground)]">{{ props.description }}</p>
      </div>
    </div>
    <div class="mt-4 h-72 min-h-72 min-w-0 overflow-hidden">
      <VChart :option="props.option" autoresize class="h-full w-full" />
    </div>
  </section>
</template>
