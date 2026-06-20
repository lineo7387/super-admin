import { describe, expect, it } from 'vitest'
import {
  combosMatch,
  DEFAULT_SHORTCUTS,
  findConflict,
  formatComboLabel,
  isBrowserReservedCombo,
  isSingleModifierOnly,
  normalizeCombo,
  type ShortcutCombo
} from './registry'

describe('shortcut registry', () => {
  describe('normalizeCombo', () => {
    it('lowercases single-character keys', () => {
      expect(normalizeCombo({ key: 'M', metaKey: true, ctrlKey: false, shiftKey: true }).key).toBe('m')
      expect(normalizeCombo({ key: 'K', metaKey: false, ctrlKey: true, shiftKey: false }).key).toBe('k')
    })

    it('preserves multi-character keys like Enter and Escape', () => {
      expect(normalizeCombo({ key: 'Enter', metaKey: false, ctrlKey: false, shiftKey: false }).key).toBe('Enter')
      expect(normalizeCombo({ key: 'Escape', metaKey: false, ctrlKey: false, shiftKey: false }).key).toBe('Escape')
    })

    it('defaults altKey to false when absent', () => {
      const combo = normalizeCombo({ key: 'k', metaKey: false, ctrlKey: true, shiftKey: false })
      expect(combo.altKey).toBe(false)
    })
  })

  describe('combosMatch', () => {
    const base: ShortcutCombo = { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }

    it('returns true for identical combos', () => {
      expect(combosMatch(base, { ...base })).toBe(true)
    })

    it('treats Cmd (metaKey) and Ctrl (ctrlKey) as interchangeable', () => {
      expect(combosMatch(base, { ...base, metaKey: true, ctrlKey: false })).toBe(true)
      expect(combosMatch({ ...base, metaKey: true, ctrlKey: false }, base)).toBe(true)
    })

    it('returns false when key, shiftKey, or altKey differ', () => {
      expect(combosMatch(base, { ...base, key: 'k' })).toBe(false)
      expect(combosMatch(base, { ...base, shiftKey: false })).toBe(false)
      expect(combosMatch(base, { ...base, altKey: true })).toBe(false)
    })

    it('returns false when one has Ctrl/Cmd and the other does not', () => {
      expect(combosMatch(base, { ...base, metaKey: false, ctrlKey: false })).toBe(false)
    })
  })

  describe('isSingleModifierOnly', () => {
    it('returns true for Shift, Control, Meta, Alt', () => {
      expect(isSingleModifierOnly({ key: 'Shift', metaKey: false, ctrlKey: false, shiftKey: true, altKey: false })).toBe(true)
      expect(isSingleModifierOnly({ key: 'Control', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(true)
      expect(isSingleModifierOnly({ key: 'Meta', metaKey: true, ctrlKey: false, shiftKey: false, altKey: false })).toBe(true)
      expect(isSingleModifierOnly({ key: 'Alt', metaKey: false, ctrlKey: false, shiftKey: false, altKey: true })).toBe(true)
    })

    it('returns false for real keys', () => {
      expect(isSingleModifierOnly({ key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })).toBe(false)
      expect(isSingleModifierOnly({ key: 'k', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(false)
    })
  })

  describe('isBrowserReservedCombo', () => {
    it('rejects Cmd/Ctrl + W/T/N/L/R/P/Q without Shift', () => {
      expect(isBrowserReservedCombo({ key: 'w', metaKey: true, ctrlKey: false, shiftKey: false, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 't', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 'n', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 'l', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 'r', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 'p', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 'q', metaKey: true, ctrlKey: false, shiftKey: false, altKey: false })).toBe(true)
    })

    it('rejects Cmd/Ctrl + Shift + T/N/W', () => {
      expect(isBrowserReservedCombo({ key: 't', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 'n', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })).toBe(true)
      expect(isBrowserReservedCombo({ key: 'w', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })).toBe(true)
    })

    it('allows Cmd/Ctrl + K and Cmd/Ctrl + Shift + M', () => {
      expect(isBrowserReservedCombo({ key: 'k', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false })).toBe(false)
      expect(isBrowserReservedCombo({ key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })).toBe(false)
    })

    it('allows combos with Alt', () => {
      expect(isBrowserReservedCombo({ key: 'w', metaKey: false, ctrlKey: true, shiftKey: false, altKey: true })).toBe(false)
    })

    it('allows combos without Cmd/Ctrl', () => {
      expect(isBrowserReservedCombo({ key: 'w', metaKey: false, ctrlKey: false, shiftKey: false, altKey: false })).toBe(false)
    })
  })

  describe('findConflict', () => {
    it('finds a conflicting shortcut', () => {
      const combos: Record<string, ShortcutCombo> = {
        'stage-manager': { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false },
        'control-center': { key: 'c', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }
      }
      const result = findConflict(DEFAULT_SHORTCUTS, combos, { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }, 'control-center')
      expect(result).toBe('stage-manager')
    })

    it('returns null when no conflict', () => {
      const combos: Record<string, ShortcutCombo> = {
        'stage-manager': { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }
      }
      const result = findConflict(DEFAULT_SHORTCUTS, combos, { key: 'd', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }, 'control-center')
      expect(result).toBeNull()
    })

    it('ignores the excluded shortcut id', () => {
      const combos: Record<string, ShortcutCombo> = {
        'stage-manager': { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }
      }
      const result = findConflict(DEFAULT_SHORTCUTS, combos, { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }, 'stage-manager')
      expect(result).toBeNull()
    })
  })

  describe('formatComboLabel', () => {
    it('formats Ctrl+Shift+M on non-Mac', () => {
      const combo: ShortcutCombo = { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }
      const label = formatComboLabel(combo)
      expect(label).toMatch(/(Cmd|Ctrl) \+ Shift \+ M/)
    })

    it('formats Ctrl+K on non-Mac', () => {
      const combo: ShortcutCombo = { key: 'k', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false }
      const label = formatComboLabel(combo)
      expect(label).toMatch(/(Cmd|Ctrl) \+ K/)
    })

    it('includes Alt/Option when present', () => {
      const combo: ShortcutCombo = { key: 'k', metaKey: false, ctrlKey: true, shiftKey: false, altKey: true }
      const label = formatComboLabel(combo)
      expect(label).toMatch(/(Alt|Option)/)
    })
  })

  describe('DEFAULT_SHORTCUTS', () => {
    it('includes stage-manager, control-center, ai-assistant, and command-palette', () => {
      const ids = DEFAULT_SHORTCUTS.map((d) => d.id)
      expect(ids).toContain('stage-manager')
      expect(ids).toContain('control-center')
      expect(ids).toContain('ai-assistant')
      expect(ids).toContain('command-palette')
    })

    it('all defaults are global scope', () => {
      for (const def of DEFAULT_SHORTCUTS) {
        expect(def.scope).toBe('global')
      }
    })

    it('command-palette defaults to Ctrl/Cmd+K', () => {
      const palette = DEFAULT_SHORTCUTS.find((d) => d.id === 'command-palette')
      expect(palette).toBeDefined()
      expect(palette!.defaultCombo.key).toBe('k')
      expect(palette!.defaultCombo.shiftKey).toBe(false)
    })

    it('default Ctrl+Shift+M matches a Mac Cmd+Shift+M keydown (Ctrl/Cmd interchangeable)', () => {
      const stageManager = DEFAULT_SHORTCUTS.find((d) => d.id === 'stage-manager')!
      const macKeydown = normalizeCombo({ key: 'M', metaKey: true, ctrlKey: false, shiftKey: true })
      expect(combosMatch(macKeydown, stageManager.defaultCombo)).toBe(true)
    })

    it('default Ctrl+K matches a Mac Cmd+K keydown (Ctrl/Cmd interchangeable)', () => {
      const palette = DEFAULT_SHORTCUTS.find((d) => d.id === 'command-palette')!
      const macKeydown = normalizeCombo({ key: 'k', metaKey: true, ctrlKey: false, shiftKey: false })
      expect(combosMatch(macKeydown, palette.defaultCombo)).toBe(true)
    })
  })
})
