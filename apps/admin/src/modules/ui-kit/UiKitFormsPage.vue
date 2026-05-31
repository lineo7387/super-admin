<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { AdminAlert, AdminCard, AdminField, AdminFormFooter, AdminSelect, AdminTextInput, AdminTextarea, AdminValidationSummary } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const owner = shallowRef('Mira Chen')
const status = shallowRef('active')
const summary = shallowRef('Coordinate access changes across review windows.')
const email = shallowRef('mira.example.com')
const isSubmitting = shallowRef(false)

const validationErrors = computed(() => {
  const errors: string[] = []
  if (!owner.value.trim()) {
    errors.push('Owner is required.')
  }
  if (!email.value.includes('@')) {
    errors.push('Notification email must include @.')
  }
  if (!summary.value.trim()) {
    errors.push('Summary is required.')
  }
  return errors
})

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'Review' },
  { value: 'paused', label: 'Paused' }
]
</script>

<template>
  <UiKitPage title="Forms" description="Form layout primitives for labels, help text, validation, and persistent footer actions.">
    <AdminAlert
      title="Keep validation module-owned"
      description="Shared primitives render states and layout; feature modules still own field rules, business copy, and submit behavior."
    />

    <AdminCard>
      <form class="grid gap-4" @submit.prevent>
        <AdminValidationSummary :errors="validationErrors" />
        <div class="grid gap-4 md:grid-cols-2">
          <AdminField label="Owner" for="form-owner" required :error="owner.trim() ? undefined : 'Owner is required.'">
            <AdminTextInput id="form-owner" v-model="owner" :invalid="!owner.trim()" />
          </AdminField>
          <AdminField label="Status" for="form-status">
            <AdminSelect id="form-status" v-model="status" :options="statusOptions" />
          </AdminField>
        </div>
        <AdminField label="Notification email" for="form-email" required error="Enter a valid email address for workflow notifications.">
          <AdminTextInput id="form-email" v-model="email" type="email" invalid />
        </AdminField>
        <AdminField label="Reference ID" for="form-reference" optional help="Readonly fields can show API-managed or generated values without becoming editable.">
          <AdminTextInput id="form-reference" model-value="OPS-2048" readonly />
        </AdminField>
        <AdminField label="Summary" for="form-summary" required help="Use this layout for module-owned form copy and validation.">
          <AdminTextarea id="form-summary" v-model="summary" :invalid="!summary.trim()" />
        </AdminField>
      </form>
      <AdminFormFooter
        dirty
        :submitting="isSubmitting"
        submit-label="Publish workflow"
        status-text="3 fields changed"
        @submit="isSubmitting = !isSubmitting"
      />
    </AdminCard>
  </UiKitPage>
</template>
