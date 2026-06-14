<script setup lang="ts">
import { Activity, AlertTriangle, Database, RadioTower } from '@lucide/vue'
import { computed, shallowRef } from 'vue'
import { AdminAlert, AdminCard, AdminSkeleton, MetricTile, StatusPill } from '@super-admin-org/ui'
import { useDashboardOverviewQuery } from './dashboard.queries'
import type { DashboardOverviewParams, DashboardSignalIcon } from './dashboard.types'

const scenario = shallowRef<DashboardOverviewParams['scenario']>('normal')
const queryParams = computed<DashboardOverviewParams>(() => ({
  scenario: scenario.value
}))
const overviewQuery = useDashboardOverviewQuery(queryParams)
const overview = computed(() => overviewQuery.data.value)
const metrics = computed(() => overview.value?.metrics ?? [])
const signals = computed(() => overview.value?.signals ?? [])
const activity = computed(() => overview.value?.activity ?? [])
const isLoading = computed(() => overviewQuery.isLoading.value)
const isError = computed(() => overviewQuery.isError.value)
const isEmpty = computed(() => !isLoading.value && !isError.value && metrics.value.length === 0)

function signalIcon(icon: DashboardSignalIcon) {
  if (icon === 'signal-routing') {
    return RadioTower
  }
  if (icon === 'api-boundary') {
    return Database
  }
  return AlertTriangle
}
</script>

<template>
  <div class="grid gap-4">
    <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <template v-if="isLoading">
        <AdminCard v-for="index in 4" :key="index">
          <AdminSkeleton :lines="3" />
        </AdminCard>
      </template>
      <MetricTile
        v-else
        v-for="metric in metrics"
        :key="metric.id"
        :label="metric.label"
        :value="metric.value"
        :meta="metric.meta"
        :tone="metric.tone"
      />
    </section>

    <AdminAlert
      v-if="isError"
      tone="danger"
      title="Unable to load dashboard overview"
      description="The API adapter produced this mock error state."
    />
    <AdminAlert
      v-else-if="isEmpty"
      tone="warning"
      title="No dashboard signals"
      description="The API adapter returned an empty mock overview."
    />

    <section class="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
      <AdminCard>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">Command Surface</h1>
            <p class="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">
              A frontend-only example module: keep this screen if it fits, or reshape the page, types, queries, and API adapter together.
            </p>
          </div>
          <StatusPill :label="overview?.statusLabel ?? 'Mock mode'" tone="success" />
        </div>

        <div v-if="isLoading" class="mt-6">
          <AdminSkeleton :lines="4" />
        </div>
        <div v-else class="mt-6 grid gap-1 divide-y divide-[var(--border)] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <article
            v-for="signal in signals"
            :key="signal.id"
            class="px-1 py-4 lg:px-4 lg:py-1"
          >
            <component
              :is="signalIcon(signal.id)"
              class="size-5"
              :class="signal.tone === 'warning' ? 'text-[var(--warning)]' : 'text-[var(--primary)]'"
            />
            <div class="mt-5 text-sm font-medium text-[var(--foreground)]">{{ signal.title }}</div>
            <p class="mt-2 text-sm text-[var(--muted-foreground)]">{{ signal.description }}</p>
          </article>
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
            :key="item.id"
            class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3 text-sm text-[var(--foreground)]"
          >
            {{ item.message }}
          </div>
          <AdminSkeleton v-if="isLoading" :lines="4" />
        </div>
      </AdminCard>
    </section>
  </div>
</template>
