<script setup lang="ts">
import { Play, RotateCcw, TimerReset } from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
import { AdminAlert, AdminButton, AdminCard, AdminSkeleton, StatusPill } from '@super-admin/ui'
import { useWorkbenchJobsQuery } from './workbench.queries'
import type { WorkbenchJobListParams } from './workbench.types'

const state = shallowRef<WorkbenchJobListParams['state']>('all')
const scenario = shallowRef<WorkbenchJobListParams['scenario']>('normal')
const queryParams = computed<WorkbenchJobListParams>(() => ({
  state: state.value,
  scenario: scenario.value
}))
const jobsQuery = useWorkbenchJobsQuery(queryParams)
const jobs = computed(() => jobsQuery.data.value?.items ?? [])
const isLoading = computed(() => jobsQuery.isLoading.value)
const isError = computed(() => jobsQuery.isError.value)
const isEmpty = computed(() => !isLoading.value && !isError.value && jobs.value.length === 0)

function refreshJobs(): void {
  void jobsQuery.refetch()
}
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
          <AdminButton variant="secondary" size="sm" @click="refreshJobs">
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

    <AdminAlert
      v-if="isError"
      tone="danger"
      title="Unable to load workbench jobs"
      description="The Workbench API adapter can point at a real job endpoint when this screen fits."
    />
    <AdminAlert
      v-else-if="isEmpty"
      tone="warning"
      title="No jobs in this queue"
      description="The Workbench API adapter returned an empty mock job list."
    />

    <section class="grid gap-3 lg:grid-cols-3">
      <template v-if="isLoading">
        <AdminCard v-for="index in 3" :key="index">
          <AdminSkeleton :lines="4" />
        </AdminCard>
      </template>
      <AdminCard v-for="job in jobs" :key="job.id" interactive>
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">{{ job.name }}</h2>
            <p class="mt-1 text-sm text-[var(--muted-foreground)]">{{ job.owner }} · {{ job.id }}</p>
          </div>
          <StatusPill :label="job.stateLabel" :tone="job.tone" />
        </div>
        <div class="mt-6 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <TimerReset class="size-4 text-[var(--primary)]" />
          Next checkpoint {{ job.eta }}
        </div>
      </AdminCard>
    </section>
  </div>
</template>
