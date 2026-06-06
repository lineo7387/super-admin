import { describe, expect, it } from 'vitest'
import { builtInDesignProfiles, getBuiltInDesignProfile } from './index'

describe('built-in design profiles', () => {
  it('provide light and dark modes for every profile', () => {
    for (const profile of builtInDesignProfiles) {
      expect(profile.modes.light.id).toBe(`${profile.id}.light`)
      expect(profile.modes.dark.id).toBe(`${profile.id}.dark`)
    }
  })

  it('includes Base with neutral shadcn-vue aligned light and dark modes', () => {
    const profile = getBuiltInDesignProfile('base')

    expect(profile.id).toBe('base')
    expect(profile.modes.light.colors.background).toBe('#ffffff')
    expect(profile.modes.light.colors.primary).toBe('#18181b')
    expect(profile.modes.light.shape.radiusMd).toBe('8px')
    expect(profile.modes.light.effects.texture).toContain('linear-gradient')
    expect(profile.modes.dark.colors.background).not.toBe(profile.modes.light.colors.background)
    expect(profile.modes.dark.effects.cardShadow).toContain('rgba')
  })

  it('includes Cyberpunk with distinct neon light and dark modes', () => {
    const profile = getBuiltInDesignProfile('cyberpunk')

    expect(profile.id).toBe('cyberpunk')
    expect(profile.modes.dark.colors.primary).toBe('#00ff88')
    expect(profile.modes.dark.effects.texture).toContain('repeating-linear-gradient')
    expect(profile.modes.light.colors.primary).toBe('#006a7a')
    expect(profile.modes.light.colors.background).not.toBe(profile.modes.dark.colors.background)
  })

  it('includes Newsprint with editorial light and dark modes', () => {
    const profile = getBuiltInDesignProfile('newsprint')

    expect(profile.id).toBe('newsprint')
    expect(profile.modes.light.shape.radiusMd).toBe('0px')
    expect(profile.modes.light.colors.primary).toBe('#111111')
    expect(profile.modes.light.colors.accent).toBe('#cc0000')
    expect(profile.modes.dark.colors.background).not.toBe(profile.modes.light.colors.background)
    expect(profile.modes.dark.effects.texture).toContain('radial-gradient')
  })
})
