<script setup lang="ts">
import { AdminAlert, AdminButton, AdminCard, AdminSkeleton, AdminValidationSummary, EmptyState, StatusPill } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const validationErrors = ['Name is required.', 'Notification email must include @.']
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
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Alerts</h2>
        <div class="mt-4 grid gap-3">
          <AdminAlert title="Provider not configured" description="Use this state when an optional integration is intentionally absent from the default scaffold." />
          <AdminAlert tone="success" title="Changes saved" description="Positive feedback should be short and tied to the completed action." />
          <AdminAlert tone="warning" title="Review pending" description="Warning feedback calls attention without blocking the current page." />
          <AdminAlert tone="danger" title="Action failed" description="Danger feedback should include the next recovery action when possible.">
            <AdminButton size="sm" variant="secondary">Retry</AdminButton>
          </AdminAlert>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Loading and Validation</h2>
        <div class="mt-4 grid gap-4">
          <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
            <AdminSkeleton :lines="4" />
          </div>
          <AdminValidationSummary :errors="validationErrors" />
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
