<script setup lang="ts">
import { Bot, PanelRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AdminCard, AdminScrollArea, StatusPill } from '@super-admin/ui'
import { usePreferencesStore } from '@/stores/preferences.store'

const route = useRoute()
const preferences = usePreferencesStore()

const aiStatusMessage = computed(() => {
  if (preferences.aiAvailability.state === 'ready') {
    return `${preferences.aiAvailability.providerName} is connected.`
  }

  if (preferences.aiAvailability.state === 'error') {
    return preferences.aiAvailability.message
  }

  return preferences.aiAvailability.reason
})
</script>

<template>
  <AdminScrollArea as="aside" class="h-full" view-class="p-3">
    <AdminCard class="space-y-4">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <PanelRight class="size-4 text-[var(--primary)]" />
          <h2 class="[font-family:var(--font-display)] text-base">Context</h2>
        </div>
        <StatusPill label="Live" tone="success" />
      </div>
      <div>
        <div class="text-sm font-medium text-[var(--foreground)]">{{ route.meta.title }}</div>
        <p class="mt-1 text-sm text-[var(--muted-foreground)]">{{ route.meta.description }}</p>
      </div>
      <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
        <div class="flex items-center gap-2 text-sm text-[var(--foreground)]">
          <Bot class="size-4 text-[var(--warning)]" />
          AI Provider
        </div>
        <p class="mt-2 text-xs text-[var(--muted-foreground)]">
          {{ aiStatusMessage }}
        </p>
      </div>
    </AdminCard>
  </AdminScrollArea>
</template>
