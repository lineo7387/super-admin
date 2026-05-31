<script setup lang="ts">
import { Plus, Search, SlidersHorizontal } from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
import { AdminButton, AdminSelect, AdminTableFrame, AdminTableToolbar, AdminTextInput, StatusPill } from '@super-admin/ui'
import UsersTable from './components/UsersTable.vue'
import UserDrawerForm from './components/UserDrawerForm.vue'
import { useUsersQuery } from './users.queries'
import type { UserListParams, UserPreviewScenario, UserRecord, UserStatusFilter } from './users.types'

const pageSize = 4
const keyword = shallowRef('')
const status = shallowRef<UserStatusFilter>('all')
const scenario = shallowRef<UserPreviewScenario>('normal')
const density = shallowRef<'compact' | 'comfortable'>('comfortable')
const page = shallowRef(1)
const visibleColumns = shallowRef(['name', 'email', 'role', 'region', 'status'])
const selectedUser = shallowRef<UserRecord | undefined>()
const isDrawerOpen = shallowRef(false)
const lastSavedName = shallowRef('')

const statusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'Review' },
  { value: 'paused', label: 'Paused' }
]

const scenarioOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'loading', label: 'Loading' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' }
]

const queryParams = computed<UserListParams>(() => ({
  page: page.value,
  pageSize,
  keyword: keyword.value,
  status: status.value,
  scenario: scenario.value
}))
const usersQuery = useUsersQuery(queryParams)
const users = computed(() => usersQuery.data.value?.items ?? [])
const total = computed(() => usersQuery.data.value?.total ?? 0)
const tableState = computed<'idle' | 'loading' | 'empty' | 'error'>(() => {
  if (usersQuery.isLoading.value || usersQuery.isFetching.value) {
    return 'loading'
  }
  if (usersQuery.isError.value) {
    return 'error'
  }
  if (users.value.length === 0) {
    return 'empty'
  }
  return 'idle'
})

function resetPage(): void {
  page.value = 1
}

function toggleColumn(column: string): void {
  if (visibleColumns.value.includes(column)) {
    visibleColumns.value = visibleColumns.value.filter((item) => item !== column)
    return
  }
  visibleColumns.value = [...visibleColumns.value, column]
}

function openCreate(): void {
  selectedUser.value = undefined
  isDrawerOpen.value = true
}

function openEdit(user: UserRecord): void {
  selectedUser.value = user
  isDrawerOpen.value = true
}

function retry(): void {
  void usersQuery.refetch()
}

function handleSaved(input: { name: string }): void {
  lastSavedName.value = input.name
  isDrawerOpen.value = false
}
</script>

<template>
  <div class="grid gap-4">
    <AdminTableFrame title="All Users" description="Mock-backed CRUD example with module-owned page, query, API adapter, and type boundaries.">
      <template #toolbar>
        <AdminTableToolbar>
          <template #filters>
            <label class="flex h-9 min-w-64 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-3">
              <Search class="size-4 text-[var(--muted-foreground)]" />
              <input
                v-model="keyword"
                class="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                placeholder="Search users"
                @input="resetPage"
              />
            </label>
            <AdminSelect v-model="status" class="w-40" :fluid="false" :options="statusOptions" @change="resetPage" />
            <AdminSelect v-model="scenario" class="w-36" :fluid="false" :options="scenarioOptions" @change="resetPage" />
          </template>
          <template #actions>
            <AdminButton variant="secondary" size="sm" @click="density = density === 'compact' ? 'comfortable' : 'compact'">
              <SlidersHorizontal class="size-4" />
              {{ density === 'compact' ? 'Compact' : 'Comfortable' }}
            </AdminButton>
            <AdminButton variant="primary" size="sm" @click="openCreate">
              <Plus class="size-4" />
              New user
            </AdminButton>
          </template>
        </AdminTableToolbar>
        <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span>Columns</span>
          <label v-for="column in ['name', 'email', 'role', 'region', 'status']" :key="column" class="inline-flex items-center gap-1">
            <input type="checkbox" :checked="visibleColumns.includes(column)" @change="toggleColumn(column)" />
            <span class="capitalize">{{ column }}</span>
          </label>
          <StatusPill v-if="lastSavedName" :label="`Saved ${lastSavedName}`" tone="success" />
        </div>
      </template>
      <UsersTable
        :users="users"
        :total="total"
        :page="page"
        :page-size="pageSize"
        :state="tableState"
        :density="density"
        :visible-columns="visibleColumns"
        @edit="openEdit"
        @page-change="page = $event"
        @retry="retry"
      />
    </AdminTableFrame>

    <UserDrawerForm :open="isDrawerOpen" :user="selectedUser" @close="isDrawerOpen = false" @saved="handleSaved" />
  </div>
</template>
