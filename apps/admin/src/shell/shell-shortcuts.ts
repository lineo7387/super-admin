import { onMounted, onUnmounted } from 'vue'
import { usePreferencesStore } from '@/stores/preferences.store'

export type ShellShortcutEvent = {
  ctrlKey: boolean
  key: string
  metaKey: boolean
  shiftKey: boolean
}

export function isStageManagerShortcut(event: ShellShortcutEvent): boolean {
  return (event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'm'
}

export function useShellShortcuts(): void {
  const preferences = usePreferencesStore()

  function handleKeydown(event: KeyboardEvent): void {
    if (!isStageManagerShortcut(event)) {
      return
    }

    event.preventDefault()
    preferences.openStageManager()
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
