import { describe, expect, it } from 'vitest'
import loginPageSource from './LoginPage.vue?raw'
import registerPageSource from './RegisterPage.vue?raw'

describe('login redirect handling', () => {
  it('returns to the guarded route after a successful login', () => {
    expect(loginPageSource).toContain("import { useRoute, useRouter } from 'vue-router'")
    expect(loginPageSource).toContain("import { resolvePostLoginPath } from '@/router/auth-guard'")
    expect(loginPageSource).toContain('route.query.redirect')
    expect(loginPageSource).toContain('resolvePostLoginPath')
  })

  it('localizes required field markers on auth forms', () => {
    expect(loginPageSource).toContain(":required-label=\"t('validation.requiredLabel')\"")
    expect(registerPageSource).toContain(":required-label=\"t('validation.requiredLabel')\"")
  })
})
