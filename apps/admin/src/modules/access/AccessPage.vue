<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
import { AdminAlert, AdminCard, AdminSkeleton, StatusPill } from '@super-admin/ui'
import { useAccessMatrixQuery } from './access.queries'
import type { AccessMatrixParams } from './access.types'

const scenario = shallowRef<AccessMatrixParams['scenario']>('normal')
const queryParams = computed<AccessMatrixParams>(() => ({
  scenario: scenario.value
}))
const matrixQuery = useAccessMatrixQuery(queryParams)
const roles = computed(() => matrixQuery.data.value?.roles ?? [])
const integrationNote = computed(() => matrixQuery.data.value?.integrationNote ?? '')
const isLoading = computed(() => matrixQuery.isLoading.value)
const isError = computed(() => matrixQuery.isError.value)
const isEmpty = computed(() => !isLoading.value && !isError.value && roles.value.length === 0)
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
        <AdminSkeleton v-if="isLoading" :lines="5" />
        <AdminAlert
          v-else-if="isError"
          tone="danger"
          title="Unable to load access matrix"
          description="The Access API adapter produced this mock error state."
        />
        <AdminAlert
          v-else-if="isEmpty"
          tone="warning"
          title="No roles in this matrix"
          description="The Access API adapter returned an empty mock role list."
        />
        <div
          v-for="role in roles"
          :key="role.id"
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
        {{ integrationNote }}
      </p>
    </AdminCard>
  </div>
</template>
