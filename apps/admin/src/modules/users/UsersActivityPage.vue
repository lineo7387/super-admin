<script setup lang="ts">
import { AdminCard, StatusPill } from '@super-admin/ui'

const events = [
  { id: 'evt-1', title: 'Mira Chen updated owner policy', time: '12 min ago', tone: 'success' },
  { id: 'evt-2', title: 'Jon Bell submitted access review', time: '36 min ago', tone: 'warning' },
  { id: 'evt-3', title: 'Kai Martin account paused', time: '2 hr ago', tone: 'neutral' }
] as const
</script>

<template>
  <AdminCard>
    <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">Activity</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">A compact module activity route for nested navigation previews.</p>
    <div class="mt-5 grid gap-3">
      <div
        v-for="event in events"
        :key="event.id"
        class="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-3"
      >
        <div>
          <div class="font-medium text-[var(--foreground)]">{{ event.title }}</div>
          <div class="mt-1 text-xs text-[var(--muted-foreground)]">{{ event.time }}</div>
        </div>
        <StatusPill label="Audit" :tone="event.tone" />
      </div>
    </div>
  </AdminCard>
</template>
