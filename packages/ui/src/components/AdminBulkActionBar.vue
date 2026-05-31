<script setup lang="ts">
import { computed } from 'vue'
import { getAdminSelectionState } from '../lib/admin-table'
import AdminButton from './AdminButton.vue'

const props = defineProps<{
  selectedCount: number
  totalCount: number
}>()

const emit = defineEmits<{
  clear: []
}>()

const selection = computed(() =>
  getAdminSelectionState({
    selectedCount: props.selectedCount,
    totalCount: props.totalCount
  })
)
</script>

<template>
  <div
    v-if="selection.selectedCount > 0"
    class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm"
    role="status"
  >
    <div class="min-w-0">
      <div class="font-medium text-[var(--foreground)]">{{ selection.label }}</div>
      <div class="text-xs text-[var(--muted-foreground)]">Bulk actions apply only to the selected rows in this view.</div>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
      <AdminButton size="sm" variant="ghost" @click="emit('clear')">Clear</AdminButton>
    </div>
  </div>
</template>
