import type { DesignProfileId } from '@super-admin-org/core'
import { createAuthRecipeRegistry, resolveAuthRecipeRegistration, type AuthRecipeRegistration } from './auth-recipe-registry'
import NeutralAuthRecipe from './recipes/NeutralAuthRecipe.vue'
// @starter-auth-recipe-imports:start
import BaseAuthRecipe from './recipes/BaseAuthRecipe.vue'
import CryptoAuthRecipe from './recipes/CryptoAuthRecipe.vue'
import IndustrialAuthRecipe from './recipes/IndustrialAuthRecipe.vue'
import CyberpunkAuthRecipe from './recipes/CyberpunkAuthRecipe.vue'
import NewsprintAuthRecipe from './recipes/NewsprintAuthRecipe.vue'
// @starter-auth-recipe-imports:end

export const neutralAuthRecipeRegistration = createAuthRecipeRegistry([{ component: NeutralAuthRecipe, profileId: 'neutral' }])[0]

// @starter-auth-recipe-registrations:start
export const authRecipeRegistry = createAuthRecipeRegistry([
  { component: BaseAuthRecipe, profileId: 'base' },
  { component: CryptoAuthRecipe, profileId: 'crypto' },
  { component: IndustrialAuthRecipe, profileId: 'industrial' },
  { component: CyberpunkAuthRecipe, profileId: 'cyberpunk' },
  { component: NewsprintAuthRecipe, profileId: 'newsprint' }
])
// @starter-auth-recipe-registrations:end

export function resolveAuthRecipe(profileId: DesignProfileId): AuthRecipeRegistration {
  return resolveAuthRecipeRegistration(profileId, authRecipeRegistry, neutralAuthRecipeRegistration)
}
