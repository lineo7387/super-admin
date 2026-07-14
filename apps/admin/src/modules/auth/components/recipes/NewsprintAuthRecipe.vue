<script setup lang="ts">
import { FileText, Newspaper } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import AuthRecipePanel from './AuthRecipePanel.vue'
import { authMetrics, type AuthRecipeProps } from './auth-recipe'

const props = defineProps<AuthRecipeProps>()
defineSlots<{ default(): unknown }>()
const { t } = useI18n()
</script>

<template>
  <section class="auth-newsprint relative mx-auto grid min-h-screen w-full max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
    <div
      class="grid min-h-0 border-l border-t border-[var(--border-strong)] bg-[var(--surface)] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,440px)] lg:items-stretch"
    >
      <aside class="auth-newsprint__sheet grid min-h-0 border-b border-r border-[var(--border-strong)]">
        <div class="auth-newsprint__masthead border-b-4 border-[var(--border-strong)] p-4 sm:p-5">
          <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]"
          >
            <span>Vol. 01</span>
            <span>{{ t('auth.layout.brand') }}</span>
            <span>Daily Edition</span>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <Newspaper class="size-8 shrink-0 text-[var(--primary)]" />
            <h1 class="[font-family:var(--font-display)] text-4xl font-black leading-none sm:text-6xl">{{ props.title }}</h1>
          </div>
        </div>

        <div class="grid border-b border-[var(--border-strong)] md:grid-cols-[1fr_0.78fr]">
          <div class="border-b border-[var(--border)] p-4 md:border-b-0 md:border-r md:border-[var(--border)] sm:p-5">
            <p class="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">{{ props.eyebrow }}</p>
            <p class="auth-newsprint__lead mt-4 max-w-2xl text-base leading-7 text-[var(--foreground)]">{{ props.description }}</p>
          </div>
          <div class="grid">
            <div
              v-for="metric in authMetrics"
              :key="metric.labelKey"
              class="grid grid-cols-[110px_1fr] items-center border-b border-[var(--border)] p-3 last:border-b-0"
            >
              <span class="text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</span>
              <span class="[font-family:var(--font-mono)] text-sm font-semibold">{{ t(metric.valueKey) }}</span>
            </div>
          </div>
        </div>

        <div class="grid gap-0 md:grid-cols-3">
          <div class="border-b border-[var(--border)] p-4 md:border-b-0 md:border-r">
            <FileText class="mb-3 size-6 text-[var(--primary)]" />
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Filed</p>
            <p class="mt-2 [font-family:var(--font-display)] text-2xl leading-none">Access Desk</p>
          </div>
          <div class="border-b border-[var(--border)] p-4 md:border-b-0 md:border-r">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Section</p>
            <p class="mt-2 [font-family:var(--font-display)] text-2xl leading-none">Operations</p>
          </div>
          <div class="p-4">
            <p class="text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Status</p>
            <p class="mt-2 [font-family:var(--font-display)] text-2xl leading-none text-[var(--accent)]">Verified</p>
          </div>
        </div>
      </aside>

      <AuthRecipePanel class="auth-panel--newsprint border-b border-r border-[var(--border-strong)]">
        <slot />
      </AuthRecipePanel>
    </div>
  </section>
</template>

<style scoped>
.auth-newsprint__sheet {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface) 96%, transparent), color-mix(in srgb, var(--surface-sunken) 90%, transparent)), var(--texture);
}

.auth-newsprint__masthead {
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--surface-raised) 96%, transparent)), var(--texture);
}

.auth-newsprint__lead {
  font-family: var(--font-display);
}

.auth-newsprint__lead::first-letter {
  float: left;
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 4.1rem;
  font-weight: 900;
  line-height: 0.82;
  padding-right: 0.45rem;
}

.auth-panel--newsprint {
  align-self: stretch;
  border-left: 0;
  border-radius: 0;
  box-shadow: none;
}
</style>
