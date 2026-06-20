<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminButton, AdminCard, AdminCheckbox, AdminDrawer, AdminField, AdminFormFooter, AdminTextInput, AdminValidationSummary } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

const { t } = useI18n()
const isDrawerOpen = shallowRef(false)
const workspaceName = shallowRef('North Star Review')
const confirmOwner = shallowRef(false)

const validationErrors = computed(() => {
  const errors: string[] = []
  if (!workspaceName.value.trim()) {
    errors.push(t('uiKit.overlays.errorWorkspaceName'))
  }
  if (!confirmOwner.value) {
    errors.push(t('uiKit.overlays.errorConfirmOwner'))
  }
  return errors
})
</script>

<template>
  <UiKitPage :title="t('uiKit.page.overlays.title')" :description="t('uiKit.page.overlays.description')">
    <AdminAlert
      tone="warning"
      :title="t('uiKit.overlays.alertTitle')"
      :description="t('uiKit.overlays.alertDescription')"
    />

    <AdminCard>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.overlays.drawerCarrier') }}</h2>
          <p class="mt-1 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            {{ t('uiKit.overlays.drawerCarrierDescription') }}
          </p>
        </div>
        <AdminButton variant="primary" @click="isDrawerOpen = true">{{ t('uiKit.overlays.openDrawer') }}</AdminButton>
      </div>
    </AdminCard>
    <AdminDrawer
      :open="isDrawerOpen"
      :title="t('uiKit.overlays.drawerTitle')"
      :description="t('uiKit.overlays.drawerDescription')"
      :close-label="t('common.primitives.close')"
      :overlay-close-label="t('common.primitives.closeDrawer')"
      @close="isDrawerOpen = false"
    >
      <form class="grid gap-4" @submit.prevent>
        <AdminValidationSummary :title="t('common.primitives.validationTitle')" :errors="validationErrors" />
        <AdminField :label="t('uiKit.overlays.fieldWorkspaceName')" for="overlay-name">
          <AdminTextInput id="overlay-name" v-model="workspaceName" />
        </AdminField>
        <AdminCheckbox
          v-model="confirmOwner"
          :label="t('uiKit.overlays.checkboxOwnerReviewed')"
          :description="t('uiKit.overlays.checkboxOwnerReviewedDescription')"
        />
      </form>
      <template #footer>
        <AdminFormFooter
          dirty
          :cancel-label="t('common.primitives.cancel')"
          :submit-label="t('uiKit.overlays.submit')"
          :dirty-label="t('common.primitives.unsavedChanges')"
          :clean-label="t('common.primitives.noChanges')"
          @cancel="isDrawerOpen = false"
          @submit="isDrawerOpen = false"
        />
      </template>
    </AdminDrawer>
  </UiKitPage>
</template>
