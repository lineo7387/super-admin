<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Keyboard, LogOut, Settings2, X } from 'lucide-vue-next'
import { useAuthSessionStore } from '@/stores/auth-session.store'

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
const open = shallowRef(false)
const shortcutsPanelOpen = shallowRef(false)
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

function closeShortcutsPanel(): void {
  shortcutsPanelOpen.value = false
}

function handlePointerDown(event: PointerEvent): void {
  if (!open.value || !menuRoot.value || !(event.target instanceof Node)) {
    return
  }

  if (!menuRoot.value.contains(event.target)) {
    closeMenu()
  }
}

function openProfileSettings(): void {
  closeMenu()
}

function openShortcutsPanel(): void {
  closeMenu()
  shortcutsPanelOpen.value = true
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
    closeShortcutsPanel()
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
        <button type="button" class="account-menu-item" role="menuitem" @click="openProfileSettings">
          <Settings2 class="size-4" />
          <span class="min-w-0">
            <span class="block">{{ t('shell.account.settings') }}</span>
            <span class="block truncate text-[0.6875rem] text-[var(--muted-foreground)]">{{ t('shell.account.profileSettings') }}</span>
          </span>
        </button>
      </div>

      <div class="grid border-b border-[var(--border)] p-1.5">
        <button type="button" class="account-menu-item" role="menuitem" @click="openShortcutsPanel">
          <Keyboard class="size-4" />
          <span class="min-w-0">
            <span class="block">{{ t('shell.account.shortcuts') }}</span>
            <span class="block truncate text-[0.6875rem] text-[var(--muted-foreground)]">
              {{ t('shell.account.shortcutsDetail') }}
            </span>
          </span>
        </button>
      </div>

      <div class="grid p-1.5">
        <button type="button" class="account-menu-item account-menu-item--danger" role="menuitem" @click="signOut">
          <LogOut class="size-4" />
          <span>{{ t('shell.account.signOut') }}</span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="shortcutsPanelOpen"
        class="fixed inset-0 z-[78] grid place-items-center bg-black/35 p-4 backdrop-blur-sm"
        @keydown.esc="closeShortcutsPanel"
      >
        <section
          class="w-full max-w-md overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--panel-shadow)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-panel-title"
        >
          <header class="flex items-start justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <div>
              <h2 id="shortcuts-panel-title" class="[font-family:var(--font-display)] text-lg text-[var(--foreground)]">
                {{ t('shell.shortcuts.title') }}
              </h2>
              <p class="mt-1 text-xs text-[var(--muted-foreground)]">{{ t('shell.shortcuts.readOnly') }}</p>
            </div>
            <button
              type="button"
              class="grid size-8 place-items-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
              :title="t('shell.shortcuts.close')"
              @click="closeShortcutsPanel"
            >
              <X class="size-4" />
            </button>
          </header>

          <div class="grid gap-2 p-3">
            <div class="shortcut-row">
              <span>{{ t('shell.shortcuts.stageManager') }}</span>
              <kbd>Cmd/Ctrl + Shift + M</kbd>
            </div>
            <div class="shortcut-row">
              <span>{{ t('shell.shortcuts.controlCenter') }}</span>
              <span class="shortcut-row__empty">{{ t('shell.shortcuts.unbound') }}</span>
            </div>
            <div class="shortcut-row">
              <span>{{ t('shell.shortcuts.aiAssistant') }}</span>
              <span class="shortcut-row__empty">{{ t('shell.shortcuts.unbound') }}</span>
            </div>
            <div class="shortcut-row">
              <span>{{ t('shell.shortcuts.commandPalette') }}</span>
              <span class="shortcut-row__empty">{{ t('shell.shortcuts.unbound') }}</span>
            </div>
          </div>
        </section>
      </div>
    </Teleport>
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

.shortcut-row {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  padding: 0.65rem 0.8rem;
  color: var(--foreground);
  font-size: 0.875rem;
}

.shortcut-row kbd,
.shortcut-row__empty {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  padding: 0.2rem 0.45rem;
  color: var(--muted-foreground);
  font-size: 0.6875rem;
  line-height: 1.2;
}
</style>
