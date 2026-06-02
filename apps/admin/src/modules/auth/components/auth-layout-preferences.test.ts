import { describe, expect, it } from 'vitest'
import authLayoutSource from './AuthLayout.vue?raw'

describe('auth layout preferences entry', () => {
  it('uses the shared global preferences popover instead of a separate auth appearance menu', () => {
    expect(authLayoutSource).toContain("import GlobalPreferences from '@/shell/preferences/GlobalPreferences.vue'")
    expect(authLayoutSource).toContain('<GlobalPreferences')
    expect(authLayoutSource).not.toContain('AuthAppearanceMenu')
  })

  it('mounts the auth preferences trigger once outside profile-specific branches', () => {
    const preferenceTriggerMatches = authLayoutSource.match(/<GlobalPreferences trigger="auth"/g) ?? []
    const firstPreferenceTriggerIndex = authLayoutSource.indexOf('<GlobalPreferences trigger="auth"')
    const firstProfileBranchIndex = authLayoutSource.indexOf('v-if="profile ===')

    expect(preferenceTriggerMatches).toHaveLength(1)
    expect(firstPreferenceTriggerIndex).toBeGreaterThan(-1)
    expect(firstProfileBranchIndex).toBeGreaterThan(-1)
    expect(firstPreferenceTriggerIndex).toBeLessThan(firstProfileBranchIndex)
  })
})
