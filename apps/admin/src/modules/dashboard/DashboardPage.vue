<script setup lang="ts">
import { Activity, AlertTriangle, Database, RadioTower } from 'lucide-vue-next'
import { AdminCard, MetricTile, StatusPill } from '@super-admin/ui'

const metrics = [
  { label: 'Revenue Flow', value: '$847K', meta: '+12.8% today', tone: 'success' },
  { label: 'Open Jobs', value: '128', meta: '14 need review', tone: 'warning' },
  { label: 'Audit Events', value: '2.4K', meta: 'normal drift', tone: 'neutral' },
  { label: 'Risk Holds', value: '7', meta: '3 high priority', tone: 'danger' }
] as const

const activity = [
  'Settlement job completed across 12 regions',
  'Access policy updated for finance operators',
  'New workspace tab cache warmed for Users',
  'AI provider remains unconfigured by default'
] as const
</script>

<template>
  <div class="grid gap-4">
    <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <MetricTile
        v-for="metric in metrics"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
        :meta="metric.meta"
        :tone="metric.tone"
      />
    </section>

    <section class="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
      <AdminCard>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">Command Surface</h1>
            <p class="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">
              A frontend-only operations view powered by mock data and replaceable module services.
            </p>
          </div>
          <StatusPill label="Mock mode" tone="success" />
        </div>

        <div class="mt-6 grid gap-3 lg:grid-cols-3">
          <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <RadioTower class="size-5 text-[var(--primary)]" />
            <div class="mt-5 text-sm font-medium text-[var(--foreground)]">Signal routing</div>
            <p class="mt-2 text-sm text-[var(--muted-foreground)]">Layouts can change without rewriting feature pages.</p>
          </div>
          <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <Database class="size-5 text-[var(--primary)]" />
            <div class="mt-5 text-sm font-medium text-[var(--foreground)]">Service boundary</div>
            <p class="mt-2 text-sm text-[var(--muted-foreground)]">Pages stay behind queries and module service files.</p>
          </div>
          <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <AlertTriangle class="size-5 text-[var(--warning)]" />
            <div class="mt-5 text-sm font-medium text-[var(--foreground)]">Provider safety</div>
            <p class="mt-2 text-sm text-[var(--muted-foreground)]">AI starts unavailable instead of pretending to be connected.</p>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <div class="flex items-center gap-2">
          <Activity class="size-4 text-[var(--primary)]" />
          <h2 class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">Activity Feed</h2>
        </div>
        <div class="mt-4 grid gap-3">
          <div
            v-for="item in activity"
            :key="item"
            class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3 text-sm text-[var(--foreground)]"
          >
            {{ item }}
          </div>
        </div>
      </AdminCard>
    </section>
  </div>
</template>
