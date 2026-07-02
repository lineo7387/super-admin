<script setup lang="ts">
import { Download, Plus, RefreshCw, Trash2 } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminButton, AdminCard, AdminFormFooter } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

const { t } = useI18n()
</script>

<template>
  <UiKitPage :title="t('uiKit.page.actions.title')" :description="t('uiKit.page.actions.description')">
    <AdminAlert :title="t('uiKit.actions.alertTitle')" :description="t('uiKit.actions.alertDescription')" />

    <section class="grid gap-4 lg:grid-cols-2">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.actions.buttonVariants') }}</h2>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <AdminButton variant="primary"><Plus class="size-4" />{{ t('uiKit.actions.create') }}</AdminButton>
          <AdminButton variant="secondary"><Download class="size-4" />{{ t('uiKit.actions.export') }}</AdminButton>
          <AdminButton variant="ghost"><RefreshCw class="size-4" />{{ t('uiKit.actions.refresh') }}</AdminButton>
          <AdminButton variant="danger"><Trash2 class="size-4" />{{ t('uiKit.actions.delete') }}</AdminButton>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.actions.sizes') }}</h2>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <AdminButton size="sm" variant="secondary">{{ t('uiKit.actions.small') }}</AdminButton>
          <AdminButton size="md" variant="secondary">{{ t('uiKit.actions.medium') }}</AdminButton>
          <AdminButton size="icon" variant="secondary" :aria-label="t('uiKit.actions.refresh')"><RefreshCw class="size-4" /></AdminButton>
          <AdminButton disabled variant="primary">{{ t('uiKit.actions.disabled') }}</AdminButton>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.actions.persistentActions') }}</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {{ t('uiKit.actions.persistentActionsDescription') }}
        </p>
        <div class="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
          <AdminFormFooter
            dirty
            :cancel-label="t('common.primitives.cancel')"
            :submit-label="t('uiKit.actions.applyChanges')"
            :dirty-label="t('common.primitives.unsavedChanges')"
            :clean-label="t('common.primitives.noChanges')"
            :status-text="t('uiKit.actions.twoUnsaved')"
          />
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
