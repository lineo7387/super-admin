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
    window.localStorage.setItem('super-admin:preferences', JSON.stringify({ profileId: 'industrial', density: 'compact' }))

    const preferences = usePreferencesStore()

    expect(preferences.profileId).toBe('industrial')
    expect(preferences.density).toBe('compact')
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
    preferences.setStageRailEnabled(false)
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
    expect(preferences.stageManager.railEnabled).toBe(false)
    expect(stored.stageManager).not.toHaveProperty('scrollOverflow')
    expect(stored.stageManager).not.toHaveProperty('presentationMode')
  })

  it('keeps fullscreen overview as desktop-only runtime state', () => {
    const preferences = usePreferencesStore()

    preferences.openStageOverview()
    expect(preferences.stageOverviewOpen).toBe(false)

    preferences.setStageManagerDesktopAvailable(true)
    preferences.openStageOverview()
    expect(preferences.stageOverviewOpen).toBe(true)

    preferences.closeStageOverview()
    expect(preferences.stageOverviewOpen).toBe(false)
    expect(window.localStorage.getItem('super-admin:preferences')).toBeNull()
  })

  it('drops retired stage manager scroll and presentation preferences from persisted state', () => {
    window.localStorage.setItem(
      'super-admin:preferences',
      JSON.stringify({
        stageManager: {
          enabled: true,
          scrollOverflow: true,
          presentationMode: 'all-windows'
        }
      })
    )

    const preferences = usePreferencesStore()

    expect(preferences.stageManager).not.toHaveProperty('scrollOverflow')
    expect(preferences.stageManager).not.toHaveProperty('presentationMode')
    expect(preferences.stageManager.railEnabled).toBe(true)

    preferences.setLocale('en-US')

    const stored = JSON.parse(window.localStorage.getItem('super-admin:preferences') ?? '{}') as Record<string, unknown>

    expect(stored.stageManager).not.toHaveProperty('scrollOverflow')
    expect(stored.stageManager).not.toHaveProperty('presentationMode')
  })
})
