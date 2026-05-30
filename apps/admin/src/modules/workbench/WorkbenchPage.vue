<script setup lang="ts">
import { Play, RotateCcw, TimerReset } from 'lucide-vue-next'
import { AdminButton, AdminCard, StatusPill } from '@super-admin/ui'

const jobs = [
  { id: 'settlement-sync', name: 'Settlement Sync', state: 'Running', tone: 'success', eta: '04:22' },
  { id: 'risk-reconcile', name: 'Risk Reconcile', state: 'Queued', tone: 'warning', eta: '12:05' },
  { id: 'access-review', name: 'Access Review', state: 'Paused', tone: 'neutral', eta: 'Manual' }
] as const
</script>

<template>
  <div class="grid gap-4">
    <AdminCard>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">Scheduler Console</h1>
          <p class="mt-1 text-sm text-[var(--muted-foreground)]">A desktop-control-center style surface for operational jobs.</p>
        </div>
        <div class="flex gap-2">
          <AdminButton variant="secondary" size="sm">
            <RotateCcw class="size-4" />
            Refresh
          </AdminButton>
          <AdminButton variant="primary" size="sm">
            <Play class="size-4" />
            Run batch
          </AdminButton>
        </div>
      </div>
    </AdminCard>

    <section class="grid gap-3 lg:grid-cols-3">
      <AdminCard v-for="job in jobs" :key="job.id" interactive>
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">{{ job.name }}</h2>
            <p class="mt-1 text-sm text-[var(--muted-foreground)]">Mock service job: {{ job.id }}</p>
          </div>
          <StatusPill :label="job.state" :tone="job.tone" />
        </div>
        <div class="mt-6 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <TimerReset class="size-4 text-[var(--primary)]" />
          Next checkpoint {{ job.eta }}
        </div>
      </AdminCard>
    </section>
  </div>
</template>
