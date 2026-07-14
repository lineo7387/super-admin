import { describe, expect, it } from 'vitest'
import type { AuthRecipeRegistration } from './auth-recipe-registry'
import { createAuthRecipeRegistry, resolveAuthRecipeRegistration } from './auth-recipe-registry'
import BaseAuthRecipe from './recipes/BaseAuthRecipe.vue'
import NeutralAuthRecipe from './recipes/NeutralAuthRecipe.vue'

const baseRecipe: AuthRecipeRegistration = {
  component: BaseAuthRecipe,
  profileId: 'base'
}

const neutralRecipe: AuthRecipeRegistration = {
  component: NeutralAuthRecipe,
  profileId: 'neutral'
}

describe('auth recipe registry', () => {
  it('resolves a registered profile recipe', () => {
    const registry = createAuthRecipeRegistry([baseRecipe])

    expect(resolveAuthRecipeRegistration('base', registry, neutralRecipe)).toBe(baseRecipe)
  })

  it('uses an explicit neutral recipe for unknown profile IDs', () => {
    const registry = createAuthRecipeRegistry([baseRecipe])

    expect(resolveAuthRecipeRegistration('custom-profile', registry, neutralRecipe)).toBe(neutralRecipe)
  })

  it('rejects duplicate profile recipes', () => {
    expect(() => createAuthRecipeRegistry([baseRecipe, { ...baseRecipe }])).toThrow('Duplicate auth recipe profile id "base"')
  })
})
