<script setup lang="ts">
import { shallowRef } from 'vue'
import { AdminCard, AdminField, AdminSelect, AdminSwitch, AdminTextInput, AdminTextarea } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const name = shallowRef('Mira Chen')
const role = shallowRef('Owner')
const notes = shallowRef('Reviews regional approvals before handoff.')
const enabled = shallowRef(true)
</script>

<template>
  <UiKitPage title="Inputs" description="Field controls that inherit theme tokens and expose typed v-model contracts for forms and filters.">
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
        </div>
      </AdminCard>
      <AdminCard>
        <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Select, Textarea, Switch</h2>
        <div class="mt-4 grid gap-4">
          <AdminField label="Role" for="kit-role">
            <AdminSelect id="kit-role" v-model="role">
              <option value="Owner">Owner</option>
              <option value="Operator">Operator</option>
              <option value="Auditor">Auditor</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="Notes" for="kit-notes">
            <AdminTextarea id="kit-notes" v-model="notes" />
          </AdminField>
          <AdminSwitch v-model="enabled" label="Enable workspace notices" />
        </div>
      </AdminCard>
    </section>
  </UiKitPage>
</template>
