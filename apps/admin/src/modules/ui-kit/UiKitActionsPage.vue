<script setup lang="ts">
import { Download, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'
import { AdminAlert, AdminButton, AdminCard, AdminFormFooter } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'
</script>

<template>
  <UiKitPage title="Actions" description="Buttons and command controls with stable sizing, icons, disabled states, and profile-aware focus rings.">
    <AdminAlert
      title="Actions prefer icons plus concise labels"
      description="Use icon-only buttons for compact tools and text labels for commands where the outcome needs to be explicit."
    />

    <section class="grid gap-4 lg:grid-cols-2">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Button Variants</h2>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <AdminButton variant="primary"><Plus class="size-4" />Create</AdminButton>
          <AdminButton variant="secondary"><Download class="size-4" />Export</AdminButton>
          <AdminButton variant="ghost"><RefreshCw class="size-4" />Refresh</AdminButton>
          <AdminButton variant="danger"><Trash2 class="size-4" />Delete</AdminButton>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Sizes</h2>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <AdminButton size="sm" variant="secondary">Small</AdminButton>
          <AdminButton size="md" variant="secondary">Medium</AdminButton>
          <AdminButton size="icon" variant="secondary" aria-label="Refresh"><RefreshCw class="size-4" /></AdminButton>
          <AdminButton disabled variant="primary">Disabled</AdminButton>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Persistent Form Actions</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          Footer actions keep save/cancel placement stable in drawers and dense forms.
        </p>
        <div class="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
          <AdminFormFooter dirty submit-label="Apply changes" status-text="2 unsaved updates" />
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
