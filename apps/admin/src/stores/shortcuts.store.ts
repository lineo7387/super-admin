import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import {
  combosMatch,
  DEFAULT_SHORTCUTS,
  findConflict,
  isBrowserReservedCombo,
  isSingleModifierOnly,
  type ShortcutCombo,
  type ShortcutDefinition,
  type ShortcutId
} from '@/shell/shortcuts/registry'

const STORAGE_KEY = 'super-admin:shortcuts'

type ShortcutOverrides = Record<ShortcutId, ShortcutCombo>

type StoredShortcuts = {
  overrides?: ShortcutOverrides
}

export type RebindResult =
  | { ok: true }
  | { ok: false; reason: 'conflict'; conflictId: ShortcutId }
  | { ok: false; reason: 'browser-reserved' }
  | { ok: false; reason: 'modifier-only' }

function readStoredOverrides(): ShortcutOverrides {
  if (typeof window === 'undefined') {
    return {}
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw) as StoredShortcuts
    return parsed.overrides ?? {}
  } catch {
    return {}
  }
}

export const useShortcutsStore = defineStore('shortcuts', () => {
  const overrides = reactive<ShortcutOverrides>(readStoredOverrides())
  const rebindingId = ref<ShortcutId | null>(null)

  const definitions = computed<readonly ShortcutDefinition[]>(() => DEFAULT_SHORTCUTS)

  const resolvedCombos = computed<Record<ShortcutId, ShortcutCombo>>(() => {
    const result: Record<ShortcutId, ShortcutCombo> = {}

    for (const def of DEFAULT_SHORTCUTS) {
      result[def.id] = overrides[def.id] ?? def.defaultCombo
    }

    return result
  })

  function persist(): void {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ overrides }))
  }

  function getCombo(id: ShortcutId): ShortcutCombo {
    return resolvedCombos.value[id] ?? getDefaultCombo(id)
  }

  function getDefaultCombo(id: ShortcutId): ShortcutCombo {
    const def = DEFAULT_SHORTCUTS.find((d) => d.id === id)
    if (!def) {
      throw new Error(`Unknown shortcut id: ${id}`)
    }

    return def.defaultCombo
  }

  function isUsingDefault(id: ShortcutId): boolean {
    return !overrides[id]
  }

  function rebind(id: ShortcutId, combo: ShortcutCombo): RebindResult {
    if (isSingleModifierOnly(combo)) {
      return { ok: false, reason: 'modifier-only' }
    }

    if (isBrowserReservedCombo(combo)) {
      return { ok: false, reason: 'browser-reserved' }
    }

    const current = resolvedCombos.value[id]
    if (current && combosMatch(current, combo)) {
      return { ok: true }
    }

    const conflictId = findConflict(DEFAULT_SHORTCUTS, resolvedCombos.value, combo, id)
    if (conflictId) {
      return { ok: false, reason: 'conflict', conflictId }
    }

    overrides[id] = { ...combo }
    persist()
    return { ok: true }
  }

  function resetShortcut(id: ShortcutId): void {
    if (!(id in overrides)) {
      return
    }

    delete overrides[id]
    persist()
  }

  function resetAll(): void {
    for (const key of Object.keys(overrides)) {
      delete overrides[key as ShortcutId]
    }

    persist()
  }

  function beginRebind(id: ShortcutId): void {
    rebindingId.value = id
  }

  function endRebind(): void {
    rebindingId.value = null
  }

  const isRebinding = computed(() => rebindingId.value !== null)

  return {
    definitions,
    resolvedCombos,
    overrides,
    rebindingId,
    isRebinding,
    getCombo,
    getDefaultCombo,
    isUsingDefault,
    rebind,
    resetShortcut,
    resetAll,
    beginRebind,
    endRebind
  }
})
