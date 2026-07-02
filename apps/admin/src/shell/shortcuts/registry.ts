export type ShortcutCombo = {
  key: string
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
}

export type ShortcutScope = 'global' | 'normal'

export type ShortcutId = string

export type ShortcutDefinition = {
  id: ShortcutId
  labelKey: string
  defaultCombo: ShortcutCombo
  scope: ShortcutScope
}

export type ShortcutEvent = {
  key: string
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey?: boolean
}

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Ctrl', 'Meta', 'Alt'])

const BROWSER_RESERVED_LETTERS = new Set(['w', 't', 'n', 'l', 'r', 'p', 'q'])

export const DEFAULT_SHORTCUTS: readonly ShortcutDefinition[] = [
  {
    id: 'stage-manager',
    labelKey: 'shell.shortcuts.stageManager',
    defaultCombo: { key: 'm', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false },
    scope: 'global'
  },
  {
    id: 'control-center',
    labelKey: 'shell.shortcuts.controlCenter',
    defaultCombo: { key: 'c', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false },
    scope: 'global'
  },
  {
    id: 'ai-assistant',
    labelKey: 'shell.shortcuts.aiAssistant',
    defaultCombo: { key: 'a', metaKey: false, ctrlKey: true, shiftKey: true, altKey: false },
    scope: 'global'
  },
  {
    id: 'command-palette',
    labelKey: 'shell.shortcuts.commandPalette',
    defaultCombo: { key: 'k', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false },
    scope: 'global'
  }
] as const

export function normalizeCombo(event: ShortcutEvent): ShortcutCombo {
  return {
    key: event.key.length === 1 ? event.key.toLowerCase() : event.key,
    metaKey: event.metaKey,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    altKey: event.altKey ?? false
  }
}

function hasCmdOrCtrl(combo: ShortcutCombo): boolean {
  return combo.metaKey || combo.ctrlKey
}

export function combosMatch(a: ShortcutCombo, b: ShortcutCombo): boolean {
  return a.key === b.key && hasCmdOrCtrl(a) === hasCmdOrCtrl(b) && a.shiftKey === b.shiftKey && a.altKey === b.altKey
}

export function isModifierOnlyKey(key: string): boolean {
  return MODIFIER_KEYS.has(key)
}

export function isSingleModifierOnly(combo: ShortcutCombo): boolean {
  return isModifierOnlyKey(combo.key)
}

export function isBrowserReservedCombo(combo: ShortcutCombo): boolean {
  if (!combo.metaKey && !combo.ctrlKey) {
    return false
  }

  if (combo.altKey) {
    return false
  }

  if (!BROWSER_RESERVED_LETTERS.has(combo.key)) {
    return false
  }

  if (!combo.shiftKey) {
    return true
  }

  return combo.key === 't' || combo.key === 'n' || combo.key === 'w'
}

export function findConflict(
  bindings: ReadonlyArray<ShortcutDefinition>,
  combos: Readonly<Record<ShortcutId, ShortcutCombo>>,
  combo: ShortcutCombo,
  excludeId: ShortcutId
): ShortcutId | null {
  for (const def of bindings) {
    if (def.id === excludeId) {
      continue
    }

    const current = combos[def.id] ?? def.defaultCombo
    if (combosMatch(current, combo)) {
      return def.id
    }
  }

  return null
}

export function formatComboLabel(combo: ShortcutCombo): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
  const mod = isMac ? 'Cmd' : 'Ctrl'
  const parts: string[] = []

  if (combo.metaKey || combo.ctrlKey) {
    parts.push(mod)
  }

  if (combo.shiftKey) {
    parts.push('Shift')
  }

  if (combo.altKey) {
    parts.push(isMac ? 'Option' : 'Alt')
  }

  const keyLabel = combo.key.length === 1 ? combo.key.toUpperCase() : combo.key
  parts.push(keyLabel)

  return parts.join(' + ')
}
