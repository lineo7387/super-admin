<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminCard, AdminScrollArea, MetricTile, StatusPill } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

const { t } = useI18n()

const swatches = [
  { name: 'Primary', token: 'var(--primary)' },
  { name: 'Surface', token: 'var(--surface)' },
  { name: 'Raised', token: 'var(--surface-raised)' },
  { name: 'Sunken', token: 'var(--surface-sunken)' },
  { name: 'Border', token: 'var(--border)' },
  { name: 'Danger', token: 'var(--danger)' }
]

const scrollItems = computed(() => [
  t('uiKit.foundations.scrollItems.routeAware'),
  t('uiKit.foundations.scrollItems.contextPanels'),
  t('uiKit.foundations.scrollItems.controlCenter'),
  t('uiKit.foundations.scrollItems.dataTables'),
  t('uiKit.foundations.scrollItems.scrollbarTokens'),
  t('uiKit.foundations.scrollItems.overlayBars')
])
</script>

<template>
  <UiKitPage :title="t('uiKit.page.foundations.title')" :description="t('uiKit.page.foundations.description')">
    <AdminAlert :title="t('uiKit.foundations.alertTitle')" :description="t('uiKit.foundations.alertDescription')" />

    <section class="grid gap-3 md:grid-cols-3">
      <MetricTile :label="t('uiKit.foundations.metricCoverage')" value="3" :meta="t('uiKit.foundations.metricCoverageMeta')" tone="success" />
      <MetricTile :label="t('uiKit.foundations.metricModes')" value="2" :meta="t('uiKit.foundations.metricModesMeta')" tone="neutral" />
      <MetricTile :label="t('uiKit.foundations.metricLayouts')" value="3" :meta="t('uiKit.foundations.metricLayoutsMeta')" tone="warning" />
    </section>

    <section class="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.foundations.typeScale') }}</h2>
        <div class="mt-4 grid gap-3">
          <div class="[font-family:var(--font-display)] text-3xl text-[var(--foreground)]">{{ t('uiKit.foundations.displayHeading') }}</div>
          <div class="text-lg font-medium text-[var(--foreground)]">{{ t('uiKit.foundations.sectionHeading') }}</div>
          <p class="max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            {{ t('uiKit.foundations.typeBody') }}
          </p>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.foundations.statusTones') }}</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <StatusPill label="Neutral" tone="neutral" />
          <StatusPill label="Success" tone="success" />
          <StatusPill label="Warning" tone="warning" />
          <StatusPill label="Danger" tone="danger" />
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.foundations.scrollArea') }}</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {{ t('uiKit.foundations.scrollAreaDescription') }}
        </p>
        <AdminScrollArea class="mt-4 max-h-32 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)]" view-class="p-3">
          <div class="grid gap-2">
            <div
              v-for="item in scrollItems"
              :key="item"
              class="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
            >
              {{ item }}
            </div>
          </div>
        </AdminScrollArea>
      </AdminCard>
    </section>
    <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <AdminCard v-for="swatch in swatches" :key="swatch.name">
        <div class="h-16 rounded-[var(--radius-md)] border border-[var(--border-strong)]" :style="{ backgroundColor: swatch.token }" />
        <div class="mt-3 text-sm font-medium text-[var(--foreground)]">{{ swatch.name }}</div>
        <div class="text-xs text-[var(--muted-foreground)]">{{ swatch.token }}</div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
