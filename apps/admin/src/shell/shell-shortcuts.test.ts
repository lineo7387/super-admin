import { describe, expect, it } from 'vitest'
import { isStageManagerShortcut } from './shell-shortcuts'

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
})
