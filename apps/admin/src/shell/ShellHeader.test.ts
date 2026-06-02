import { describe, expect, it } from 'vitest'
import shellHeaderSource from './ShellHeader.vue?raw'

describe('shell header session controls', () => {
  it('shows the current user and exposes a logout action from the shell', () => {
    expect(shellHeaderSource).toContain("import { useAuthSessionStore } from '@/stores/auth-session.store'")
    expect(shellHeaderSource).toContain('currentUser')
    expect(shellHeaderSource).toContain('clearSession')
    expect(shellHeaderSource).toContain('Sign out')
  })
})
