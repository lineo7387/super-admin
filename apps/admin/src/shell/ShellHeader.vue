<script setup lang="ts">
import { LayoutDashboard, Search } from '@lucide/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/stores/preferences.store'
import { useShortcutsStore } from '@/stores/shortcuts.store'
import { formatComboLabel } from './shortcuts/registry'
import PrimaryNav from './PrimaryNav.vue'

withDefaults(
  defineProps<{
    brand?: 'none' | 'full'
    nav?: 'none' | 'horizontal'
    navDepth?: number
  }>(),
  {
    brand: 'none',
    nav: 'none',
    navDepth: 3
  }
)

const { t } = useI18n()
const preferences = usePreferencesStore()
const shortcuts = useShortcutsStore()

const paletteHint = computed(() => {
  const combo = shortcuts.getCombo('command-palette')
  return formatComboLabel(combo)
})
</script>

<template>
  <header class="relative z-50 grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-[var(--border)] bg-[var(--header-background)] px-4 backdrop-blur">
    <div v-if="brand === 'full'" class="col-start-1 flex min-w-0 items-center gap-3">
      <div class="grid size-9 place-items-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--glow)]">
        <LayoutDashboard class="size-4 text-[var(--primary)]" />
      </div>
      <div class="min-w-0">
        <div class="truncate [font-family:var(--font-display)] text-base text-[var(--foreground)]">Super Admin</div>
        <div class="truncate text-xs text-[var(--muted-foreground)]">{{ t('shell.navigation.operatorShell') }}</div>
      </div>
    </div>
    <div v-else class="col-start-1 hidden min-w-0 items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] md:flex">
      <span class="size-2 rounded-full bg-[var(--primary)] shadow-[var(--glow)]" />
      {{ t('shell.navigation.operatorShell') }}
    </div>

    <PrimaryNav v-if="nav === 'horizontal'" class="col-start-2" orientation="horizontal" :max-depth="navDepth" />
    <button
      v-else
      type="button"
      class="col-start-2 hidden h-9 min-w-80 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-3 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)] md:flex"
      :aria-label="t('shell.commandPalette.trigger')"
      @click="preferences.openCommandPalette()"
    >
      <Search class="size-4" />
      <span>{{ t('shell.commandPalette.trigger') }}</span>
      <kbd class="ml-auto rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-xs text-[var(--muted-foreground)]">{{ paletteHint }}</kbd>
    </button>

    <div class="col-start-3 flex min-w-0 items-center justify-end gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
