<script setup lang="ts">
import { Bot, PanelRight, Sparkles, X } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdminButton, StatusPill } from '@super-admin-org/ui'
import { translateRouteDescription, translateRouteTitle } from '@/i18n/navigation'
import { usePreferencesStore } from '@/stores/preferences.store'

const route = useRoute()
const { t } = useI18n()
const preferences = usePreferencesStore()
const pageTitle = computed(() =>
  translateRouteTitle(t, route.path, typeof route.meta.title === 'string' ? route.meta.title : t('workspace.fallbackTitle'))
)
const pageDescription = computed(() =>
  translateRouteDescription(t, route.path, typeof route.meta.description === 'string' ? route.meta.description : '')
)

const aiStatusMessage = computed(() => {
  if (preferences.aiAvailability.state === 'ready') {
    return t('shell.assistant.providerConnected', {
      provider: preferences.aiAvailability.providerName
    })
  }

  if (preferences.aiAvailability.state === 'error') {
    return preferences.aiAvailability.message
  }

  return t('shell.assistant.providerUnavailableMessage')
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[65]">
    <AdminButton
      v-if="!preferences.aiAssistantOpen"
      variant="primary"
      size="icon"
      class="shadow-[var(--panel-shadow)]"
      :title="t('shell.assistant.open')"
      @click="preferences.openAiAssistant()"
    >
      <Sparkles class="size-4" />
    </AdminButton>

    <section
      v-else
      class="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--panel-shadow)]"
      role="dialog"
      aria-modal="false"
      aria-labelledby="ai-assistant-title"
      @keydown.esc="preferences.closeAiAssistant()"
    >
      <header class="flex items-start justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] p-3">
        <div class="flex min-w-0 items-center gap-2">
          <span class="grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--glow)]">
            <Bot class="size-4" />
          </span>
          <div class="min-w-0">
            <h2 id="ai-assistant-title" class="[font-family:var(--font-display)] text-base leading-tight">{{ t('shell.assistant.title') }}</h2>
            <p class="truncate text-xs text-[var(--muted-foreground)]">{{ pageTitle }}</p>
          </div>
        </div>
        <AdminButton variant="ghost" size="icon" :title="t('shell.assistant.close')" @click="preferences.closeAiAssistant()">
          <X class="size-4" />
        </AdminButton>
      </header>

      <div class="grid gap-3 p-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
              <PanelRight class="size-4 text-[var(--primary)]" />
              {{ t('shell.assistant.pageContext') }}
            </div>
            <p class="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
              {{ pageDescription }}
            </p>
          </div>
          <StatusPill :label="t('shell.assistant.hidden')" />
        </div>

        <div class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <Bot class="size-4 text-[var(--warning)]" />
              {{ t('shell.assistant.provider') }}
            </div>
            <StatusPill :label="t('shell.assistant.unavailable')" tone="warning" />
          </div>
          <p class="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
            {{ aiStatusMessage }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
