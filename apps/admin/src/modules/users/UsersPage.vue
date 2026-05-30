<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
import { AdminCard, StatusPill } from '@super-admin/ui'

const keyword = shallowRef('')

const users = [
  { id: 'u-1001', name: 'Mira Chen', role: 'Owner', status: 'Active', region: 'Singapore' },
  { id: 'u-1002', name: 'Jon Bell', role: 'Operator', status: 'Review', region: 'New York' },
  { id: 'u-1003', name: 'Ana Torres', role: 'Auditor', status: 'Active', region: 'Madrid' },
  { id: 'u-1004', name: 'Kai Martin', role: 'Analyst', status: 'Paused', region: 'Berlin' }
] as const

const filteredUsers = computed(() => {
  const term = keyword.value.trim().toLowerCase()
  if (!term) {
    return users
  }
  return users.filter((user) =>
    [user.name, user.role, user.status, user.region].some((value) => value.toLowerCase().includes(term))
  )
})
</script>

<template>
  <AdminCard>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">User Directory</h1>
        <p class="mt-1 text-sm text-[var(--muted-foreground)]">Filter state stays local and is eligible for keep-alive caching.</p>
      </div>
      <label class="flex h-9 min-w-64 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-3">
        <Search class="size-4 text-[var(--muted-foreground)]" />
        <input
          v-model="keyword"
          class="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          placeholder="Filter users"
        />
      </label>
    </div>

    <div class="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
      <table class="w-full border-collapse text-left text-sm">
        <thead class="bg-[var(--surface-raised)] text-xs uppercase text-[var(--muted-foreground)]">
          <tr>
            <th class="px-3 py-3 font-medium">Name</th>
            <th class="px-3 py-3 font-medium">Role</th>
            <th class="px-3 py-3 font-medium">Region</th>
            <th class="px-3 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-t border-[var(--border)] bg-[var(--surface)]">
            <td class="px-3 py-3 text-[var(--foreground)]">{{ user.name }}</td>
            <td class="px-3 py-3 text-[var(--muted-foreground)]">{{ user.role }}</td>
            <td class="px-3 py-3 text-[var(--muted-foreground)]">{{ user.region }}</td>
            <td class="px-3 py-3">
              <StatusPill
                :label="user.status"
                :tone="user.status === 'Active' ? 'success' : user.status === 'Review' ? 'warning' : 'neutral'"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminCard>
</template>
