import { describe, expect, it } from 'vitest'
import { builtInDesignProfiles } from './index'

describe('built-in design profiles', () => {
  it('provide light and dark modes for every profile', () => {
    for (const profile of builtInDesignProfiles) {
      expect(profile.modes.light.id).toBe(`${profile.id}.light`)
      expect(profile.modes.dark.id).toBe(`${profile.id}.dark`)
    }
  })
})
