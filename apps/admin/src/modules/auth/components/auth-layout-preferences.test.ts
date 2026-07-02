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
    const firstProfileBranchIndex = authLayoutSource.indexOf('v-if="preferences.profileId ===')

    expect(preferenceTriggerMatches).toHaveLength(1)
    expect(firstPreferenceTriggerIndex).toBeGreaterThan(-1)
    expect(firstProfileBranchIndex).toBeGreaterThan(-1)
    expect(firstPreferenceTriggerIndex).toBeLessThan(firstProfileBranchIndex)
  })

  it('aligns the auth preferences trigger to the auth layout container instead of the viewport edge', () => {
    expect(authLayoutSource).toContain('auth-preferences-slot')
    expect(globalPreferencesSource).not.toContain('fixed right-4 top-4 z-[70] max-w-[calc(100vw-2rem)]')
  })

  it('includes a dedicated Base auth composition before the strong-style branches', () => {
    const baseBranchIndex = authLayoutSource.indexOf('v-if="preferences.profileId === \'base\'"')
    const industrialBranchIndex = authLayoutSource.indexOf('v-else-if="preferences.profileId === \'industrial\'"')

    expect(baseBranchIndex).toBeGreaterThan(-1)
    expect(industrialBranchIndex).toBeGreaterThan(-1)
    expect(baseBranchIndex).toBeLessThan(industrialBranchIndex)
    expect(authLayoutSource).toContain('auth-base__workspace')
    expect(authLayoutSource).toContain('auth-panel--base')
  })

  it('keeps the industrial title inside the left control composition', () => {
    const industrialBranchIndex = authLayoutSource.indexOf("preferences.profileId === 'industrial'")
    const cyberpunkBranchIndex = authLayoutSource.indexOf("preferences.profileId === 'cyberpunk'")
    const industrialSection = authLayoutSource.slice(industrialBranchIndex, cyberpunkBranchIndex)
    const titleIndex = industrialSection.indexOf('{{ props.title }}')
    const railIndex = industrialSection.indexOf('auth-industrial__rail')
    const formPanelIndex = industrialSection.indexOf('auth-panel--industrial')

    expect(industrialBranchIndex).toBeGreaterThan(-1)
    expect(cyberpunkBranchIndex).toBeGreaterThan(-1)
    expect(industrialSection).toContain('auth-industrial__intro')
    expect(titleIndex).toBeGreaterThan(-1)
    expect(railIndex).toBeGreaterThan(-1)
    expect(formPanelIndex).toBeGreaterThan(-1)
    expect(titleIndex).toBeLessThan(railIndex)
    expect(titleIndex).toBeLessThan(formPanelIndex)
  })

  it('includes a dedicated Newsprint auth composition before the default Crypto fallback', () => {
    const newsprintBranchIndex = authLayoutSource.indexOf('v-else-if="preferences.profileId === \'newsprint\'"')
    const cryptoFallbackIndex = authLayoutSource.match(/v-else\s+class="auth-crypto/)?.index ?? -1

    expect(newsprintBranchIndex).toBeGreaterThan(-1)
    expect(cryptoFallbackIndex).toBeGreaterThan(-1)
    expect(newsprintBranchIndex).toBeLessThan(cryptoFallbackIndex)
    expect(authLayoutSource).toContain('auth-newsprint__masthead')
    expect(authLayoutSource).toContain('auth-panel--newsprint')
  })
})
