<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { AdminButton, AdminDataTable, AdminPagination, getAdminPaginationRange, StatusPill } from '@super-admin-org/ui'
import type { UserRecord, UserStatus } from '../users.types'

const props = withDefaults(
  defineProps<{
    users: UserRecord[]
    total: number
    page: number
    pageSize: number
    state: 'idle' | 'loading' | 'empty' | 'error'
    density: 'compact' | 'comfortable'
    visibleColumns: string[]
  }>(),
  {
    users: () => [],
    total: 0
  }
)

const emit = defineEmits<{
  edit: [user: UserRecord]
  pageChange: [page: number]
  retry: []
}>()
const { t } = useI18n()
const paginationRange = computed(() =>
  getAdminPaginationRange({
    page: props.page,
    pageSize: props.pageSize,
    total: props.total
  })
)
const paginationRangeLabel = computed(() =>
  t('users.all.paginationRange', {
    end: paginationRange.value.end,
    start: paginationRange.value.start,
    total: props.total
  })
)
const paginationPageLabel = computed(() =>
  t('users.all.paginationPage', {
    page: paginationRange.value.page,
    pageCount: paginationRange.value.pageCount
  })
)

function isVisible(column: string): boolean {
  return props.visibleColumns.includes(column)
}

function statusTone(status: UserStatus): 'neutral' | 'success' | 'warning' | 'danger' {
  if (status === 'active') {
    return 'success'
  }
  if (status === 'review') {
    return 'warning'
  }
  return 'neutral'
}

function statusLabel(status: UserStatus): string {
  if (status === 'active') {
    return t('users.statuses.active')
  }
  if (status === 'review') {
    return t('users.statuses.review')
  }
  return t('users.statuses.paused')
}
</script>

<template>
  <AdminDataTable
    :state="state"
    :density="density"
    :column-count="visibleColumns.length + 1"
    :empty-title="t('users.all.emptyTitle')"
    :empty-description="t('users.all.emptyDescription')"
    :error-title="t('users.all.errorTitle')"
    :error-description="t('users.all.errorDescription')"
  >
    <template #head>
      <tr>
        <th v-if="isVisible('name')" class="px-3 py-3 font-medium">{{ t('users.form.name') }}</th>
        <th v-if="isVisible('email')" class="px-3 py-3 font-medium">{{ t('users.form.email') }}</th>
        <th v-if="isVisible('role')" class="px-3 py-3 font-medium">{{ t('users.form.role') }}</th>
        <th v-if="isVisible('region')" class="px-3 py-3 font-medium">{{ t('users.form.region') }}</th>
        <th v-if="isVisible('status')" class="px-3 py-3 font-medium">{{ t('users.form.status') }}</th>
        <th class="w-12 px-3 py-3 font-medium"><span class="sr-only">{{ t('users.all.actions') }}</span></th>
      </tr>
    </template>
    <template #error-action>
      <AdminButton size="sm" @click="emit('retry')">{{ t('users.all.retry') }}</AdminButton>
    </template>
    <tr v-for="user in users" :key="user.id" class="border-t border-[var(--border)] bg-[var(--surface)]">
      <td v-if="isVisible('name')" class="px-3 text-[var(--foreground)]" :class="density === 'compact' ? 'py-2' : 'py-3'">
        <div class="font-medium">{{ user.name }}</div>
        <div class="text-xs text-[var(--muted-foreground)]">{{ user.id }}</div>
      </td>
      <td v-if="isVisible('email')" class="px-3 text-[var(--muted-foreground)]" :class="density === 'compact' ? 'py-2' : 'py-3'">
        {{ user.email }}
      </td>
      <td v-if="isVisible('role')" class="px-3 text-[var(--muted-foreground)]" :class="density === 'compact' ? 'py-2' : 'py-3'">
        {{ user.role }}
      </td>
      <td v-if="isVisible('region')" class="px-3 text-[var(--muted-foreground)]" :class="density === 'compact' ? 'py-2' : 'py-3'">
        {{ user.region }}
      </td>
      <td v-if="isVisible('status')" class="px-3" :class="density === 'compact' ? 'py-2' : 'py-3'">
        <StatusPill :label="statusLabel(user.status)" :tone="statusTone(user.status)" />
      </td>
      <td class="px-3" :class="density === 'compact' ? 'py-2' : 'py-3'">
        <AdminButton size="icon" variant="ghost" :title="t('users.all.edit', { name: user.name })" @click="emit('edit', user)">
          <MoreHorizontal class="size-4" />
        </AdminButton>
      </td>
    </tr>
  </AdminDataTable>
  <AdminPagination
    :page="page"
    :page-size="pageSize"
    :total="total"
    :next-label="t('users.all.next')"
    :page-label="paginationPageLabel"
    :previous-label="t('users.all.previous')"
    :range-label="paginationRangeLabel"
    @page-change="emit('pageChange', $event)"
  />
</template>
