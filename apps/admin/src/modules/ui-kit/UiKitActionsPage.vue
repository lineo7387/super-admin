<script setup lang="ts">
import { Download, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'
import { AdminButton, AdminCard } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'
</script>

<template>
  <UiKitPage title="Actions" description="Buttons and command controls with stable sizing, icons, disabled states, and profile-aware focus rings.">
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
    </section>
  </UiKitPage>
</template>
