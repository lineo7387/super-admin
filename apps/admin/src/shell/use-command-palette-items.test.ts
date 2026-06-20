import { describe, expect, it } from 'vitest'
import { filterCommandItems, type CommandPaletteItem } from './use-command-palette-items'
import commandPaletteItemsSource from './use-command-palette-items.ts?raw'

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
})
