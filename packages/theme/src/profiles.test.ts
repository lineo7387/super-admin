import { describe, expect, it } from 'vitest'
import { builtInDesignProfiles, getBuiltInDesignProfile } from './index'

describe('built-in design profiles', () => {
  it('provide light and dark modes for every profile', () => {
    for (const profile of builtInDesignProfiles) {
      expect(profile.modes.light.id).toBe(`${profile.id}.light`)
      expect(profile.modes.dark.id).toBe(`${profile.id}.dark`)
    }
  })

  it('includes Cyberpunk with distinct neon light and dark modes', () => {
    const profile = getBuiltInDesignProfile('cyberpunk')

    expect(profile.id).toBe('cyberpunk')
    expect(profile.modes.dark.colors.primary).toBe('#00ff88')
    expect(profile.modes.dark.effects.texture).toContain('repeating-linear-gradient')
    expect(profile.modes.light.colors.primary).toBe('#006a7a')
    expect(profile.modes.light.colors.background).not.toBe(profile.modes.dark.colors.background)
  })
})
