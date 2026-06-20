import { onMounted, onUnmounted } from 'vue'
import { usePreferencesStore } from '@/stores/preferences.store'
import { useShortcutsStore } from '@/stores/shortcuts.store'
import {
  combosMatch,
  DEFAULT_SHORTCUTS,
  normalizeCombo,
  type ShortcutEvent,
  type ShortcutId
} from './shortcuts/registry'

const TYPING_TAGS = new Set(['input', 'textarea', 'select'])

function isTypingInInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return TYPING_TAGS.has(target.tagName.toLowerCase()) || target.isContentEditable
}

export function isStageManagerShortcut(event: ShortcutEvent): boolean {
  const combo = normalizeCombo(event)
  return (
    (combo.metaKey || combo.ctrlKey) &&
    combo.shiftKey &&
    combo.key === 'm'
  )
}

type ShortcutActions = Partial<Record<ShortcutId, () => void>>

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
    if (shortcuts.isRebinding) {
      return
    }

    const combo = normalizeCombo(event)

    for (const def of DEFAULT_SHORTCUTS) {
      if (!combosMatch(combo, shortcuts.getCombo(def.id))) {
        continue
      }

      const action = actions[def.id]
      if (!action) {
        continue
      }

      if (def.scope !== 'global' && isTypingInInput(event.target)) {
        continue
      }

      event.preventDefault()
      action()
      return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
