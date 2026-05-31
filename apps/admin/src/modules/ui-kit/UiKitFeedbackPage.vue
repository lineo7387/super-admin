<script setup lang="ts">
import { AdminButton, AdminCard, EmptyState, StatusPill } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'
</script>

<template>
  <UiKitPage title="Feedback" description="Reusable empty, error, and status components for admin pages and table states.">
    <section class="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Empty State</h2>
        <div class="mt-4">
          <EmptyState title="No records in this view" description="This surface adapts to the active theme and can host a primary recovery action.">
            <AdminButton size="sm" variant="primary">Create record</AdminButton>
          </EmptyState>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">State Language</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <StatusPill label="Draft" tone="neutral" />
          <StatusPill label="Healthy" tone="success" />
          <StatusPill label="Review" tone="warning" />
          <StatusPill label="Blocked" tone="danger" />
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
