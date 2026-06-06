import { describe, expect, it } from 'vitest'
import { resolveColorMode } from './design-profile'
import { mergeAppearanceState } from './preferences'
import { resolveLayoutPreset } from './shell'

describe('preference resolution', () => {
  it('uses system color mode only when requested', () => {
    expect(resolveColorMode('system', 'dark')).toBe('dark')
    expect(resolveColorMode('light', 'dark')).toBe('light')
  })

  it('defaults new starters to the neutral base profile in light mode', () => {
    const state = mergeAppearanceState({})

    expect(state.profileId).toBe('base')
    expect(state.colorMode).toBe('light')
  })

  it('merges partial appearance state with stable defaults', () => {
    const state = mergeAppearanceState({
      profileId: 'industrial',
      workspaceTabs: { enabled: false, restorePinnedTabs: false, closeStrategy: 'activate-left' }
    })

    expect(state.profileId).toBe('industrial')
    expect(state.locale).toBe('zh-CN')
    expect(state.layoutPreset).toBe('tri-column')
    expect(state.workspaceTabs.enabled).toBe(false)
    expect(state.stageManager.enabled).toBe(true)
    expect(state.stageManager.presentationMode).toBe('side-dock')
    expect(state.stageManager).not.toHaveProperty('scrollOverflow')
  })

  it('keeps locale, layout preset, and stage manager independent', () => {
    const legacyStageManager = {
      enabled: false,
      scrollOverflow: true,
      presentationMode: 'all-windows'
    } as unknown as Parameters<typeof mergeAppearanceState>[0]['stageManager']

    const state = mergeAppearanceState({
      locale: 'en-US',
      layoutPreset: 'top-header',
      workspaceTabs: { enabled: true },
      stageManager: legacyStageManager
    })

    expect(state.locale).toBe('en-US')
    expect(state.layoutPreset).toBe('top-header')
    expect(state.workspaceTabs.enabled).toBe(true)
    expect(state.stageManager.enabled).toBe(false)
    expect(state.stageManager.presentationMode).toBe('all-windows')
    expect(state.stageManager).not.toHaveProperty('scrollOverflow')
  })

  it('allows page metadata to override the active layout preference', () => {
    expect(resolveLayoutPreset('tri-column', 'top-header')).toBe('top-header')
    expect(resolveLayoutPreset('dual-column')).toBe('dual-column')
  })
})
