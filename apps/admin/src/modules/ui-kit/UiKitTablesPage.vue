<script setup lang="ts">
import { ArrowDownAZ, ArrowUpAZ, Search, Settings2, Trash2 } from '@lucide/vue'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  AdminBulkActionBar,
  AdminButton,
  AdminCheckbox,
  AdminDataTable,
  AdminPagination,
  AdminTableFrame,
  AdminTableToolbar,
  AdminTextInput,
  StatusPill,
  getAdminPaginationRange,
  getAdminSelectionState
} from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

type ViewRowStatus = 'Ready' | 'Review' | 'Blocked'
type ViewRowRisk = 'Low' | 'Medium' | 'High'
type ViewRowUpdated = 'today' | 'yesterday' | 'twoDays'
type ViewRowName = 'revenueReview' | 'accessAudit' | 'queueHealth' | 'providerDrift'

type ViewRow = {
  id: string
  nameKey: ViewRowName
  owner: string
  status: ViewRowStatus
  risk: ViewRowRisk
  updatedKey: ViewRowUpdated
}

const { t } = useI18n()
const search = shallowRef('')
const page = shallowRef(1)
const density = shallowRef<'compact' | 'comfortable'>('comfortable')
const sortDirection = shallowRef<'asc' | 'desc'>('asc')
const selectedIds = shallowRef<string[]>(['view-1', 'view-3'])

const rows: ViewRow[] = [
  { id: 'view-1', nameKey: 'revenueReview', owner: 'Mira Chen', status: 'Ready', risk: 'Low', updatedKey: 'today' },
  { id: 'view-2', nameKey: 'accessAudit', owner: 'Jon Bell', status: 'Review', risk: 'Medium', updatedKey: 'yesterday' },
  { id: 'view-3', nameKey: 'queueHealth', owner: 'Ana Torres', status: 'Ready', risk: 'Low', updatedKey: 'today' },
  { id: 'view-4', nameKey: 'providerDrift', owner: 'Iris Park', status: 'Blocked', risk: 'High', updatedKey: 'twoDays' }
]

const visibleRows = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  const filteredRows = keyword
    ? rows.filter((row) => [t(`uiKit.tables.rows.${row.nameKey}`), row.owner, row.status, row.risk].some((value) => value.toLowerCase().includes(keyword)))
    : rows

  return [...filteredRows].sort((left, right) => {
    const comparison = t(`uiKit.tables.rows.${left.nameKey}`).localeCompare(t(`uiKit.tables.rows.${right.nameKey}`))
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

const selectedCount = computed(() => selectedIds.value.filter((id) => visibleRows.value.some((row) => row.id === id)).length)
const selectionState = computed(() =>
  getAdminSelectionState({
    selectedCount: selectedCount.value,
    totalCount: visibleRows.value.length
  })
)
const bulkSelectionLabel = computed(() => {
  const { selectedCount, totalCount, checked, indeterminate } = selectionState.value
  if (checked) {
    return t('common.primitives.bulkSelectionAll', { count: totalCount })
  }
  if (indeterminate) {
    return t('common.primitives.bulkSelectionSome', { selected: selectedCount, total: totalCount })
  }
  return t('common.primitives.bulkSelectionNone')
})

const paginationRange = computed(() => getAdminPaginationRange({ page: page.value, pageSize: 4, total: 24 }))
const paginationRangeLabel = computed(() =>
  t('uiKit.tables.paginationRange', { start: paginationRange.value.start, end: paginationRange.value.end, total: 24 })
)
const paginationPageLabel = computed(() => t('uiKit.tables.paginationPage', { page: paginationRange.value.page, pageCount: paginationRange.value.pageCount }))

function rowPadding(): string {
  return density.value === 'compact' ? 'py-2' : 'py-3'
}

function rowName(row: ViewRow): string {
  return t(`uiKit.tables.rows.${row.nameKey}`)
}

function statusTone(status: ViewRowStatus): 'success' | 'warning' | 'danger' {
  if (status === 'Ready') {
    return 'success'
  }
  if (status === 'Review') {
    return 'warning'
  }
  return 'danger'
}

function statusLabel(status: ViewRowStatus): string {
  return t(`uiKit.tables.statusLabels.${status.toLowerCase()}`)
}

function riskTone(risk: ViewRowRisk): 'neutral' | 'warning' | 'danger' {
  if (risk === 'High') {
    return 'danger'
  }
  if (risk === 'Medium') {
    return 'warning'
  }
  return 'neutral'
}

function riskLabel(risk: ViewRowRisk): string {
  return t(`uiKit.tables.riskLabels.${risk.toLowerCase()}`)
}

function updatedLabel(updatedKey: ViewRowUpdated): string {
  return t(`uiKit.tables.updatedLabels.${updatedKey}`)
}

function isSelected(id: string): boolean {
  return selectedIds.value.includes(id)
}

function setRowSelected(id: string, selected: boolean): void {
  selectedIds.value = selected ? Array.from(new Set([...selectedIds.value, id])) : selectedIds.value.filter((selectedId) => selectedId !== id)
}

function setAllSelected(selected: boolean): void {
  selectedIds.value = selected ? visibleRows.value.map((row) => row.id) : []
}
</script>

<template>
  <UiKitPage :title="t('uiKit.page.tables.title')" :description="t('uiKit.page.tables.description')">
    <AdminTableFrame :title="t('uiKit.tables.frameTitle')" :description="t('uiKit.tables.frameDescription')">
      <template #toolbar>
        <AdminTableToolbar>
          <template #filters>
            <label class="flex h-9 min-w-64 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-3">
              <Search class="size-4 text-[var(--muted-foreground)]" />
              <AdminTextInput v-model="search" class="border-0 bg-transparent px-0 shadow-none" :placeholder="t('uiKit.tables.searchViews')" />
            </label>
          </template>
          <template #actions>
            <AdminButton size="sm" variant="secondary" @click="density = density === 'compact' ? 'comfortable' : 'compact'">
              <Settings2 class="size-4" />
              {{ density === 'compact' ? t('uiKit.tables.comfortable') : t('uiKit.tables.compact') }}
            </AdminButton>
            <AdminButton size="sm" variant="secondary" @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'">
              <component :is="sortDirection === 'asc' ? ArrowDownAZ : ArrowUpAZ" class="size-4" />
              {{ t('uiKit.tables.sort') }}
            </AdminButton>
            <AdminButton size="sm" variant="primary">{{ t('uiKit.tables.newView') }}</AdminButton>
          </template>
        </AdminTableToolbar>
      </template>
      <AdminBulkActionBar
        :selected-count="selectedCount"
        :total-count="visibleRows.length"
        :selection-label="bulkSelectionLabel"
        :description-label="t('common.primitives.bulkDescription')"
        :clear-label="t('common.primitives.clear')"
        @clear="selectedIds = []"
      >
        <template #actions>
          <AdminButton size="sm" variant="secondary">{{ t('uiKit.tables.assignOwner') }}</AdminButton>
          <AdminButton size="sm" variant="danger"><Trash2 class="size-4" />{{ t('uiKit.tables.archive') }}</AdminButton>
        </template>
      </AdminBulkActionBar>
      <AdminDataTable state="idle" :density="density" :column-count="7">
        <template #head>
          <tr>
            <th class="w-10 px-3 py-3 font-medium">
              <AdminCheckbox
                :model-value="selectionState.checked"
                :indeterminate="selectionState.indeterminate"
                :aria-label="t('uiKit.tables.selectAll')"
                @update:model-value="setAllSelected"
              />
            </th>
            <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.name') }}</th>
            <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.owner') }}</th>
            <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.status') }}</th>
            <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.risk') }}</th>
            <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.updated') }}</th>
            <th class="w-16 px-3 py-3 font-medium">
              <span class="sr-only">{{ t('uiKit.tables.columns.actions') }}</span>
            </th>
          </tr>
        </template>
        <tr v-for="row in visibleRows" :key="row.id" class="border-t border-[var(--border)] bg-[var(--surface)]">
          <td class="px-3" :class="rowPadding()">
            <AdminCheckbox
              :model-value="isSelected(row.id)"
              :aria-label="t('uiKit.tables.selectRow', { name: rowName(row) })"
              @update:model-value="setRowSelected(row.id, $event)"
            />
          </td>
          <td class="px-3 font-medium text-[var(--foreground)]" :class="rowPadding()">{{ rowName(row) }}</td>
          <td class="px-3 text-[var(--muted-foreground)]" :class="rowPadding()">{{ row.owner }}</td>
          <td class="px-3" :class="rowPadding()">
            <StatusPill :label="statusLabel(row.status)" :tone="statusTone(row.status)" />
          </td>
          <td class="px-3" :class="rowPadding()">
            <StatusPill :label="riskLabel(row.risk)" :tone="riskTone(row.risk)" />
          </td>
          <td class="px-3 text-[var(--muted-foreground)]" :class="rowPadding()">{{ updatedLabel(row.updatedKey) }}</td>
          <td class="px-3" :class="rowPadding()">
            <AdminButton size="sm" variant="ghost">{{ t('uiKit.tables.open') }}</AdminButton>
          </td>
        </tr>
      </AdminDataTable>
      <AdminPagination
        :page="page"
        :page-size="4"
        :total="24"
        :next-label="t('common.primitives.next')"
        :page-label="paginationPageLabel"
        :previous-label="t('common.primitives.previous')"
        :range-label="paginationRangeLabel"
        @page-change="page = $event"
      />
    </AdminTableFrame>

    <section class="grid gap-4 lg:grid-cols-3">
      <AdminTableFrame :title="t('uiKit.tables.loadingTitle')" :description="t('uiKit.tables.loadingDescription')">
        <AdminDataTable state="loading" density="compact" :column-count="4">
          <template #head>
            <tr>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.name') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.owner') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.status') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.updated') }}</th>
            </tr>
          </template>
        </AdminDataTable>
      </AdminTableFrame>
      <AdminTableFrame :title="t('uiKit.tables.emptyTitle')" :description="t('uiKit.tables.emptyDescription')">
        <AdminDataTable
          state="empty"
          density="compact"
          :column-count="4"
          :empty-title="t('uiKit.tables.emptyTitle')"
          :empty-description="t('uiKit.tables.emptyDescription')"
        >
          <template #head>
            <tr>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.name') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.owner') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.status') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.updated') }}</th>
            </tr>
          </template>
        </AdminDataTable>
      </AdminTableFrame>
      <AdminTableFrame :title="t('uiKit.tables.errorTitle')" :description="t('uiKit.tables.errorDescription')">
        <AdminDataTable
          state="error"
          density="compact"
          :column-count="4"
          :error-title="t('uiKit.tables.errorTitle')"
          :error-description="t('uiKit.tables.errorDescription')"
        >
          <template #head>
            <tr>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.name') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.owner') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.status') }}</th>
              <th class="px-3 py-3 font-medium">{{ t('uiKit.tables.columns.updated') }}</th>
            </tr>
          </template>
          <template #error-action>
            <AdminButton size="sm">{{ t('uiKit.tables.retry') }}</AdminButton>
          </template>
        </AdminDataTable>
      </AdminTableFrame>
    </section>
  </UiKitPage>
</template>
