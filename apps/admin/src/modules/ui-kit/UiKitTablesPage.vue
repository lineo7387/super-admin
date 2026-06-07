<script setup lang="ts">
import { ArrowDownAZ, ArrowUpAZ, Search, Settings2, Trash2 } from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
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
  getAdminSelectionState
} from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

type ViewRow = {
  id: string
  name: string
  owner: string
  status: 'Ready' | 'Review' | 'Blocked'
  risk: 'Low' | 'Medium' | 'High'
  updated: string
}

const search = shallowRef('')
const page = shallowRef(1)
const density = shallowRef<'compact' | 'comfortable'>('comfortable')
const sortDirection = shallowRef<'asc' | 'desc'>('asc')
const selectedIds = shallowRef<string[]>(['view-1', 'view-3'])

const rows: ViewRow[] = [
  { id: 'view-1', name: 'Revenue Review', owner: 'Mira Chen', status: 'Ready', risk: 'Low', updated: 'Today' },
  { id: 'view-2', name: 'Access Audit', owner: 'Jon Bell', status: 'Review', risk: 'Medium', updated: 'Yesterday' },
  { id: 'view-3', name: 'Queue Health', owner: 'Ana Torres', status: 'Ready', risk: 'Low', updated: 'Today' },
  { id: 'view-4', name: 'Provider Drift', owner: 'Iris Park', status: 'Blocked', risk: 'High', updated: '2 days ago' }
]

const visibleRows = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  const filteredRows = keyword
    ? rows.filter((row) => [row.name, row.owner, row.status, row.risk].some((value) => value.toLowerCase().includes(keyword)))
    : rows

  return [...filteredRows].sort((left, right) => {
    const comparison = left.name.localeCompare(right.name)
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

function rowPadding(): string {
  return density.value === 'compact' ? 'py-2' : 'py-3'
}

function statusTone(status: ViewRow['status']): 'success' | 'warning' | 'danger' {
  if (status === 'Ready') {
    return 'success'
  }
  if (status === 'Review') {
    return 'warning'
  }
  return 'danger'
}

function riskTone(risk: ViewRow['risk']): 'neutral' | 'warning' | 'danger' {
  if (risk === 'High') {
    return 'danger'
  }
  if (risk === 'Medium') {
    return 'warning'
  }
  return 'neutral'
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
  <UiKitPage title="Tables" description="Composable table frame, toolbar, loading/empty/error states, status pills, and pagination controls.">
    <AdminTableFrame title="Operational Views" description="A compact data-table composition using the shared table primitives.">
      <template #toolbar>
        <AdminTableToolbar>
          <template #filters>
            <label class="flex h-9 min-w-64 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-3">
              <Search class="size-4 text-[var(--muted-foreground)]" />
              <AdminTextInput v-model="search" class="border-0 bg-transparent px-0 shadow-none" placeholder="Search views" />
            </label>
          </template>
          <template #actions>
            <AdminButton size="sm" variant="secondary" @click="density = density === 'compact' ? 'comfortable' : 'compact'">
              <Settings2 class="size-4" />
              {{ density === 'compact' ? 'Comfortable' : 'Compact' }}
            </AdminButton>
            <AdminButton size="sm" variant="secondary" @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'">
              <component :is="sortDirection === 'asc' ? ArrowDownAZ : ArrowUpAZ" class="size-4" />
              Sort
            </AdminButton>
            <AdminButton size="sm" variant="primary">New view</AdminButton>
          </template>
        </AdminTableToolbar>
      </template>
      <AdminBulkActionBar :selected-count="selectedCount" :total-count="visibleRows.length" @clear="selectedIds = []">
        <template #actions>
          <AdminButton size="sm" variant="secondary">Assign owner</AdminButton>
          <AdminButton size="sm" variant="danger"><Trash2 class="size-4" />Archive</AdminButton>
        </template>
      </AdminBulkActionBar>
      <AdminDataTable state="idle" :density="density" :column-count="7">
        <template #head>
          <tr>
            <th class="w-10 px-3 py-3 font-medium">
              <AdminCheckbox
                :model-value="selectionState.checked"
                :indeterminate="selectionState.indeterminate"
                aria-label="Select all rows"
                @update:model-value="setAllSelected"
              />
            </th>
            <th class="px-3 py-3 font-medium">Name</th>
            <th class="px-3 py-3 font-medium">Owner</th>
            <th class="px-3 py-3 font-medium">Status</th>
            <th class="px-3 py-3 font-medium">Risk</th>
            <th class="px-3 py-3 font-medium">Updated</th>
            <th class="w-16 px-3 py-3 font-medium"><span class="sr-only">Actions</span></th>
          </tr>
        </template>
        <tr v-for="row in visibleRows" :key="row.id" class="border-t border-[var(--border)] bg-[var(--surface)]">
          <td class="px-3" :class="rowPadding()">
            <AdminCheckbox :model-value="isSelected(row.id)" :aria-label="`Select ${row.name}`" @update:model-value="setRowSelected(row.id, $event)" />
          </td>
          <td class="px-3 font-medium text-[var(--foreground)]" :class="rowPadding()">{{ row.name }}</td>
          <td class="px-3 text-[var(--muted-foreground)]" :class="rowPadding()">{{ row.owner }}</td>
          <td class="px-3" :class="rowPadding()">
            <StatusPill :label="row.status" :tone="statusTone(row.status)" />
          </td>
          <td class="px-3" :class="rowPadding()">
            <StatusPill :label="row.risk" :tone="riskTone(row.risk)" />
          </td>
          <td class="px-3 text-[var(--muted-foreground)]" :class="rowPadding()">{{ row.updated }}</td>
          <td class="px-3" :class="rowPadding()">
            <AdminButton size="sm" variant="ghost">Open</AdminButton>
          </td>
        </tr>
      </AdminDataTable>
      <AdminPagination :page="page" :page-size="4" :total="24" @page-change="page = $event" />
    </AdminTableFrame>

    <section class="grid gap-4 lg:grid-cols-3">
      <AdminTableFrame title="Loading" description="Skeleton rows preserve table structure while a query resolves.">
        <AdminDataTable state="loading" density="compact" :column-count="4">
          <template #head>
            <tr>
              <th class="px-3 py-3 font-medium">Name</th>
              <th class="px-3 py-3 font-medium">Owner</th>
              <th class="px-3 py-3 font-medium">Status</th>
              <th class="px-3 py-3 font-medium">Updated</th>
            </tr>
          </template>
        </AdminDataTable>
      </AdminTableFrame>
      <AdminTableFrame title="Empty" description="Empty states stay inside the table body.">
        <AdminDataTable state="empty" density="compact" :column-count="4" empty-title="No matching views" empty-description="Change filters or create the first operational view.">
          <template #head>
            <tr>
              <th class="px-3 py-3 font-medium">Name</th>
              <th class="px-3 py-3 font-medium">Owner</th>
              <th class="px-3 py-3 font-medium">Status</th>
              <th class="px-3 py-3 font-medium">Updated</th>
            </tr>
          </template>
        </AdminDataTable>
      </AdminTableFrame>
      <AdminTableFrame title="Error" description="Recovery actions slot into the error state.">
        <AdminDataTable state="error" density="compact" :column-count="4" error-title="Unable to load views" error-description="The API adapter can surface retry actions here.">
          <template #head>
            <tr>
              <th class="px-3 py-3 font-medium">Name</th>
              <th class="px-3 py-3 font-medium">Owner</th>
              <th class="px-3 py-3 font-medium">Status</th>
              <th class="px-3 py-3 font-medium">Updated</th>
            </tr>
          </template>
          <template #error-action>
            <AdminButton size="sm">Retry</AdminButton>
          </template>
        </AdminDataTable>
      </AdminTableFrame>
    </section>
  </UiKitPage>
</template>
