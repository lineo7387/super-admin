import { describe, expect, it } from 'vitest'
import authLayoutSource from './AuthLayout.vue?raw'

describe('auth layout preferences entry', () => {
  it('uses the shared global preferences popover instead of a separate auth appearance menu', () => {
    expect(authLayoutSource).toContain("import GlobalPreferences from '@/shell/preferences/GlobalPreferences.vue'")
    expect(authLayoutSource).toContain('<GlobalPreferences')
    expect(authLayoutSource).not.toContain('AuthAppearanceMenu')
  })
})
