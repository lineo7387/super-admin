import { onMounted, onUnmounted } from 'vue'
import { usePreferencesStore } from '@/stores/preferences.store'
import { useShortcutsStore } from '@/stores/shortcuts.store'
import { combosMatch, DEFAULT_SHORTCUTS, normalizeCombo, type ShortcutEvent, type ShortcutId, type ShortcutScope } from './shortcuts/registry'

const TYPING_TAGS = new Set(['input', 'textarea', 'select'])

function isTypingInInput(target: EventTarget | null): boolean {
  if (typeof target !== 'object' || target === null || !('tagName' in target)) {
    return false
  }

  const element = target as { isContentEditable?: boolean; tagName?: unknown }
  return (typeof element.tagName === 'string' && TYPING_TAGS.has(element.tagName.toLowerCase())) || element.isContentEditable === true
}

export function isStageManagerShortcut(event: ShortcutEvent): boolean {
  const combo = normalizeCombo(event)
  return (combo.metaKey || combo.ctrlKey) && combo.shiftKey && combo.key === 'm'
}

export function shouldHandleShortcut(scope: ShortcutScope, typingInInput: boolean): boolean {
  return scope === 'global' || !typingInInput
}

type ShortcutActions = Partial<Record<ShortcutId, () => void>>

export type ShellShortcutRuntime = {
  actions: ShortcutActions
  getCombo: (id: ShortcutId) => ReturnType<typeof normalizeCombo>
  isRebinding: boolean
}

export function handleShellShortcutKeydown(event: KeyboardEvent, runtime: ShellShortcutRuntime): boolean {
  if (runtime.isRebinding) {
    return false
  }

  const combo = normalizeCombo(event)

  for (const def of DEFAULT_SHORTCUTS) {
    if (!combosMatch(combo, runtime.getCombo(def.id))) {
      continue
    }

    const action = runtime.actions[def.id]
    if (!action) {
      continue
    }

    if (!shouldHandleShortcut(def.scope, isTypingInInput(event.target))) {
      continue
    }

    event.preventDefault()
    action()
    return true
  }

  return false
}

export function useShellShortcuts(): void {
  const preferences = usePreferencesStore()
  const shortcuts = useShortcutsStore()

  const actions: ShortcutActions = {
    'stage-manager': () => preferences.openStageOverview(),
    'control-center': () => preferences.openControlCenter(),
    'ai-assistant': () => preferences.openAiAssistant(),
    'command-palette': () => preferences.openCommandPalette()
  }

  function handleKeydown(event: KeyboardEvent): void {
    handleShellShortcutKeydown(event, {
      actions,
      getCombo: (id) => shortcuts.getCombo(id),
      isRebinding: shortcuts.isRebinding
    })
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
