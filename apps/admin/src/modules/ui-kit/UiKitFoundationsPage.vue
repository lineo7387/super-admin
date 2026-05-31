<script setup lang="ts">
import { AdminAlert, AdminCard, AdminScrollArea, MetricTile, StatusPill } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const swatches = [
  { name: 'Primary', token: 'var(--primary)' },
  { name: 'Surface', token: 'var(--surface)' },
  { name: 'Raised', token: 'var(--surface-raised)' },
  { name: 'Sunken', token: 'var(--surface-sunken)' },
  { name: 'Border', token: 'var(--border)' },
  { name: 'Danger', token: 'var(--danger)' }
]

const scrollItems = [
  'Route-aware workspace surfaces',
  'Context panels and drawers',
  'Control Center settings',
  'Data tables with horizontal overflow',
  'Theme-aware scrollbar tokens',
  'Overlay bars outside content layout'
]
</script>

<template>
  <UiKitPage title="Foundations" description="Theme tokens, typography, radius, and status language used by the reusable primitives.">
    <AdminAlert
      title="Primitives consume semantic tokens"
      description="Shared components should adapt to the active design profile through CSS variables, not profile-specific branches in feature pages."
    />

    <section class="grid gap-3 md:grid-cols-3">
      <MetricTile label="Profile coverage" value="3" meta="Crypto, Industrial, Cyberpunk" tone="success" />
      <MetricTile label="Modes" value="2" meta="Light and dark required" tone="neutral" />
      <MetricTile label="Layouts" value="3" meta="Tri, dual, top-header QA" tone="warning" />
    </section>

    <section class="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Type Scale</h2>
        <div class="mt-4 grid gap-3">
          <div class="[font-family:var(--font-display)] text-3xl text-[var(--foreground)]">Display heading</div>
          <div class="text-lg font-medium text-[var(--foreground)]">Section heading</div>
          <p class="max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            Body text uses the active profile foreground tokens so every primitive adapts across light, dark, Crypto, and Industrial modes.
          </p>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Status Tones</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <StatusPill label="Neutral" tone="neutral" />
          <StatusPill label="Success" tone="success" />
          <StatusPill label="Warning" tone="warning" />
          <StatusPill label="Danger" tone="danger" />
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Scroll Area</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          Shared scroll containers hide native tracks and paint token-aware thumbs above the content.
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
