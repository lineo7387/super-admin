import { describe, expect, it } from 'vitest'
import authLayoutSource from './AuthLayout.vue?raw'
import globalPreferencesSource from '@/shell/preferences/GlobalPreferences.vue?raw'

describe('auth layout preferences entry', () => {
  it('uses the shared global preferences popover instead of a separate auth appearance menu', () => {
    expect(authLayoutSource).toContain("import GlobalPreferences from '@/shell/preferences/GlobalPreferences.vue'")
    expect(authLayoutSource).toContain('<GlobalPreferences')
    expect(authLayoutSource).not.toContain('AuthAppearanceMenu')
  })

  it('mounts the auth preferences trigger once outside profile-specific branches', () => {
    const preferenceTriggerMatches = authLayoutSource.match(/<GlobalPreferences trigger="auth"/g) ?? []
    const firstPreferenceTriggerIndex = authLayoutSource.indexOf('<GlobalPreferences trigger="auth"')
    const firstProfileBranchIndex = authLayoutSource.indexOf("v-if=\"preferences.profileId ===")

    expect(preferenceTriggerMatches).toHaveLength(1)
    expect(firstPreferenceTriggerIndex).toBeGreaterThan(-1)
    expect(firstProfileBranchIndex).toBeGreaterThan(-1)
    expect(firstPreferenceTriggerIndex).toBeLessThan(firstProfileBranchIndex)
  })

  it('aligns the auth preferences trigger to the auth layout container instead of the viewport edge', () => {
    expect(authLayoutSource).toContain('auth-preferences-slot')
    expect(globalPreferencesSource).not.toContain("fixed right-4 top-4 z-[70] max-w-[calc(100vw-2rem)]")
  })

  it('keeps the industrial title inside the left control composition', () => {
    const industrialSection = authLayoutSource.slice(
      authLayoutSource.indexOf("v-if=\"preferences.profileId === 'industrial'\""),
      authLayoutSource.indexOf("v-else-if=\"preferences.profileId === 'cyberpunk'\"")
    )
    const titleIndex = industrialSection.indexOf('{{ props.title }}')
    const railIndex = industrialSection.indexOf('auth-industrial__rail')
    const formPanelIndex = industrialSection.indexOf('auth-panel--industrial')

    expect(industrialSection).toContain('auth-industrial__intro')
    expect(titleIndex).toBeGreaterThan(-1)
    expect(railIndex).toBeGreaterThan(-1)
    expect(formPanelIndex).toBeGreaterThan(-1)
    expect(titleIndex).toBeLessThan(railIndex)
    expect(titleIndex).toBeLessThan(formPanelIndex)
  })
})
