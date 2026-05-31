<script setup lang="ts">
import { shallowRef } from 'vue'
import { AdminCard, AdminField, AdminFormFooter, AdminSelect, AdminTextInput, AdminTextarea } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const owner = shallowRef('Mira Chen')
const status = shallowRef('active')
const summary = shallowRef('Coordinate access changes across review windows.')
</script>

<template>
  <UiKitPage title="Forms" description="Form layout primitives for labels, help text, validation, and persistent footer actions.">
    <AdminCard>
      <form class="grid gap-4" @submit.prevent>
        <div class="grid gap-4 md:grid-cols-2">
          <AdminField label="Owner" for="form-owner">
            <AdminTextInput id="form-owner" v-model="owner" />
          </AdminField>
          <AdminField label="Status" for="form-status">
            <AdminSelect id="form-status" v-model="status">
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="paused">Paused</option>
            </AdminSelect>
          </AdminField>
        </div>
        <AdminField label="Summary" for="form-summary" help="Use this layout for module-owned form copy and validation.">
          <AdminTextarea id="form-summary" v-model="summary" />
        </AdminField>
      </form>
      <AdminFormFooter dirty />
    </AdminCard>
  </UiKitPage>
</template>
