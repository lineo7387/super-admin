<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { resolveColorMode } from '@super-admin-org/core'
import { getChartRecipe } from '@super-admin-org/theme'
import { AdminAlert, StatusPill } from '@super-admin-org/ui'
import { usePreferencesStore } from '@/stores/preferences.store'
import { getBuiltInDesignProfile } from '@/super-admin/theme-registry.generated'
import {
  createBarChartOption,
  createDonutChartOption,
  createTrendLineOption,
  registerSuperAdminECharts,
  type ChartPoint
} from '@/shared/charts/echarts-options'
import ChartExamplePanel from './components/ChartExamplePanel.vue'

registerSuperAdminECharts()

const { t } = useI18n()
const preferences = usePreferencesStore()

const resolvedMode = computed(() => resolveColorMode(preferences.colorMode, preferences.systemMode))
const activeProfile = computed(() => getBuiltInDesignProfile(preferences.profileId))
const chartRecipe = computed(() => getChartRecipe(activeProfile.value, resolvedMode.value))

const revenueTrend: ChartPoint[] = [
  { label: 'Mon', value: 32 },
  { label: 'Tue', value: 46 },
  { label: 'Wed', value: 41 },
  { label: 'Thu', value: 58 },
  { label: 'Fri', value: 73 },
  { label: 'Sat', value: 69 },
  { label: 'Sun', value: 88 }
]

const channelVolume: ChartPoint[] = [
  { label: 'Organic', value: 48 },
  { label: 'Partner', value: 32 },
  { label: 'Ads', value: 24 },
  { label: 'Direct', value: 38 }
]

const riskMix: ChartPoint[] = [
  { label: 'Healthy', value: 62 },
  { label: 'Watch', value: 24 },
  { label: 'Blocked', value: 14 }
]

const revenueOption = computed(() => createTrendLineOption(chartRecipe.value, revenueTrend))
const channelOption = computed(() => createBarChartOption(chartRecipe.value, channelVolume))
const riskOption = computed(() => createDonutChartOption(chartRecipe.value, riskMix))
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <section class="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase text-[var(--muted-foreground)]">{{ t('charts.eyebrow') }}</p>
          <h1 class="mt-2 [font-family:var(--font-display)] text-2xl text-[var(--foreground)]">{{ t('charts.title') }}</h1>
          <p class="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">{{ t('charts.description') }}</p>
        </div>
        <StatusPill :label="t('charts.status', { profile: activeProfile.name, mode: resolvedMode })" tone="success" />
      </div>
    </section>

    <AdminAlert tone="info" :title="t('charts.boundaryTitle')" :description="t('charts.boundaryDescription')" />

    <section class="grid min-w-0 gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr))]">
      <ChartExamplePanel
        :title="t('charts.revenue.title')"
        :description="t('charts.revenue.description')"
        :option="revenueOption"
      />
      <ChartExamplePanel
        :title="t('charts.risk.title')"
        :description="t('charts.risk.description')"
        :option="riskOption"
      />
    </section>

    <ChartExamplePanel
      :title="t('charts.channel.title')"
      :description="t('charts.channel.description')"
      :option="channelOption"
    />
  </div>
</template>
