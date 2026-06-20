<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminCard, AdminField, AdminFormFooter, AdminSelect, AdminTextInput, AdminTextarea, AdminValidationSummary } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

const { t } = useI18n()
const owner = shallowRef('Mira Chen')
const status = shallowRef('active')
const summary = shallowRef('Coordinate access changes across review windows.')
const email = shallowRef('mira.example.com')
const isSubmitting = shallowRef(false)

const validationErrors = computed(() => {
  const errors: string[] = []
  if (!owner.value.trim()) {
    errors.push(t('uiKit.forms.errorOwner'))
  }
  if (!email.value.includes('@')) {
    errors.push(t('uiKit.forms.errorEmail'))
  }
  if (!summary.value.trim()) {
    errors.push(t('uiKit.forms.errorSummary'))
  }
  return errors
})

const statusOptions = computed(() => [
  { value: 'active', label: t('uiKit.forms.statuses.active') },
  { value: 'review', label: t('uiKit.forms.statuses.review') },
  { value: 'paused', label: t('uiKit.forms.statuses.paused') }
])
</script>

<template>
  <UiKitPage :title="t('uiKit.page.forms.title')" :description="t('uiKit.page.forms.description')">
    <AdminAlert
      :title="t('uiKit.forms.alertTitle')"
      :description="t('uiKit.forms.alertDescription')"
    />

    <AdminCard>
      <form class="grid gap-4" @submit.prevent>
        <AdminValidationSummary :title="t('common.primitives.validationTitle')" :errors="validationErrors" />
        <div class="grid gap-4 md:grid-cols-2">
          <AdminField :label="t('uiKit.forms.fieldOwner')" for="form-owner" required :required-label="t('validation.requiredLabel')" :error="owner.trim() ? undefined : t('uiKit.forms.fieldOwnerError')">
            <AdminTextInput id="form-owner" v-model="owner" :invalid="!owner.trim()" />
          </AdminField>
          <AdminField :label="t('uiKit.forms.fieldStatus')" for="form-status">
            <AdminSelect id="form-status" v-model="status" :options="statusOptions" />
          </AdminField>
        </div>
        <AdminField :label="t('uiKit.forms.fieldEmail')" for="form-email" required :required-label="t('validation.requiredLabel')" :error="t('uiKit.forms.fieldEmailError')">
          <AdminTextInput id="form-email" v-model="email" type="email" invalid />
        </AdminField>
        <AdminField :label="t('uiKit.forms.fieldReference')" for="form-reference" optional :optional-label="t('validation.optionalLabel')" :help="t('uiKit.forms.fieldReferenceHelp')">
          <AdminTextInput id="form-reference" model-value="OPS-2048" readonly />
        </AdminField>
        <AdminField :label="t('uiKit.forms.fieldSummary')" for="form-summary" required :required-label="t('validation.requiredLabel')" :help="t('uiKit.forms.fieldSummaryHelp')">
          <AdminTextarea id="form-summary" v-model="summary" :invalid="!summary.trim()" />
        </AdminField>
      </form>
      <AdminFormFooter
        dirty
        :submitting="isSubmitting"
        :cancel-label="t('common.primitives.cancel')"
        :submit-label="t('uiKit.forms.submit')"
        :submitting-label="t('common.primitives.saving')"
        :dirty-label="t('common.primitives.unsavedChanges')"
        :clean-label="t('common.primitives.noChanges')"
        :status-text="t('uiKit.forms.threeFieldsChanged')"
        @cancel="isSubmitting = false"
        @submit="isSubmitting = !isSubmitting"
      />
    </AdminCard>
  </UiKitPage>
</template>
