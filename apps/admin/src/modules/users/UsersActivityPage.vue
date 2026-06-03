<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AdminCard, StatusPill } from '@super-admin/ui'

const { t } = useI18n()
const events = [
  { id: 'evt-1', titleKey: 'users.secondary.events.ownerPolicy', timeKey: 'users.secondary.events.twelveMinutes', tone: 'success' },
  { id: 'evt-2', titleKey: 'users.secondary.events.accessReview', timeKey: 'users.secondary.events.thirtySixMinutes', tone: 'warning' },
  { id: 'evt-3', titleKey: 'users.secondary.events.accountPaused', timeKey: 'users.secondary.events.twoHours', tone: 'neutral' }
] as const
</script>

<template>
  <AdminCard>
    <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">{{ t('users.secondary.activityTitle') }}</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">{{ t('users.secondary.activityDescription') }}</p>
    <div class="mt-5 grid gap-3">
      <div
        v-for="event in events"
        :key="event.id"
        class="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-3"
      >
        <div>
          <div class="font-medium text-[var(--foreground)]">{{ t(event.titleKey) }}</div>
          <div class="mt-1 text-xs text-[var(--muted-foreground)]">{{ t(event.timeKey) }}</div>
        </div>
        <StatusPill :label="t('users.secondary.audit')" :tone="event.tone" />
      </div>
    </div>
  </AdminCard>
</template>
