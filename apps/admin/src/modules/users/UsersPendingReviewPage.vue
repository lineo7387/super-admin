<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { AdminTableFrame } from '@super-admin/ui'
import UsersTable from './components/UsersTable.vue'
import { useUsersQuery } from './users.queries'
import type { UserListParams } from './users.types'

const pageSize = 4
const page = shallowRef(1)
const queryParams = computed<UserListParams>(() => ({
  page: page.value,
  pageSize,
  status: 'review',
  scenario: 'normal'
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

function retry(): void {
  void usersQuery.refetch()
}
</script>

<template>
  <AdminTableFrame title="Pending Review" description="A lightweight third-level route using the same table primitive.">
    <UsersTable
      :users="users"
      :total="total"
      :page="page"
      :page-size="pageSize"
      :state="tableState"
      density="compact"
      :visible-columns="['name', 'email', 'role', 'status']"
      @page-change="page = $event"
      @retry="retry"
    />
  </AdminTableFrame>
</template>
