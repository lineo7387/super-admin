<script setup lang="ts">
import { Boxes, Command, Factory, Landmark, ShieldCheck } from 'lucide-vue-next'
import { computed } from 'vue'
import GlobalPreferences from '@/shell/preferences/GlobalPreferences.vue'
import { usePreferencesStore } from '@/stores/preferences.store'

const props = defineProps<{
  eyebrow: string
  title: string
  description: string
}>()

const preferences = usePreferencesStore()

const profile = computed(() => preferences.profileId)
const metrics = computed(() => {
  if (profile.value === 'industrial') {
    return [
      { label: 'Audit lock', value: 'Armed' },
      { label: 'Shift gate', value: '06:00' },
      { label: 'Access tier', value: 'Ops' }
    ]
  }

  if (profile.value === 'cyberpunk') {
    return [
      { label: 'Node', value: 'A7' },
      { label: 'Trace', value: '0.04ms' },
      { label: 'Clearance', value: 'Root' }
    ]
  }

  return [
    { label: 'Vault', value: 'Live' },
    { label: 'Risk', value: 'Low' },
    { label: 'Keys', value: '2FA' }
  ]
})
</script>

<template>
  <main class="auth-shell min-h-screen overflow-hidden bg-[var(--app-background)] text-[var(--foreground)]" :data-auth-profile="profile">
    <div class="auth-shell__texture absolute inset-0" aria-hidden="true" />

    <section v-if="profile === 'industrial'" class="auth-industrial relative mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[auto_1fr] gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <header class="grid gap-3 border-b border-[var(--border-strong)] pb-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div class="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            <Factory class="size-4 text-[var(--primary)]" />
            Control Gate
          </div>
          <h1 class="mt-3 [font-family:var(--font-display)] text-4xl leading-none md:text-6xl">{{ props.title }}</h1>
        </div>
        <GlobalPreferences trigger="auth" class="justify-self-start md:justify-self-end" />
      </header>

      <div class="grid min-h-0 gap-5 lg:grid-cols-[1fr_minmax(360px,440px)] lg:items-center">
        <aside class="grid gap-4">
          <div class="auth-industrial__rail grid gap-3">
            <div v-for="metric in metrics" :key="metric.label" class="grid grid-cols-[120px_1fr] items-center gap-4 border border-[var(--border)] bg-[var(--surface)] p-3">
              <span class="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{{ metric.label }}</span>
              <span class="[font-family:var(--font-display)] text-2xl">{{ metric.value }}</span>
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

    <section v-else-if="profile === 'cyberpunk'" class="auth-cyberpunk relative mx-auto grid min-h-screen w-full max-w-7xl grid-rows-[auto_1fr] gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div class="auth-cyberpunk__mark">
          <Command class="size-5" />
          <span>Command Access</span>
        </div>
        <GlobalPreferences trigger="auth" />
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
              <div v-for="metric in metrics" :key="metric.label" class="border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
                <div class="text-[10px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{{ metric.label }}</div>
                <div class="mt-2 [font-family:var(--font-mono)] text-lg text-[var(--primary)]">{{ metric.value }}</div>
              </div>
            </div>
          </div>
        </aside>
        <section class="auth-panel auth-panel--cyberpunk">
          <slot />
        </section>
      </div>
    </section>

    <section v-else class="auth-crypto relative mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:grid-cols-[1.1fr_minmax(360px,440px)] lg:items-center lg:px-8">
      <aside class="grid gap-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="auth-crypto__seal">
            <Landmark class="size-5 text-[var(--primary)]" />
            <span>Vault Session</span>
          </div>
          <GlobalPreferences trigger="auth" />
        </div>
        <div class="auth-crypto__ledger">
          <div class="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
            <p class="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{{ props.eyebrow }}</p>
            <ShieldCheck class="size-7 text-[var(--primary)]" />
          </div>
          <h1 class="mt-8 max-w-3xl [font-family:var(--font-display)] text-5xl leading-none sm:text-7xl">{{ props.title }}</h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">{{ props.description }}</p>
          <div class="mt-8 grid gap-3 sm:grid-cols-3">
            <div v-for="metric in metrics" :key="metric.label" class="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
              <div class="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{{ metric.label }}</div>
              <div class="mt-3 [font-family:var(--font-display)] text-2xl">{{ metric.value }}</div>
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
