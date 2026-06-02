<script setup lang="ts">
import { Activity, LayoutDashboard, LogOut, Search, UserCircle } from 'lucide-vue-next'
import { AdminButton } from '@super-admin/ui'
import { useRoute, useRouter } from 'vue-router'
import { useAuthSessionStore } from '@/stores/auth-session.store'
import PrimaryNav from './PrimaryNav.vue'

const route = useRoute()
const router = useRouter()
const session = useAuthSessionStore()

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

async function signOut(): Promise<void> {
  const redirect = route.fullPath.startsWith('/auth/') ? undefined : route.fullPath

  session.clearSession()
  await router.push({
    path: '/auth/login',
    query: redirect ? { redirect } : undefined
  })
}
</script>

<template>
  <header class="relative z-50 grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-[var(--border)] bg-[var(--header-background)] px-4 pr-16 backdrop-blur">
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
      <div v-if="session.currentUser" class="hidden min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] px-2.5 py-1.5 sm:flex">
        <UserCircle class="size-4 shrink-0 text-[var(--primary)]" />
        <div class="min-w-0 text-left leading-tight">
          <div class="max-w-32 truncate text-xs font-medium text-[var(--foreground)] lg:max-w-44">{{ session.currentUser.name }}</div>
          <div class="max-w-32 truncate text-[0.6875rem] text-[var(--muted-foreground)] lg:max-w-44">{{ session.currentUser.role }}</div>
        </div>
      </div>
      <AdminButton variant="ghost" size="icon" title="Activity">
        <Activity class="size-4" />
      </AdminButton>
      <AdminButton variant="ghost" size="sm" title="Sign out" @click="signOut">
        <LogOut class="size-4" />
        <span class="hidden lg:inline">Sign out</span>
      </AdminButton>
    </div>
  </header>
</template>
