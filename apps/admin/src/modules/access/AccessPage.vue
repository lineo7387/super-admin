<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import { AdminCard, StatusPill } from '@super-admin/ui'

const roles = [
  { name: 'Owner', scope: 'All modules', level: 'Full', tone: 'success' },
  { name: 'Operator', scope: 'Workbench, Users', level: 'Scoped', tone: 'warning' },
  { name: 'Auditor', scope: 'Dashboard, Access', level: 'Read only', tone: 'neutral' }
] as const
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)]">
    <AdminCard>
      <div class="flex items-center gap-3">
        <div class="grid size-10 place-items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)]">
          <ShieldCheck class="size-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">Permission Matrix</h1>
          <p class="mt-1 text-sm text-[var(--muted-foreground)]">Demo permissions stay frontend metadata, not a required auth backend.</p>
        </div>
      </div>

      <div class="mt-5 grid gap-3">
        <div
          v-for="role in roles"
          :key="role.name"
          class="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4 md:grid-cols-[1fr_1fr_auto]"
        >
          <div class="font-medium text-[var(--foreground)]">{{ role.name }}</div>
          <div class="text-sm text-[var(--muted-foreground)]">{{ role.scope }}</div>
          <StatusPill :label="role.level" :tone="role.tone" />
        </div>
      </div>
    </AdminCard>

    <AdminCard>
      <h2 class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">Integration note</h2>
      <p class="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
        Replace module services and permission checks with your own backend when needed. The default template remains mock-data based.
      </p>
    </AdminCard>
  </div>
</template>
