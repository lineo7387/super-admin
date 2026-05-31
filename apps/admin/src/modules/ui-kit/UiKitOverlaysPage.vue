<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { AdminAlert, AdminButton, AdminCard, AdminCheckbox, AdminDrawer, AdminField, AdminFormFooter, AdminTextInput, AdminValidationSummary } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const isDrawerOpen = shallowRef(false)
const workspaceName = shallowRef('North Star Review')
const confirmOwner = shallowRef(false)

const validationErrors = computed(() => {
  const errors: string[] = []
  if (!workspaceName.value.trim()) {
    errors.push('Workspace name is required.')
  }
  if (!confirmOwner.value) {
    errors.push('Confirm the workspace owner before saving.')
  }
  return errors
})
</script>

<template>
  <UiKitPage title="Overlays" description="Drawer surfaces for focused create/edit tasks without leaving the current workspace route.">
    <AdminAlert
      tone="warning"
      title="Drawer workflows keep page context visible"
      description="Use them for short create/edit tasks where the table or dashboard behind the overlay still matters."
    />

    <AdminCard>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="[font-family:var(--font-display)] text-xl text-[var(--foreground)]">Drawer Carrier</h2>
          <p class="mt-1 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
            Use the drawer primitive for short admin workflows that should stay visually attached to the list or dashboard behind it.
          </p>
        </div>
        <AdminButton variant="primary" @click="isDrawerOpen = true">Open drawer</AdminButton>
      </div>
    </AdminCard>
    <AdminDrawer
      :open="isDrawerOpen"
      title="Edit workspace"
      description="A compact overlay composition using shared form primitives."
      @close="isDrawerOpen = false"
    >
      <form class="grid gap-4" @submit.prevent>
        <AdminValidationSummary :errors="validationErrors" />
        <AdminField label="Workspace name" for="overlay-name">
          <AdminTextInput id="overlay-name" v-model="workspaceName" />
        </AdminField>
        <AdminCheckbox
          v-model="confirmOwner"
          label="Owner reviewed"
          description="Confirmation state is local to this workflow; shared UI only renders the control."
        />
      </form>
      <template #footer>
        <AdminFormFooter dirty submit-label="Save workspace" @cancel="isDrawerOpen = false" @submit="isDrawerOpen = false" />
      </template>
    </AdminDrawer>
  </UiKitPage>
</template>
