import { describe, expect, it } from 'vitest'
import { authRecipeRegistry, neutralAuthRecipeRegistration, resolveAuthRecipe } from './auth-recipe-registry.generated'

describe('generated auth recipe registry', () => {
  it('registers every installed maintainer profile recipe', () => {
    expect(authRecipeRegistry.map((registration) => registration.profileId)).toEqual(['base', 'crypto', 'industrial', 'cyberpunk', 'newsprint'])
  })

  it('resolves unknown profiles to the explicit neutral recipe', () => {
    expect(resolveAuthRecipe('crypto').profileId).toBe('crypto')
    expect(resolveAuthRecipe('custom-profile')).toBe(neutralAuthRecipeRegistration)
    expect(neutralAuthRecipeRegistration.profileId).toBe('neutral')
  })
})
