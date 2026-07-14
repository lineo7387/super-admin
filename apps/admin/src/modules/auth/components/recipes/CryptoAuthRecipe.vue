<script setup lang="ts">
import { Landmark, ShieldCheck } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import AuthRecipePanel from './AuthRecipePanel.vue'
import { authMetrics, type AuthRecipeProps } from './auth-recipe'

const props = defineProps<AuthRecipeProps>()
defineSlots<{ default(): unknown }>()
const { t } = useI18n()
</script>

<template>
  <section
    class="auth-crypto relative mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1.1fr_minmax(360px,440px)] lg:items-center lg:px-8"
  >
    <aside class="grid gap-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="auth-crypto__seal">
          <Landmark class="size-5 text-[var(--primary)]" />
          <span>{{ t('auth.layout.brand') }}</span>
        </div>
      </div>
      <div class="auth-crypto__ledger">
        <div class="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <p class="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{{ props.eyebrow }}</p>
          <ShieldCheck class="size-7 text-[var(--primary)]" />
        </div>
        <h1 class="mt-8 max-w-3xl [font-family:var(--font-display)] text-5xl leading-none sm:text-7xl">{{ props.title }}</h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">{{ props.description }}</p>
        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div
            v-for="metric in authMetrics"
            :key="metric.labelKey"
            class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4"
          >
            <div class="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</div>
            <div class="mt-3 [font-family:var(--font-display)] text-2xl">{{ t(metric.valueKey) }}</div>
          </div>
        </div>
      </div>
    </aside>

    <AuthRecipePanel>
      <slot />
    </AuthRecipePanel>
  </section>
</template>

<style scoped>
.auth-crypto__ledger {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface) 88%, transparent), color-mix(in srgb, var(--surface-sunken) 92%, transparent)),
    repeating-linear-gradient(90deg, transparent 0 34px, color-mix(in srgb, var(--border) 60%, transparent) 35px 36px);
  box-shadow: var(--panel-shadow);
  padding: clamp(1.35rem, 4vw, 2.5rem);
}

.auth-crypto__seal {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  padding: 0.6rem 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
</style>
