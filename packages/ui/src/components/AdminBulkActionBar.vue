<script setup lang="ts">
import { computed } from 'vue'
import { getAdminSelectionState, type AdminSelectionLabelFormatter } from '../lib/admin-table'
import AdminButton from './AdminButton.vue'

const props = withDefaults(
  defineProps<{
    selectedCount: number
    totalCount: number
    selectionLabel?: string
    descriptionLabel?: string
    clearLabel?: string
    formatSelectionLabel?: AdminSelectionLabelFormatter
  }>(),
  {
    selectionLabel: undefined,
    descriptionLabel: 'Bulk actions apply only to the selected rows in this view.',
    clearLabel: 'Clear',
    formatSelectionLabel: undefined
  }
)

const emit = defineEmits<{
  clear: []
}>()

const selection = computed(() =>
  getAdminSelectionState(
    {
      selectedCount: props.selectedCount,
      totalCount: props.totalCount
    },
    props.formatSelectionLabel
  )
)

const selectionLabelText = computed(() => props.selectionLabel ?? selection.value.label)
</script>

<template>
  <div
    v-if="selection.selectedCount > 0"
    class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm"
    role="status"
  >
    <div class="min-w-0">
      <div class="font-medium text-[var(--foreground)]">{{ selectionLabelText }}</div>
      <div class="text-xs text-[var(--muted-foreground)]">{{ descriptionLabel }}</div>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
      <AdminButton size="sm" variant="ghost" @click="emit('clear')">{{ clearLabel }}</AdminButton>
    </div>
  </div>
</template>
