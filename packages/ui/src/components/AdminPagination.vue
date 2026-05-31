<script setup lang="ts">
import { computed } from 'vue'
import AdminButton from './AdminButton.vue'

const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const rangeStart = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const rangeEnd = computed(() => Math.min(props.total, props.page * props.pageSize))
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
    <div>{{ rangeStart }}-{{ rangeEnd }} of {{ total }}</div>
    <div class="flex items-center gap-2">
      <AdminButton size="sm" variant="secondary" :disabled="page <= 1" @click="emit('pageChange', page - 1)">Previous</AdminButton>
      <span class="min-w-16 text-center">Page {{ page }} / {{ pageCount }}</span>
      <AdminButton size="sm" variant="secondary" :disabled="page >= pageCount" @click="emit('pageChange', page + 1)">Next</AdminButton>
    </div>
  </div>
</template>
