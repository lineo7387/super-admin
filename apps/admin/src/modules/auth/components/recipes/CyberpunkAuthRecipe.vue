<script setup lang="ts">
import { Command } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import AuthRecipePanel from './AuthRecipePanel.vue'
import { authMetrics, type AuthRecipeProps } from './auth-recipe'

const props = defineProps<AuthRecipeProps>()
defineSlots<{ default(): unknown }>()
const { t } = useI18n()
</script>

<template>
  <section class="auth-cyberpunk relative mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[auto_1fr] gap-4 px-4 py-4 sm:px-6 lg:px-8">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="auth-cyberpunk__mark">
        <Command class="size-5" />
        <span>{{ t('auth.layout.brand') }}</span>
      </div>
    </header>

    <div class="grid min-h-0 gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,440px)] lg:items-center">
      <aside class="auth-terminal">
        <div class="auth-terminal__bar">
          <span />
          <span />
          <span />
        </div>
        <div class="grid gap-5 p-5 sm:p-7">
          <p class="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{{ props.eyebrow }}</p>
          <h1 class="[font-family:var(--font-display)] text-4xl leading-none sm:text-6xl">{{ props.title }}</h1>
          <p class="max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">{{ props.description }}</p>
          <div class="grid gap-2 sm:grid-cols-3">
            <div v-for="metric in authMetrics" :key="metric.labelKey" class="border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
              <div class="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</div>
              <div class="mt-2 [font-family:var(--font-mono)] text-lg text-[var(--primary)]">{{ t(metric.valueKey) }}</div>
            </div>
          </div>
        </div>
      </aside>

      <AuthRecipePanel>
        <slot />
      </AuthRecipePanel>
    </div>
  </section>
</template>

<style scoped>
.auth-cyberpunk__mark {
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

.auth-terminal {
  overflow: hidden;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface-sunken) 92%, transparent), color-mix(in srgb, var(--surface) 88%, transparent)),
    repeating-linear-gradient(0deg, transparent 0 13px, color-mix(in srgb, var(--primary) 10%, transparent) 14px 15px);
  box-shadow: var(--glow), var(--panel-shadow);
}

.auth-terminal__bar {
  display: flex;
  gap: 0.45rem;
  border-bottom: 1px solid var(--border);
  padding: 0.8rem 1rem;
}

.auth-terminal__bar span {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: var(--glow);
}
</style>
