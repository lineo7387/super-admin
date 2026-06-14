<script setup lang="ts">
import { Boxes, Command, Factory, FileText, Landmark, LayoutDashboard, Newspaper, ShieldCheck } from '@lucide/vue'
import { useI18n } from 'vue-i18n'
import GlobalPreferences from '@/shell/preferences/GlobalPreferences.vue'
import { usePreferencesStore } from '@/stores/preferences.store'

const props = defineProps<{
  eyebrow: string
  title: string
  description: string
}>()

const preferences = usePreferencesStore()
const { t } = useI18n()

const metrics = [
  { labelKey: 'auth.layout.metrics.locale', valueKey: 'auth.layout.metrics.localeValue' },
  { labelKey: 'auth.layout.metrics.data', valueKey: 'auth.layout.metrics.dataValue' },
  { labelKey: 'auth.layout.metrics.backend', valueKey: 'auth.layout.metrics.backendValue' }
] as const
</script>

<template>
  <main class="auth-shell min-h-screen overflow-hidden bg-[var(--app-background)] text-[var(--foreground)]" :data-auth-profile="preferences.profileId">
    <div class="auth-shell__texture absolute inset-0" aria-hidden="true" />
    <div class="auth-preferences-slot pointer-events-none absolute inset-x-0 top-4 z-[70] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex justify-end">
        <GlobalPreferences trigger="auth" class="pointer-events-auto" />
      </div>
    </div>

    <section v-if="preferences.profileId === 'base'" class="auth-base relative mx-auto grid min-h-screen w-full max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
      <div class="grid min-h-0 gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,440px)] lg:items-center">
        <aside class="auth-base__workspace overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
          <div class="border-b border-[var(--border)] p-5 sm:p-7">
            <div class="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              <LayoutDashboard class="size-4 text-[var(--primary)]" />
              {{ t('auth.layout.brand') }}
            </div>
            <p class="mt-8 text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{{ props.eyebrow }}</p>
            <h1 class="mt-4 max-w-3xl [font-family:var(--font-display)] text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-6xl">{{ props.title }}</h1>
            <p class="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">{{ props.description }}</p>
          </div>

          <div class="grid gap-px bg-[var(--border)] sm:grid-cols-3">
            <div v-for="metric in metrics" :key="metric.labelKey" class="auth-base__metric bg-[var(--surface)] p-4">
              <div class="text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</div>
              <div class="mt-2 [font-family:var(--font-display)] text-xl font-medium">{{ t(metric.valueKey) }}</div>
            </div>
          </div>
        </aside>

        <section class="auth-panel auth-panel--base">
          <slot />
        </section>
      </div>
    </section>

    <section v-else-if="preferences.profileId === 'industrial'" class="auth-industrial relative mx-auto grid min-h-screen w-full max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
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
            <div v-for="metric in metrics" :key="metric.labelKey" class="grid grid-cols-[120px_1fr] items-center gap-4 border border-[var(--border)] bg-[var(--surface)] p-3">
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
        <section class="auth-panel auth-panel--industrial">
          <slot />
        </section>
      </div>
    </section>

    <section v-else-if="preferences.profileId === 'cyberpunk'" class="auth-cyberpunk relative mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[auto_1fr] gap-4 px-4 py-4 sm:px-6 lg:px-8">
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
              <div v-for="metric in metrics" :key="metric.labelKey" class="border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
                <div class="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</div>
                <div class="mt-2 [font-family:var(--font-mono)] text-lg text-[var(--primary)]">{{ t(metric.valueKey) }}</div>
              </div>
            </div>
          </div>
        </aside>
        <section class="auth-panel auth-panel--cyberpunk">
          <slot />
        </section>
      </div>
    </section>

    <section v-else-if="preferences.profileId === 'newsprint'" class="auth-newsprint relative mx-auto grid min-h-screen w-full max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8">
      <div class="grid min-h-0 border-l border-t border-[var(--border-strong)] bg-[var(--surface)] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,440px)] lg:items-stretch">
        <aside class="auth-newsprint__sheet grid min-h-0 border-b border-r border-[var(--border-strong)]">
          <div class="auth-newsprint__masthead border-b-4 border-[var(--border-strong)] p-4 sm:p-5">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3 text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
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
              <div v-for="metric in metrics" :key="metric.labelKey" class="grid grid-cols-[110px_1fr] items-center border-b border-[var(--border)] p-3 last:border-b-0">
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

        <section class="auth-panel auth-panel--newsprint border-b border-r border-[var(--border-strong)]">
          <slot />
        </section>
      </div>
    </section>

    <section v-else class="auth-crypto relative mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1.1fr_minmax(360px,440px)] lg:items-center lg:px-8">
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
            <div v-for="metric in metrics" :key="metric.labelKey" class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
              <div class="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{{ t(metric.labelKey) }}</div>
              <div class="mt-3 [font-family:var(--font-display)] text-2xl">{{ t(metric.valueKey) }}</div>
            </div>
          </div>
        </div>
      </aside>

      <div class="grid gap-4">
        <section class="auth-panel auth-panel--crypto">
          <slot />
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.auth-shell {
  position: relative;
}

.auth-shell__texture {
  background:
    radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 28rem),
    linear-gradient(120deg, color-mix(in srgb, var(--surface-sunken) 72%, transparent), transparent),
    var(--texture);
  opacity: 0.86;
  pointer-events: none;
}

.auth-panel {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(150deg, color-mix(in srgb, var(--surface) 94%, transparent), color-mix(in srgb, var(--surface-raised) 84%, transparent)),
    var(--texture);
  box-shadow: var(--panel-shadow);
  padding: clamp(1.25rem, 3vw, 2rem);
}

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
    linear-gradient(180deg, color-mix(in srgb, var(--surface) 98%, transparent), color-mix(in srgb, var(--surface-raised) 92%, transparent)),
    var(--texture);
}

.auth-crypto__ledger {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface) 88%, transparent), color-mix(in srgb, var(--surface-sunken) 92%, transparent)),
    repeating-linear-gradient(90deg, transparent 0 34px, color-mix(in srgb, var(--border) 60%, transparent) 35px 36px);
  box-shadow: var(--panel-shadow);
  padding: clamp(1.35rem, 4vw, 2.5rem);
}

.auth-crypto__seal,
.auth-cyberpunk__mark {
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  display: inline-flex;
  gap: 0.55rem;
  padding: 0.6rem 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
}

.auth-industrial__rail {
  border-left: 8px solid color-mix(in srgb, var(--primary) 74%, var(--border-strong));
  padding-left: 1rem;
}

.auth-panel--industrial,
.auth-industrial__rail > div {
  border-radius: 0;
}

.auth-newsprint__sheet {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface) 96%, transparent), color-mix(in srgb, var(--surface-sunken) 90%, transparent)),
    var(--texture);
}

.auth-newsprint__masthead {
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--surface-raised) 96%, transparent)),
    var(--texture);
}

.auth-newsprint__lead {
  font-family: var(--font-display);
}

.auth-newsprint__lead::first-letter {
  color: var(--accent);
  float: left;
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

.auth-terminal {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--surface-sunken) 92%, transparent), color-mix(in srgb, var(--surface) 88%, transparent)),
    repeating-linear-gradient(0deg, transparent 0 13px, color-mix(in srgb, var(--primary) 10%, transparent) 14px 15px);
  box-shadow: var(--glow), var(--panel-shadow);
  overflow: hidden;
}

.auth-terminal__bar {
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 0.45rem;
  padding: 0.8rem 1rem;
}

.auth-terminal__bar span {
  background: var(--primary);
  border-radius: 999px;
  box-shadow: var(--glow);
  height: 0.55rem;
  width: 0.55rem;
}

@media (max-width: 768px) {
  .auth-panel {
    padding: 1rem;
  }
}
</style>
