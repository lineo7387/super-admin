import { describe, expect, it } from 'vitest'
import loginPageSource from './LoginPage.vue?raw'

describe('login redirect handling', () => {
  it('returns to the guarded route after a successful login', () => {
    expect(loginPageSource).toContain("import { useRoute, useRouter } from 'vue-router'")
    expect(loginPageSource).toContain("import { resolvePostLoginPath } from '@/router/auth-guard'")
    expect(loginPageSource).toContain('route.query.redirect')
    expect(loginPageSource).toContain('resolvePostLoginPath')
  })
})
