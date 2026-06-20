import { describe, expect, it } from 'vitest'
import commandPaletteSource from './CommandPalette.vue?raw'

describe('CommandPalette component', () => {
  it('renders as a teleported modal dialog with theme-aware CSS variables', () => {
    expect(commandPaletteSource).toContain('Teleport to="body"')
    expect(commandPaletteSource).toContain('role="dialog"')
    expect(commandPaletteSource).toContain('aria-modal="true"')
    expect(commandPaletteSource).toContain('var(--surface)')
    expect(commandPaletteSource).toContain('var(--foreground)')
    expect(commandPaletteSource).toContain('var(--border)')
  })

  it('uses the shared AdminScrollArea for the results list', () => {
    expect(commandPaletteSource).toContain('AdminScrollArea')
    expect(commandPaletteSource).not.toContain('overflow-y-auto')
  })

  it('implements keyboard navigation for arrow keys, enter, and escape', () => {
    expect(commandPaletteSource).toContain("event.key === 'ArrowDown'")
    expect(commandPaletteSource).toContain("event.key === 'ArrowUp'")
    expect(commandPaletteSource).toContain("event.key === 'Enter'")
    expect(commandPaletteSource).toContain("event.key === 'Escape'")
    expect(commandPaletteSource).toContain('preventDefault')
  })

  it('wraps selection around the filtered list', () => {
    expect(commandPaletteSource).toContain('% filtered.value.length')
  })

  it('uses the shared filterCommandItems helper', () => {
    expect(commandPaletteSource).toContain('filterCommandItems')
  })

  it('groups results into navigation and actions sections', () => {
    expect(commandPaletteSource).toContain('navigation')
    expect(commandPaletteSource).toContain('actions')
    expect(commandPaletteSource).toContain('shell.commandPalette.groups')
  })

  it('shows an empty state when no results match', () => {
    expect(commandPaletteSource).toContain('shell.commandPalette.empty')
  })

  it('auto-focuses the input when opened and resets state', () => {
    expect(commandPaletteSource).toContain('inputElement.value?.focus()')
    expect(commandPaletteSource).toContain('reset()')
  })

  it('closes after performing an item action', () => {
    expect(commandPaletteSource).toContain('perform(')
    expect(commandPaletteSource).toContain("emit('close')")
  })

  it('renders an accessible close button with aria-label', () => {
    expect(commandPaletteSource).toContain('shell.commandPalette.close')
  })
})
