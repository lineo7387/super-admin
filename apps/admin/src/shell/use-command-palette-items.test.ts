import { flattenModuleNav } from '@super-admin-org/core'
import { describe, expect, it, vi } from 'vitest'
import { registeredModules } from '@/modules/module-registry'
import { builtInDesignProfiles } from '@/super-admin/theme-registry.generated'
import {
  createProfileCommandItems,
  filterCommandItems,
  moveCommandSelection,
  useCommandPaletteItems,
  type CommandPaletteItem
} from './use-command-palette-items'
import commandPaletteItemsSource from './use-command-palette-items.ts?raw'

const commandPaletteTestDoubles = vi.hoisted(() => ({
  preferences: {
    openAiAssistant: vi.fn(),
    openControlCenter: vi.fn(),
    openStageOverview: vi.fn(),
    setColorMode: vi.fn(),
    setLocale: vi.fn(),
    setProfile: vi.fn()
  },
  routerPush: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: commandPaletteTestDoubles.routerPush })
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()

  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key })
  }
})

vi.mock('@/stores/preferences.store', () => ({
  usePreferencesStore: () => commandPaletteTestDoubles.preferences
}))

function makeItem(id: string, label: string, group: CommandPaletteItem['group'] = 'navigation'): CommandPaletteItem {
  return { id, label, group, perform: () => {} }
}

describe('filterCommandItems', () => {
  const items: CommandPaletteItem[] = [
    makeItem('nav:dashboard', 'Examples / Dashboard'),
    makeItem('nav:users-all', 'Examples / Users / All Users'),
    makeItem('action:open-control-center', 'Open Control Center', 'actions'),
    makeItem('action:color-mode-dark', 'Set color mode: Dark', 'actions')
  ]

  it('returns all items when query is empty', () => {
    expect(filterCommandItems(items, '')).toHaveLength(4)
    expect(filterCommandItems(items, '   ')).toHaveLength(4)
  })

  it('filters by case-insensitive substring match', () => {
    const result = filterCommandItems(items, 'users')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('nav:users-all')
  })

  it('matches action labels too', () => {
    const result = filterCommandItems(items, 'color mode')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('action:color-mode-dark')
  })

  it('returns empty when no match', () => {
    expect(filterCommandItems(items, 'nonexistent')).toHaveLength(0)
  })

  it('matches across navigation and actions', () => {
    const result = filterCommandItems(items, 'control')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('action:open-control-center')
  })
})

describe('moveCommandSelection', () => {
  it('keeps a stable selection when the result list is empty', () => {
    expect(moveCommandSelection(0, 1, 0)).toBe(0)
    expect(moveCommandSelection(0, -1, 0)).toBe(0)
  })

  it('wraps selection in both directions', () => {
    expect(moveCommandSelection(2, 1, 3)).toBe(0)
    expect(moveCommandSelection(0, -1, 3)).toBe(2)
  })
})

describe('useCommandPaletteItems navigation', () => {
  const registeredNavEntries = registeredModules.flatMap((manifest) => flattenModuleNav(manifest.nav))
  const registeredLeafEntries = registeredNavEntries.filter((entry) => !entry.item.children?.length)

  it('creates unique IDs from the registered module manifests', () => {
    const navigationItems = useCommandPaletteItems().items.value.filter((item) => item.group === 'navigation')

    expect(new Set(navigationItems.map((item) => item.id)).size).toBe(navigationItems.length)
  })

  it('treats nodes with children as groups and creates commands only for leaves', () => {
    const navigationItems = useCommandPaletteItems().items.value.filter((item) => item.group === 'navigation')

    expect(navigationItems).toHaveLength(registeredLeafEntries.length)
    expect(navigationItems.map((item) => item.hint)).toEqual(registeredLeafEntries.map((entry) => entry.item.path))
  })
})

describe('createProfileCommandItems', () => {
  it('creates one unique executable action for every installed profile', () => {
    const setProfile = vi.fn()
    const items = createProfileCommandItems(builtInDesignProfiles, (name) => `Theme: ${name}`, setProfile)

    expect(items).toHaveLength(builtInDesignProfiles.length)
    expect(new Set(items.map((item) => item.id)).size).toBe(builtInDesignProfiles.length)

    items.forEach((item, index) => {
      const profile = builtInDesignProfiles[index]
      expect(item.id).toBe(`action:profile:${profile.id}`)
      expect(item.label).toBe(`Theme: ${profile.name}`)
      expect(item.group).toBe('actions')
      item.perform()
      expect(setProfile).toHaveBeenNthCalledWith(index + 1, profile.id)
    })
  })
})

describe('command palette items source', () => {
  it('builds navigation items from registered module manifests via flattenModuleNav', () => {
    expect(commandPaletteItemsSource).toContain('flattenModuleNav')
    expect(commandPaletteItemsSource).toContain('registeredModules')
    expect(commandPaletteItemsSource).toContain("'navigation'")
  })

  it('builds action items for shell commands', () => {
    expect(commandPaletteItemsSource).toContain("'actions'")
    expect(commandPaletteItemsSource).toContain('openControlCenter')
    expect(commandPaletteItemsSource).toContain('openAiAssistant')
    expect(commandPaletteItemsSource).toContain('openStageOverview')
  })

  it('includes color mode and locale switch actions', () => {
    expect(commandPaletteItemsSource).toContain('setColorMode')
    expect(commandPaletteItemsSource).toContain('setLocale')
    expect(commandPaletteItemsSource).toContain("'light'")
    expect(commandPaletteItemsSource).toContain("'dark'")
    expect(commandPaletteItemsSource).toContain("'system'")
    expect(commandPaletteItemsSource).toContain("'zh-CN'")
    expect(commandPaletteItemsSource).toContain("'en-US'")
  })

  it('includes an action for every installed design profile', () => {
    expect(commandPaletteItemsSource).toContain('builtInDesignProfiles')
    expect(commandPaletteItemsSource).toContain('setProfile')
    expect(commandPaletteItemsSource).toContain('shell.commandPalette.actions.setProfile')
  })
})
