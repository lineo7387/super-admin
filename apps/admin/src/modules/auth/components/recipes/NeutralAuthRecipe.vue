<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AuthRecipePanel from './AuthRecipePanel.vue'
import { authMetrics, type AuthRecipeProps } from './auth-recipe'

const props = defineProps<AuthRecipeProps>()
defineSlots<{ default(): unknown }>()
const { t } = useI18n()
</script>

<template>
  <section data-auth-recipe="neutral" class="relative mx-auto grid min-h-screen w-full max-w-6xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
    <div class="grid min-h-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:items-center">
      <aside class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--panel-shadow)] sm:p-7">
        <p class="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{{ props.eyebrow }}</p>
        <h1 class="mt-4 max-w-3xl [font-family:var(--font-display)] text-4xl font-semibold leading-tight sm:text-6xl">{{ props.title }}</h1>
        <p class="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">{{ props.description }}</p>
        <dl class="mt-8 grid gap-3 sm:grid-cols-3">
          <div v-for="metric in authMetrics" :key="metric.labelKey" class="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
            <dt class="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</dt>
            <dd class="mt-2 [font-family:var(--font-display)] text-lg">{{ t(metric.valueKey) }}</dd>
          </div>
        </dl>
      </aside>

      <AuthRecipePanel>
        <slot />
      </AuthRecipePanel>
    </div>
  </section>
</template>
