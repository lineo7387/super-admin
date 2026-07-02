<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminCard, AdminCheckbox, AdminField, AdminRadioGroup, AdminSelect, AdminSwitch, AdminTextInput, AdminTextarea } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

const { t } = useI18n()
const name = shallowRef('Mira Chen')
const role = shallowRef('Owner')
const notes = shallowRef('Reviews regional approvals before handoff.')
const enabled = shallowRef(true)
const reviewed = shallowRef(false)
const partial = shallowRef(false)
const approvalMode = shallowRef('manual')

const approvalOptions = computed(() => [
  {
    value: 'manual',
    label: t('uiKit.inputs.approval.manual'),
    description: t('uiKit.inputs.approval.manualDescription')
  },
  {
    value: 'scheduled',
    label: t('uiKit.inputs.approval.scheduled'),
    description: t('uiKit.inputs.approval.scheduledDescription')
  },
  {
    value: 'locked',
    label: t('uiKit.inputs.approval.locked'),
    description: t('uiKit.inputs.approval.lockedDescription'),
    disabled: true
  }
])

const roleOptions = computed(() => [
  { value: 'Owner', label: t('uiKit.inputs.roles.owner') },
  { value: 'Operator', label: t('uiKit.inputs.roles.operator') },
  { value: 'Auditor', label: t('uiKit.inputs.roles.auditor') }
])
</script>

<template>
  <UiKitPage :title="t('uiKit.page.inputs.title')" :description="t('uiKit.page.inputs.description')">
    <AdminAlert tone="success" :title="t('uiKit.inputs.alertTitle')" :description="t('uiKit.inputs.alertDescription')" />

    <section class="grid gap-4 lg:grid-cols-2">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.inputs.textInputs') }}</h2>
        <div class="mt-4 grid gap-4">
          <AdminField :label="t('uiKit.inputs.fieldName')" for="kit-name" :help="t('uiKit.inputs.nameHelp')">
            <AdminTextInput id="kit-name" v-model="name" />
          </AdminField>
          <AdminField :label="t('uiKit.inputs.fieldNameEmail')" for="kit-email" :error="t('uiKit.inputs.emailError')">
            <AdminTextInput id="kit-email" v-model="name" type="email" invalid />
          </AdminField>
          <AdminField
            :label="t('uiKit.inputs.fieldNameSlug')"
            for="kit-slug"
            optional
            :optional-label="t('validation.optionalLabel')"
            :help="t('uiKit.inputs.slugHelp')"
          >
            <AdminTextInput id="kit-slug" model-value="north-star-review" readonly />
          </AdminField>
          <AdminField :label="t('uiKit.inputs.fieldNameLocked')" for="kit-locked">
            <AdminTextInput id="kit-locked" model-value="Configured by workspace policy" disabled />
          </AdminField>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">{{ t('uiKit.inputs.selectTextareaSwitch') }}</h2>
        <div class="mt-4 grid gap-4">
          <AdminField :label="t('uiKit.inputs.fieldRole')" for="kit-role">
            <AdminSelect id="kit-role" v-model="role" :options="roleOptions" />
          </AdminField>
          <AdminField :label="t('uiKit.inputs.fieldNotes')" for="kit-notes">
            <AdminTextarea id="kit-notes" v-model="notes" />
          </AdminField>
          <AdminSwitch v-model="enabled" :label="t('uiKit.inputs.switchEnable')" />
          <AdminSwitch v-model="partial" :label="t('uiKit.inputs.switchDisabled')" disabled />
          <div class="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
            <AdminCheckbox v-model="reviewed" :label="t('uiKit.inputs.checkboxReviewed')" :description="t('uiKit.inputs.checkboxReviewedDescription')" />
            <AdminCheckbox
              v-model="partial"
              :label="t('uiKit.inputs.checkboxPartial')"
              :description="t('uiKit.inputs.checkboxPartialDescription')"
              indeterminate
            />
          </div>
          <AdminField :label="t('uiKit.inputs.fieldApprovalMode')" for="kit-approval-mode" :help="t('uiKit.inputs.approvalModeHelp')">
            <AdminRadioGroup v-model="approvalMode" name="kit-approval-mode" :options="approvalOptions" />
          </AdminField>
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
