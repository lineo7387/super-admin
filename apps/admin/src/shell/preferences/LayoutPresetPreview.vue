<script setup lang="ts">
import type { LayoutPreviewPresentation } from '../layout-registry'

const props = defineProps<{
  presentation: LayoutPreviewPresentation
}>()
</script>

<template>
  <div
    data-layout-preview-surface="compact"
    class="grid h-24 gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-sunken)] p-2"
    :style="{
      gridTemplateColumns: props.presentation.compact.gridTemplateColumns,
      gridTemplateRows: props.presentation.compact.gridTemplateRows
    }"
  >
    <span v-if="props.presentation.showDock" class="rounded-[var(--radius-xs)] bg-[var(--primary)]" />
    <span v-if="props.presentation.showSidebar" class="rounded-[var(--radius-xs)] bg-[var(--surface-raised)]" />
    <span v-if="props.presentation.showTopNavigation" class="rounded-[var(--radius-xs)] bg-[var(--primary)]" />
    <span class="rounded-[var(--radius-xs)] bg-[var(--accent)] opacity-60" />
  </div>
</template>
