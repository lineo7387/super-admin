import { describe, expect, it } from 'vitest'
import { builtInDesignProfiles, getBuiltInDesignProfile } from './theme-registry.generated'

describe('generated theme registry', () => {
  it('composes all installed built-in theme packages for the maintainer app', () => {
    expect(builtInDesignProfiles.map((profile) => profile.id)).toEqual([
      'base',
      'crypto',
      'industrial',
      'cyberpunk',
      'newsprint'
    ])

    for (const profile of builtInDesignProfiles) {
      expect(profile.modes.light.id).toBe(`${profile.id}.light`)
      expect(profile.modes.dark.id).toBe(`${profile.id}.dark`)
    }
  })

  it('resolves selected profiles with a base fallback', () => {
    expect(getBuiltInDesignProfile('base').modes.light.colors.background).toBe('#ffffff')
    expect(getBuiltInDesignProfile('crypto').modes.dark.colors.primary).toBe('#f7931a')
    expect(getBuiltInDesignProfile('cyberpunk').modes.dark.colors.primary).toBe('#00ff88')
    expect(getBuiltInDesignProfile('industrial').modes.light.colors.primary).toBe('#2f5f73')
    expect(getBuiltInDesignProfile('newsprint').modes.light.colors.accent).toBe('#cc0000')
    expect(getBuiltInDesignProfile('missing-profile').id).toBe('base')
  })
})
