<script setup lang="ts">
import { FileCode2, Layers3, Route, ShieldCheck } from '@lucide/vue'
import { AdminAlert, AdminCard, StatusPill } from '@super-admin-org/ui'
import { templateGuideSections, templateGuideSignals } from './template-guide'

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
            <p class="text-xs font-semibold uppercase text-[var(--muted-foreground)]">Template baseline</p>
            <h1 class="mt-2 [font-family:var(--font-display)] text-2xl text-[var(--foreground)]">Frontend Example Template</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              The examples are copyable frontend modules. Keep the screen when it fits, replace the adapter when only data changes,
              or reshape the full module when the business workflow is different.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <StatusPill
              v-for="signal in templateGuideSignals"
              :key="signal.id"
              :label="signal.label"
              :tone="signal.tone"
            />
          </div>
        </div>
      </AdminCard>

      <AdminAlert
        tone="warning"
        title="Default scaffold boundary"
        description="Backend, auth, database, AI providers, API contracts, and CLI generation stay optional follow-up surfaces."
      />
    </section>

    <section class="grid gap-4 xl:grid-cols-2">
      <AdminCard v-for="section in templateGuideSections" :key="section.id">
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
                <code class="break-all rounded-[var(--radius-sm)] bg-[var(--surface-raised)] px-2 py-1 text-xs whitespace-normal text-[var(--muted-foreground)]">
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
