import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useShortcutsStore } from './shortcuts.store'

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

describe('shortcuts store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('window', {
      localStorage: createMemoryStorage()
    })
  })

  it('returns default combos when no overrides exist', () => {
    const store = useShortcutsStore()

    expect(store.getCombo('stage-manager').key).toBe('m')
    expect(store.getCombo('command-palette').key).toBe('k')
    expect(store.isUsingDefault('stage-manager')).toBe(true)
    expect(store.isUsingDefault('command-palette')).toBe(true)
  })

  it('rebinds a shortcut to a new combo and persists', () => {
    const store = useShortcutsStore()
    const newCombo = { key: 'j', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }

    const result = store.rebind('stage-manager', newCombo)

    expect(result.ok).toBe(true)
    expect(store.getCombo('stage-manager')).toEqual(newCombo)
    expect(store.isUsingDefault('stage-manager')).toBe(false)

    const raw = window.localStorage.getItem('super-admin:shortcuts')
    expect(raw).toContain('"stage-manager"')
    expect(raw).toContain('"key":"j"')
  })

  it('rejects rebind to a combo that conflicts with another shortcut', () => {
    const store = useShortcutsStore()

    const result = store.rebind('control-center', {
      key: 'm',
      metaKey: false,
      ctrlKey: true,
      shiftKey: true,
      altKey: false
    })

    expect(result.ok).toBe(false)
    if (!result.ok && result.reason === 'conflict') {
      expect(result.conflictId).toBe('stage-manager')
    }
    expect(store.isUsingDefault('control-center')).toBe(true)
  })

  it('rejects rebind to a browser-reserved combo', () => {
    const store = useShortcutsStore()

    const result = store.rebind('control-center', {
      key: 'w',
      metaKey: false,
      ctrlKey: true,
      shiftKey: false,
      altKey: false
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('browser-reserved')
    }
  })

  it('rejects rebind to a single modifier key only', () => {
    const store = useShortcutsStore()

    const result = store.rebind('control-center', {
      key: 'Shift',
      metaKey: false,
      ctrlKey: false,
      shiftKey: true,
      altKey: false
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('modifier-only')
    }
  })

  it('allows rebind to the same combo (no-op success)', () => {
    const store = useShortcutsStore()

    const result = store.rebind('stage-manager', {
      key: 'm',
      metaKey: false,
      ctrlKey: true,
      shiftKey: true,
      altKey: false
    })

    expect(result.ok).toBe(true)
  })

  it('resets a single shortcut to its default', () => {
    const store = useShortcutsStore()

    store.rebind('stage-manager', { key: 'j', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })
    expect(store.isUsingDefault('stage-manager')).toBe(false)

    store.resetShortcut('stage-manager')

    expect(store.isUsingDefault('stage-manager')).toBe(true)
    expect(store.getCombo('stage-manager').key).toBe('m')
  })

  it('resets all shortcuts to defaults', () => {
    const store = useShortcutsStore()

    store.rebind('stage-manager', { key: 'j', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })
    store.rebind('control-center', { key: 'd', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false })

    store.resetAll()

    expect(store.isUsingDefault('stage-manager')).toBe(true)
    expect(store.isUsingDefault('control-center')).toBe(true)
  })

  it('loads overrides from localStorage on initialization', () => {
    const storage = createMemoryStorage()
    storage.setItem(
      'super-admin:shortcuts',
      JSON.stringify({
        overrides: {
          'command-palette': { key: 'p', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }
        }
      })
    )
    vi.stubGlobal('window', { localStorage: storage })

    setActivePinia(createPinia())
    const store = useShortcutsStore()

    expect(store.getCombo('command-palette').key).toBe('p')
    expect(store.isUsingDefault('command-palette')).toBe(false)
  })

  it('handles corrupted localStorage gracefully', () => {
    const storage = createMemoryStorage()
    storage.setItem('super-admin:shortcuts', 'not valid json{')
    vi.stubGlobal('window', { localStorage: storage })

    setActivePinia(createPinia())
    const store = useShortcutsStore()

    expect(store.isUsingDefault('stage-manager')).toBe(true)
    expect(store.getCombo('stage-manager').key).toBe('m')
  })

  it('tracks rebind mode via beginRebind/endRebind', () => {
    const store = useShortcutsStore()

    expect(store.isRebinding).toBe(false)
    expect(store.rebindingId).toBeNull()

    store.beginRebind('control-center')

    expect(store.isRebinding).toBe(true)
    expect(store.rebindingId).toBe('control-center')

    store.endRebind()

    expect(store.isRebinding).toBe(false)
    expect(store.rebindingId).toBeNull()
  })
})
