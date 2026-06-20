<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminButton, AdminCard, AdminSkeleton, AdminValidationSummary, EmptyState, StatusPill } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

const { t } = useI18n()
const validationErrors = computed(() => [t('uiKit.feedback.errorNameRequired'), t('uiKit.feedback.errorEmailAt')])
</script>

<template>
  <UiKitPage :title="t('uiKit.page.feedback.title')" :description="t('uiKit.page.feedback.description')">
    <section class="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.feedback.emptyState') }}</h2>
        <div class="mt-4">
          <EmptyState :title="t('uiKit.feedback.emptyTitle')" :description="t('uiKit.feedback.emptyDescription')">
            <AdminButton size="sm" variant="primary">{{ t('uiKit.feedback.createRecord') }}</AdminButton>
          </EmptyState>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.feedback.stateLanguage') }}</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <StatusPill :label="t('uiKit.feedback.statusDraft')" tone="neutral" />
          <StatusPill :label="t('uiKit.feedback.statusHealthy')" tone="success" />
          <StatusPill :label="t('uiKit.feedback.statusReview')" tone="warning" />
          <StatusPill :label="t('uiKit.feedback.statusBlocked')" tone="danger" />
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.feedback.alerts') }}</h2>
        <div class="mt-4 grid gap-3">
          <AdminAlert :title="t('uiKit.feedback.alertProviderTitle')" :description="t('uiKit.feedback.alertProviderDescription')" />
          <AdminAlert tone="success" :title="t('uiKit.feedback.alertSavedTitle')" :description="t('uiKit.feedback.alertSavedDescription')" />
          <AdminAlert tone="warning" :title="t('uiKit.feedback.alertReviewTitle')" :description="t('uiKit.feedback.alertReviewDescription')" />
          <AdminAlert tone="danger" :title="t('uiKit.feedback.alertFailedTitle')" :description="t('uiKit.feedback.alertFailedDescription')">
            <AdminButton size="sm" variant="secondary">{{ t('uiKit.feedback.retry') }}</AdminButton>
          </AdminAlert>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.feedback.loadingAndValidation') }}</h2>
        <div class="mt-4 grid gap-4">
          <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
            <AdminSkeleton :lines="4" />
          </div>
          <AdminValidationSummary :title="t('common.primitives.validationTitle')" :errors="validationErrors" />
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
