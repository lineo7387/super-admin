import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getActiveLocale, i18n } from '@/i18n'
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
    i18n.global.locale.value = 'zh-CN'
  })

  it('keeps the AI assistant as runtime overlay state only', () => {
    const preferences = usePreferencesStore()

    preferences.openAiAssistant()
    expect(preferences.aiAssistantOpen).toBe(true)

    preferences.closeAiAssistant()
    expect(preferences.aiAssistantOpen).toBe(false)
    expect(window.localStorage.getItem('super-admin:preferences')).toBeNull()
  })

  it('defaults locale to zh-CN when stored preferences do not include locale', () => {
    window.localStorage.setItem('super-admin:preferences', JSON.stringify({ profileId: 'industrial' }))

    const preferences = usePreferencesStore()

    expect(preferences.profileId).toBe('industrial')
    expect(preferences.locale).toBe('zh-CN')
    expect(getActiveLocale()).toBe('zh-CN')
  })

  it('persists locale and updates the active i18n runtime without changing other preferences', () => {
    const preferences = usePreferencesStore()

    preferences.setProfile('industrial')
    preferences.setColorMode('light')
    preferences.setDensity('compact')
    preferences.setLayoutPreset('top-header')
    preferences.setTabsEnabled(false)
    preferences.setStageManagerEnabled(false)
    preferences.setLocale('en-US')

    const stored = JSON.parse(window.localStorage.getItem('super-admin:preferences') ?? '{}') as Record<string, unknown>

    expect(preferences.locale).toBe('en-US')
    expect(getActiveLocale()).toBe('en-US')
    expect(stored.locale).toBe('en-US')
    expect(preferences.profileId).toBe('industrial')
    expect(preferences.colorMode).toBe('light')
    expect(preferences.density).toBe('compact')
    expect(preferences.layoutPreset).toBe('top-header')
    expect(preferences.workspaceTabs.enabled).toBe(false)
    expect(preferences.stageManager.enabled).toBe(false)
  })
})
