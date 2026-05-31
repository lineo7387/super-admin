<script setup lang="ts">
import { computed } from 'vue'
import { getAdminPaginationRange } from '../lib/admin-table'
import AdminButton from './AdminButton.vue'

const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const range = computed(() =>
  getAdminPaginationRange({
    page: props.page,
    pageSize: props.pageSize,
    total: props.total
  })
)
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
    <div>{{ range.label }}</div>
    <div class="flex items-center gap-2">
      <AdminButton size="sm" variant="secondary" :disabled="range.page <= 1" @click="emit('pageChange', range.page - 1)">Previous</AdminButton>
      <span class="min-w-16 text-center">Page {{ range.page }} / {{ range.pageCount }}</span>
      <AdminButton size="sm" variant="secondary" :disabled="range.page >= range.pageCount" @click="emit('pageChange', range.page + 1)">Next</AdminButton>
    </div>
  </div>
</template>
