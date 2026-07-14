import { describe, expect, it } from 'vitest'
import authLayoutSource from './AuthLayout.vue?raw'
import baseAuthRecipeSource from './recipes/BaseAuthRecipe.vue?raw'
import industrialAuthRecipeSource from './recipes/IndustrialAuthRecipe.vue?raw'
import newsprintAuthRecipeSource from './recipes/NewsprintAuthRecipe.vue?raw'
import globalPreferencesSource from '@/shell/preferences/GlobalPreferences.vue?raw'

describe('auth layout preferences entry', () => {
  it('orchestrates profile recipes through the generated registry', () => {
    expect(authLayoutSource).toContain('resolveAuthRecipe')
    expect(authLayoutSource).toContain('<component :is="activeRecipe.component"')
    expect(authLayoutSource).not.toContain("preferences.profileId === 'base'")
    expect(authLayoutSource).not.toContain("preferences.profileId === 'crypto'")
  })

  it('uses the shared global preferences popover instead of a separate auth appearance menu', () => {
    expect(authLayoutSource).toContain("import GlobalPreferences from '@/shell/preferences/GlobalPreferences.vue'")
    expect(authLayoutSource).toContain('<GlobalPreferences')
    expect(authLayoutSource).not.toContain('AuthAppearanceMenu')
  })

  it('mounts the auth preferences trigger once outside profile-specific branches', () => {
    const preferenceTriggerMatches = authLayoutSource.match(/<GlobalPreferences trigger="auth"/g) ?? []
    const firstPreferenceTriggerIndex = authLayoutSource.indexOf('<GlobalPreferences trigger="auth"')
    const recipeComponentIndex = authLayoutSource.indexOf('<component :is="activeRecipe.component"')

    expect(preferenceTriggerMatches).toHaveLength(1)
    expect(firstPreferenceTriggerIndex).toBeGreaterThan(-1)
    expect(recipeComponentIndex).toBeGreaterThan(-1)
    expect(firstPreferenceTriggerIndex).toBeLessThan(recipeComponentIndex)
  })

  it('aligns the auth preferences trigger to the auth layout container instead of the viewport edge', () => {
    expect(authLayoutSource).toContain('auth-preferences-slot')
    expect(globalPreferencesSource).not.toContain('fixed right-4 top-4 z-[70] max-w-[calc(100vw-2rem)]')
  })

  it('keeps Base as a dedicated high-fidelity recipe component', () => {
    expect(baseAuthRecipeSource).toContain('auth-base__workspace')
    expect(baseAuthRecipeSource).toContain('auth-panel--base')
    expect(baseAuthRecipeSource).toContain('<AuthRecipePanel')
  })

  it('keeps the industrial title inside the left control composition', () => {
    const titleIndex = industrialAuthRecipeSource.indexOf('{{ props.title }}')
    const railIndex = industrialAuthRecipeSource.indexOf('auth-industrial__rail')
    const formPanelIndex = industrialAuthRecipeSource.indexOf('auth-panel--industrial')

    expect(industrialAuthRecipeSource).toContain('auth-industrial__intro')
    expect(titleIndex).toBeGreaterThan(-1)
    expect(railIndex).toBeGreaterThan(-1)
    expect(formPanelIndex).toBeGreaterThan(-1)
    expect(titleIndex).toBeLessThan(railIndex)
    expect(titleIndex).toBeLessThan(formPanelIndex)
  })

  it('keeps Newsprint as a dedicated recipe instead of a generic fallback branch', () => {
    expect(newsprintAuthRecipeSource).toContain('auth-newsprint__masthead')
    expect(newsprintAuthRecipeSource).toContain('auth-panel--newsprint')
    expect(authLayoutSource).not.toContain('auth-newsprint')
  })
})
