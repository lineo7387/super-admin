import { describe, expect, it } from 'vitest'
import shellAccountMenuSource from './ShellAccountMenu.vue?raw'

describe('shell account menu', () => {
  it('centralizes session actions and workspace shortcuts inside one account popover', () => {
    expect(shellAccountMenuSource).toContain("import { useAuthSessionStore } from '@/stores/auth-session.store'")
    expect(shellAccountMenuSource).toContain('currentUser')
    expect(shellAccountMenuSource).toContain('clearSession')
    expect(shellAccountMenuSource).toContain('Control Center')
    expect(shellAccountMenuSource).toContain('Stage Manager')
    expect(shellAccountMenuSource).toContain('Shortcuts')
    expect(shellAccountMenuSource).toContain('Sign out')
  })

  it('keeps the account menu light and closes it when clicking outside', () => {
    expect(shellAccountMenuSource).not.toContain('Home')
    expect(shellAccountMenuSource).not.toContain('RouterLink')
    expect(shellAccountMenuSource).toContain('menuRoot')
    expect(shellAccountMenuSource).toContain("window.addEventListener('pointerdown'")
    expect(shellAccountMenuSource).toContain("window.removeEventListener('pointerdown'")
  })
})
