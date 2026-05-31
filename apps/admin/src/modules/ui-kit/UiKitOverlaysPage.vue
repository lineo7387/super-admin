<script setup lang="ts">
import { shallowRef } from 'vue'
import { AdminButton, AdminCard, AdminDrawer, AdminField, AdminFormFooter, AdminTextInput } from '@super-admin/ui'
import UiKitPage from './components/UiKitPage.vue'

const isDrawerOpen = shallowRef(false)
const workspaceName = shallowRef('North Star Review')
</script>

<template>
  <UiKitPage title="Overlays" description="Drawer surfaces for focused create/edit tasks without leaving the current workspace route.">
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
        <AdminField label="Workspace name" for="overlay-name">
          <AdminTextInput id="overlay-name" v-model="workspaceName" />
        </AdminField>
      </form>
      <template #footer>
        <AdminFormFooter dirty @cancel="isDrawerOpen = false" @submit="isDrawerOpen = false" />
      </template>
    </AdminDrawer>
  </UiKitPage>
</template>
