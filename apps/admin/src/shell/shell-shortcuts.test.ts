import { describe, expect, it, vi } from 'vitest'
import { handleShellShortcutKeydown, isStageManagerShortcut, shouldHandleShortcut } from './shell-shortcuts'
import { DEFAULT_SHORTCUTS, type ShortcutCombo } from './shortcuts/registry'
import shellShortcutsSource from './shell-shortcuts?raw'

describe('shell shortcuts', () => {
  it('recognizes the stage manager keyboard shortcut on macOS and non-macOS keyboards', () => {
    expect(isStageManagerShortcut({ ctrlKey: true, key: 'm', metaKey: false, shiftKey: true })).toBe(true)
    expect(isStageManagerShortcut({ ctrlKey: false, key: 'M', metaKey: true, shiftKey: true })).toBe(true)
  })

  it('ignores nearby shortcuts that should remain available to the browser or app', () => {
    expect(isStageManagerShortcut({ ctrlKey: true, key: 'm', metaKey: false, shiftKey: false })).toBe(false)
    expect(isStageManagerShortcut({ ctrlKey: false, key: 'm', metaKey: false, shiftKey: true })).toBe(false)
    expect(isStageManagerShortcut({ ctrlKey: true, key: 'k', metaKey: false, shiftKey: true })).toBe(false)
  })

  it('opens fullscreen overview instead of toggling the persistent Stage Rail', () => {
    expect(shellShortcutsSource).toContain('preferences.openStageOverview()')
    expect(shellShortcutsSource).not.toContain('preferences.openStageManager()')
    expect(shellShortcutsSource).not.toContain('preferences.setStageRailEnabled')
  })

  it('keeps global shortcuts active in inputs and suppresses normal shortcuts', () => {
    expect(shouldHandleShortcut('global', true)).toBe(true)
    expect(shouldHandleShortcut('normal', true)).toBe(false)
    expect(shouldHandleShortcut('normal', false)).toBe(true)
  })

  it('suppresses normal actions through the real keydown dispatcher when an input is focused', () => {
    const openAiAssistant = vi.fn()
    const preventDefault = vi.fn()
    const event = {
      altKey: false,
      ctrlKey: true,
      key: 'a',
      metaKey: false,
      preventDefault,
      shiftKey: true,
      target: { isContentEditable: false, tagName: 'INPUT' }
    } as unknown as KeyboardEvent

    const handled = handleShellShortcutKeydown(event, {
      actions: { 'ai-assistant': openAiAssistant },
      getCombo: (id) => DEFAULT_SHORTCUTS.find((definition) => definition.id === id)?.defaultCombo as ShortcutCombo,
      isRebinding: false
    })

    expect(handled).toBe(false)
    expect(openAiAssistant).not.toHaveBeenCalled()
    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('runs global actions through the real keydown dispatcher when an input is focused', () => {
    const openCommandPalette = vi.fn()
    const preventDefault = vi.fn()
    const event = {
      altKey: false,
      ctrlKey: true,
      key: 'k',
      metaKey: false,
      preventDefault,
      shiftKey: false,
      target: { isContentEditable: false, tagName: 'INPUT' }
    } as unknown as KeyboardEvent

    const handled = handleShellShortcutKeydown(event, {
      actions: { 'command-palette': openCommandPalette },
      getCombo: (id) => DEFAULT_SHORTCUTS.find((definition) => definition.id === id)?.defaultCombo as ShortcutCombo,
      isRebinding: false
    })

    expect(handled).toBe(true)
    expect(openCommandPalette).toHaveBeenCalledOnce()
    expect(preventDefault).toHaveBeenCalledOnce()
  })
})
