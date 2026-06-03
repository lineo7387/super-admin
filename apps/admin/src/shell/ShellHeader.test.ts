import { describe, expect, it } from 'vitest'
import shellHeaderSource from './ShellHeader.vue?raw'

describe('shell header session controls', () => {
  it('keeps account actions out of the base header chrome', () => {
    expect(shellHeaderSource).not.toContain("import { useAuthSessionStore } from '@/stores/auth-session.store'")
    expect(shellHeaderSource).not.toContain('clearSession')
    expect(shellHeaderSource).not.toContain('Sign out')
    expect(shellHeaderSource).not.toContain('Activity')
  })

  it('exposes an actions slot for layouts that need header-right controls', () => {
    expect(shellHeaderSource).toContain('<slot name="actions" />')
  })
})
