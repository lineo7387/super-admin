<script setup lang="ts">
import { FileCode2, Layers3, Route, ShieldCheck } from '@lucide/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminCard, StatusPill } from '@super-admin-org/ui'
import { templateGuideSections, templateGuideSignals } from './template-guide'

const { t } = useI18n()
const sections = computed(() =>
  templateGuideSections.map((section) => ({
    ...section,
    title: t(section.titleKey),
    summary: t(section.summaryKey),
    items: section.items.map((item) => ({
      ...item,
      label: t(item.labelKey),
      guidance: t(item.guidanceKey)
    }))
  }))
)
const signals = computed(() =>
  templateGuideSignals.map((signal) => ({
    ...signal,
    label: t(signal.labelKey)
  }))
)

function sectionIcon(sectionId: string) {
  if (sectionId === 'source-boundaries') {
    return Layers3
  }

  return Route
}

function itemIcon(itemId: string) {
  if (itemId === 'mock-data' || itemId === 'api-adapters') {
    return FileCode2
  }

  return ShieldCheck
}
</script>

<template>
  <div class="grid gap-4">
    <section class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.38fr)]">
      <AdminCard>
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase text-[var(--muted-foreground)]">{{ t('examples.templateGuide.eyebrow') }}</p>
            <h1 class="mt-2 [font-family:var(--font-display)] text-2xl text-[var(--foreground)]">{{ t('examples.templateGuide.title') }}</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              {{ t('examples.templateGuide.description') }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <StatusPill v-for="signal in signals" :key="signal.id" :label="signal.label" :tone="signal.tone" />
          </div>
        </div>
      </AdminCard>

      <AdminAlert tone="warning" :title="t('examples.templateGuide.boundaryTitle')" :description="t('examples.templateGuide.boundaryDescription')" />
    </section>

    <section class="grid gap-4 xl:grid-cols-2">
      <AdminCard v-for="section in sections" :key="section.id">
        <div class="flex items-start gap-3">
          <div class="grid size-10 place-items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)]">
            <component :is="sectionIcon(section.id)" class="size-5 text-[var(--primary)]" />
          </div>
          <div class="min-w-0">
            <h2 class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">{{ section.title }}</h2>
            <p class="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{{ section.summary }}</p>
          </div>
        </div>

        <div class="mt-5 grid gap-3">
          <article
            v-for="item in section.items"
            :key="item.id"
            class="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4 md:grid-cols-[auto_minmax(0,1fr)]"
          >
            <div class="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-[var(--surface-raised)]">
              <component :is="itemIcon(item.id)" class="size-4 text-[var(--primary)]" />
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-sm font-semibold text-[var(--foreground)]">{{ item.label }}</h3>
                <code
                  class="break-all rounded-[var(--radius-sm)] bg-[var(--surface-raised)] px-2 py-1 text-xs whitespace-normal text-[var(--muted-foreground)]"
                >
                  {{ item.path }}
                </code>
              </div>
              <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{{ item.guidance }}</p>
            </div>
          </article>
        </div>
      </AdminCard>
    </section>
  </div>
</template>
