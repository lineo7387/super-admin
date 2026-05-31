<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { shallowRef } from 'vue'
import { AdminButton, AdminDataTable, AdminPagination, AdminTableFrame, AdminTableToolbar, AdminTextInput, StatusPill } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const search = shallowRef('')
const page = shallowRef(1)

const rows = [
  { id: 'view-1', name: 'Revenue Review', owner: 'Mira Chen', status: 'Ready' },
  { id: 'view-2', name: 'Access Audit', owner: 'Jon Bell', status: 'Review' },
  { id: 'view-3', name: 'Queue Health', owner: 'Ana Torres', status: 'Ready' }
]
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
            <AdminButton size="sm" variant="primary">New view</AdminButton>
          </template>
        </AdminTableToolbar>
      </template>
      <AdminDataTable state="idle" density="comfortable" :column-count="4">
        <template #head>
          <tr>
            <th class="px-3 py-3 font-medium">Name</th>
            <th class="px-3 py-3 font-medium">Owner</th>
            <th class="px-3 py-3 font-medium">Status</th>
            <th class="px-3 py-3 font-medium">Updated</th>
          </tr>
        </template>
        <tr v-for="row in rows" :key="row.id" class="border-t border-[var(--border)] bg-[var(--surface)]">
          <td class="px-3 py-3 font-medium text-[var(--foreground)]">{{ row.name }}</td>
          <td class="px-3 py-3 text-[var(--muted-foreground)]">{{ row.owner }}</td>
          <td class="px-3 py-3">
            <StatusPill :label="row.status" :tone="row.status === 'Ready' ? 'success' : 'warning'" />
          </td>
          <td class="px-3 py-3 text-[var(--muted-foreground)]">Today</td>
        </tr>
      </AdminDataTable>
      <AdminPagination :page="page" :page-size="3" :total="9" @page-change="page = $event" />
    </AdminTableFrame>
  </UiKitPage>
</template>
