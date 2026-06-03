<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Keyboard, Layers3, LogOut, Settings2 } from 'lucide-vue-next'
import { useAuthSessionStore } from '@/stores/auth-session.store'
import { usePreferencesStore } from '@/stores/preferences.store'

const props = withDefaults(
  defineProps<{
    variant?: 'dock' | 'sidebar' | 'header'
  }>(),
  {
    variant: 'header'
  }
)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const session = useAuthSessionStore()
const preferences = usePreferencesStore()
const open = shallowRef(false)
const menuRoot = useTemplateRef<HTMLElement>('menuRoot')

const user = computed(() => session.currentUser)
const initials = computed(() => {
  const name = user.value?.name.trim()
  if (!name) {
    return 'SA'
  }

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})
const isSidebar = computed(() => props.variant === 'sidebar')
const triggerTitle = computed(() =>
  user.value ? t('shell.account.menuFor', { name: user.value.name }) : t('shell.account.menu')
)
const menuClass = computed(() => {
  if (props.variant === 'header') {
    return 'right-0 top-[calc(100%+0.55rem)]'
  }

  return 'bottom-[calc(100%+0.65rem)] left-0'
})

function closeMenu(): void {
  open.value = false
}

function handlePointerDown(event: PointerEvent): void {
  if (!open.value || !menuRoot.value || !(event.target instanceof Node)) {
    return
  }

  if (!menuRoot.value.contains(event.target)) {
    closeMenu()
  }
}

function openControlCenter(): void {
  closeMenu()
  preferences.openControlCenter()
}

function openStageManager(): void {
  closeMenu()
  preferences.openStageManager()
}

async function signOut(): Promise<void> {
  const redirect = route.fullPath.startsWith('/auth/') ? undefined : route.fullPath

  closeMenu()
  session.clearSession()
  await router.push({
    path: '/auth/login',
    query: redirect ? { redirect } : undefined
  })
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  }
)

onMounted(() => {
  window.addEventListener('pointerdown', handlePointerDown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', handlePointerDown)
})
</script>

<template>
  <div v-if="user" ref="menuRoot" class="relative" @keydown.esc="closeMenu">
    <button
      type="button"
      class="group flex min-w-0 items-center border border-[var(--border)] bg-[var(--surface-raised)] text-left text-[var(--foreground)] shadow-[var(--card-shadow)] outline-none transition hover:border-[var(--border-strong)] focus-visible:shadow-[var(--focus-ring)]"
      :class="isSidebar ? 'h-10 w-full gap-2 rounded-[var(--radius-md)] px-2' : 'size-10 justify-center rounded-[var(--radius-md)]'"
      :aria-expanded="open"
      aria-haspopup="menu"
      :title="triggerTitle"
      @click="open = !open"
    >
      <span class="grid size-7 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-[0.6875rem] font-black text-[var(--primary-foreground)] shadow-[var(--glow)]">
        {{ initials }}
      </span>
      <span v-if="isSidebar" class="min-w-0 leading-tight">
        <span class="block truncate text-xs font-semibold">{{ user.name }}</span>
        <span class="block truncate text-[0.6875rem] text-[var(--muted-foreground)]">{{ user.role }}</span>
      </span>
    </button>

    <div
      v-if="open"
      class="absolute z-[72] w-60 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--panel-shadow)]"
      :class="menuClass"
      role="menu"
      :aria-label="t('shell.account.menu')"
    >
      <div class="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-raised)] p-2.5">
        <span class="grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-xs font-black text-[var(--primary-foreground)] shadow-[var(--glow)]">
          {{ initials }}
        </span>
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold leading-tight">{{ user.name }}</div>
          <div class="truncate text-xs text-[var(--muted-foreground)]">{{ user.email }}</div>
        </div>
      </div>

      <div class="grid border-b border-[var(--border)] p-1.5">
        <button type="button" class="account-menu-item" role="menuitem" @click="openControlCenter">
          <Settings2 class="size-4" />
          <span class="min-w-0">
            <span class="block">{{ t('shell.account.settings') }}</span>
            <span class="block truncate text-[0.6875rem] text-[var(--muted-foreground)]">{{ t('shell.account.controlCenter') }}</span>
          </span>
        </button>
      </div>

      <div class="grid border-b border-[var(--border)] p-1.5">
        <button type="button" class="account-menu-item" role="menuitem" :disabled="!preferences.stageManager.enabled" @click="openStageManager">
          <Keyboard class="size-4" />
          <span class="min-w-0">
            <span class="block">{{ t('shell.account.shortcuts') }}</span>
            <span class="block truncate text-[0.6875rem] text-[var(--muted-foreground)]">
              {{ t('shell.account.stageManagerShortcut') }}
            </span>
          </span>
          <Layers3 class="ml-auto size-4 text-[var(--primary)]" />
        </button>
      </div>

      <div class="grid p-1.5">
        <button type="button" class="account-menu-item account-menu-item--danger" role="menuitem" @click="signOut">
          <LogOut class="size-4" />
          <span>{{ t('shell.account.signOut') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-menu-item {
  display: flex;
  min-height: 2.35rem;
  align-items: center;
  gap: 0.6rem;
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.6rem;
  color: var(--foreground);
  text-align: left;
  transition:
    background var(--duration-base) var(--easing),
    color var(--duration-base) var(--easing);
}

.account-menu-item:hover,
.account-menu-item:focus-visible {
  background: var(--surface-raised);
  outline: none;
  box-shadow: var(--focus-ring);
}

.account-menu-item:disabled {
  cursor: not-allowed;
  color: var(--muted-foreground);
  opacity: 0.55;
}

.account-menu-item--danger {
  color: var(--danger);
}
</style>
