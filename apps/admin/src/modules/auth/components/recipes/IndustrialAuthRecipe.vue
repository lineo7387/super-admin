<script setup lang="ts">
import { Boxes, Factory } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import AuthRecipePanel from './AuthRecipePanel.vue'
import { authMetrics, type AuthRecipeProps } from './auth-recipe'

const props = defineProps<AuthRecipeProps>()
defineSlots<{ default(): unknown }>()
const { t } = useI18n()
</script>

<template>
  <section class="auth-industrial relative mx-auto grid min-h-screen w-full max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
    <div class="grid min-h-0 gap-5 lg:grid-cols-[1fr_minmax(360px,440px)] lg:items-center">
      <aside class="grid gap-4">
        <div class="auth-industrial__intro border-b border-[var(--border-strong)] pb-5">
          <div class="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            <Factory class="size-4 text-[var(--primary)]" />
            {{ t('auth.layout.projectIntro') }}
          </div>
          <h1 class="mt-4 max-w-4xl [font-family:var(--font-display)] text-4xl leading-none md:text-6xl">{{ props.title }}</h1>
        </div>
        <div class="auth-industrial__rail grid gap-3">
          <div
            v-for="metric in authMetrics"
            :key="metric.labelKey"
            class="grid grid-cols-[120px_1fr] items-center gap-4 border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <span class="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</span>
            <span class="[font-family:var(--font-display)] text-2xl">{{ t(metric.valueKey) }}</span>
          </div>
        </div>
        <div class="grid gap-3 border border-[var(--border-strong)] bg-[var(--surface-sunken)] p-5 md:grid-cols-[auto_1fr]">
          <Boxes class="size-10 text-[var(--primary)]" />
          <div>
            <p class="text-sm uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{{ props.eyebrow }}</p>
            <p class="mt-2 max-w-2xl text-lg leading-7 text-[var(--foreground)]">{{ props.description }}</p>
          </div>
        </div>
      </aside>

      <AuthRecipePanel class="auth-panel--industrial">
        <slot />
      </AuthRecipePanel>
    </div>
  </section>
</template>

<style scoped>
.auth-industrial__rail {
  border-left: 8px solid color-mix(in srgb, var(--primary) 74%, var(--border-strong));
  padding-left: 1rem;
}

.auth-panel--industrial,
.auth-industrial__rail > div {
  border-radius: 0;
}
</style>
