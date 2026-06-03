import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePreferencesStore } from './preferences.store'

function createMemoryStorage(): Storage {
  const values = new Map<string, string>()

  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value)
  }
}

describe('preferences store shell overlays', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('window', {
      localStorage: createMemoryStorage()
    })
  })

  it('keeps the AI assistant as runtime overlay state only', () => {
    const preferences = usePreferencesStore()

    preferences.openAiAssistant()
    expect(preferences.aiAssistantOpen).toBe(true)

    preferences.closeAiAssistant()
    expect(preferences.aiAssistantOpen).toBe(false)
    expect(window.localStorage.getItem('super-admin:preferences')).toBeNull()
  })
})
