<script setup lang="ts">
import { shallowRef } from 'vue'
import { AdminAlert, AdminCard, AdminCheckbox, AdminField, AdminRadioGroup, AdminSelect, AdminSwitch, AdminTextInput, AdminTextarea } from '@super-admin-org/ui'
import UiKitPage from './components/UiKitPage.vue'

const name = shallowRef('Mira Chen')
const role = shallowRef('Owner')
const notes = shallowRef('Reviews regional approvals before handoff.')
const enabled = shallowRef(true)
const reviewed = shallowRef(false)
const partial = shallowRef(false)
const approvalMode = shallowRef('manual')

const approvalOptions = [
  {
    value: 'manual',
    label: 'Manual review',
    description: 'Operators approve each workflow before it becomes active.'
  },
  {
    value: 'scheduled',
    label: 'Scheduled window',
    description: 'Changes wait for a maintenance window before publishing.'
  },
  {
    value: 'locked',
    label: 'Locked by policy',
    description: 'Disabled options keep layout stable while showing unavailable choices.',
    disabled: true
  }
]

const roleOptions = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Operator', label: 'Operator' },
  { value: 'Auditor', label: 'Auditor' }
]
</script>

<template>
  <UiKitPage title="Inputs" description="Field controls that inherit theme tokens and expose typed v-model contracts for forms and filters.">
    <AdminAlert
      tone="success"
      title="Inputs use typed v-model contracts"
      description="Text, select, switch, and checkbox primitives keep form state explicit while the module decides validation and persistence."
    />

    <section class="grid gap-4 lg:grid-cols-2">
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Text Inputs</h2>
        <div class="mt-4 grid gap-4">
          <AdminField label="Name" for="kit-name" help="Default text input">
            <AdminTextInput id="kit-name" v-model="name" />
          </AdminField>
          <AdminField label="Email" for="kit-email" error="Enter a valid email address.">
            <AdminTextInput id="kit-email" v-model="name" type="email" invalid />
          </AdminField>
          <AdminField label="Generated slug" for="kit-slug" optional help="Readonly and disabled states preserve layout without custom one-off classes.">
            <AdminTextInput id="kit-slug" model-value="north-star-review" readonly />
          </AdminField>
          <AdminField label="Locked provider" for="kit-locked">
            <AdminTextInput id="kit-locked" model-value="Configured by workspace policy" disabled />
          </AdminField>
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Select, Textarea, Switch</h2>
        <div class="mt-4 grid gap-4">
          <AdminField label="Role" for="kit-role">
            <AdminSelect id="kit-role" v-model="role" :options="roleOptions" />
          </AdminField>
          <AdminField label="Notes" for="kit-notes">
            <AdminTextarea id="kit-notes" v-model="notes" />
          </AdminField>
          <AdminSwitch v-model="enabled" label="Enable workspace notices" />
          <AdminSwitch v-model="partial" label="Disabled switch" disabled />
          <div class="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
            <AdminCheckbox v-model="reviewed" label="Mark policy reviewed" description="Checkboxes are useful for confirmations and table selection." />
            <AdminCheckbox v-model="partial" label="Partially selected team" description="Indeterminate state mirrors bulk-selection tables." indeterminate />
          </div>
          <AdminField label="Approval mode" for="kit-approval-mode" help="Radio groups use the same profile-aware control styling as checkbox selections.">
            <AdminRadioGroup v-model="approvalMode" name="kit-approval-mode" :options="approvalOptions" />
          </AdminField>
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
