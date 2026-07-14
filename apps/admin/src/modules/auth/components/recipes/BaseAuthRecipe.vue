<script setup lang="ts">
import { LayoutDashboard } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import AuthRecipePanel from './AuthRecipePanel.vue'
import { authMetrics, type AuthRecipeProps } from './auth-recipe'

const props = defineProps<AuthRecipeProps>()
defineSlots<{ default(): unknown }>()
const { t } = useI18n()
</script>

<template>
  <section class="auth-base relative mx-auto grid min-h-screen w-full max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
    <div class="grid min-h-0 gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,440px)] lg:items-center">
      <aside class="auth-base__workspace overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
        <div class="border-b border-[var(--border)] p-5 sm:p-7">
          <div
            class="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]"
          >
            <LayoutDashboard class="size-4 text-[var(--primary)]" />
            {{ t('auth.layout.brand') }}
          </div>
          <p class="mt-8 text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{{ props.eyebrow }}</p>
          <h1 class="mt-4 max-w-3xl [font-family:var(--font-display)] text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-6xl">
            {{ props.title }}
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">{{ props.description }}</p>
        </div>

        <div class="grid gap-px bg-[var(--border)] sm:grid-cols-3">
          <div v-for="metric in authMetrics" :key="metric.labelKey" class="auth-base__metric bg-[var(--surface)] p-4">
            <div class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</div>
            <div class="mt-2 [font-family:var(--font-display)] text-xl font-medium">{{ t(metric.valueKey) }}</div>
          </div>
        </div>
      </aside>

      <AuthRecipePanel class="auth-panel--base">
        <slot />
      </AuthRecipePanel>
    </div>
  </section>
</template>

<style scoped>
.auth-base__workspace {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface-raised) 96%, transparent), color-mix(in srgb, var(--surface-sunken) 68%, transparent)),
    var(--texture);
  box-shadow: var(--panel-shadow);
}

.auth-base__metric {
  min-height: 7rem;
}

.auth-panel--base {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface) 98%, transparent), color-mix(in srgb, var(--surface-raised) 92%, transparent)), var(--texture);
}
</style>
