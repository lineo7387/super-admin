<script setup lang="ts">
import { LayoutDashboard, Search } from 'lucide-vue-next'
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
</script>

<template>
  <header class="relative z-50 grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-[var(--border)] bg-[var(--header-background)] px-4 backdrop-blur">
    <div v-if="brand === 'full'" class="flex min-w-0 items-center gap-3">
      <div class="grid size-9 place-items-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--glow)]">
        <LayoutDashboard class="size-4 text-[var(--primary)]" />
      </div>
      <div class="min-w-0">
        <div class="truncate [font-family:var(--font-display)] text-base text-[var(--foreground)]">Super Admin</div>
        <div class="truncate text-xs text-[var(--muted-foreground)]">Adaptive control workspace</div>
      </div>
    </div>
    <div v-else class="hidden min-w-0 items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] md:flex">
      <span class="size-2 rounded-full bg-[var(--primary)] shadow-[var(--glow)]" />
      Runtime Shell
    </div>

    <PrimaryNav v-if="nav === 'horizontal'" orientation="horizontal" :max-depth="navDepth" />
    <div v-else class="hidden h-9 min-w-80 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-3 text-sm text-[var(--muted-foreground)] md:flex">
      <Search class="size-4" />
      <span>Search modules, jobs, users</span>
    </div>

    <div class="flex min-w-0 items-center justify-end gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
