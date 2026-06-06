import { describe, expect, it } from 'vitest'
import shellAccountMenuSource from './ShellAccountMenu.vue?raw'

describe('shell account menu', () => {
  it('keeps account actions personal and leaves workspace controls outside the avatar menu', () => {
    expect(shellAccountMenuSource).toContain("import { useAuthSessionStore } from '@/stores/auth-session.store'")
    expect(shellAccountMenuSource).toContain('currentUser')
    expect(shellAccountMenuSource).toContain('clearSession')
    expect(shellAccountMenuSource).toContain('shell.account.profileSettings')
    expect(shellAccountMenuSource).toContain('shell.account.shortcuts')
    expect(shellAccountMenuSource).toContain('shell.account.signOut')
    expect(shellAccountMenuSource).not.toContain('shell.account.controlCenter')
    expect(shellAccountMenuSource).not.toContain('preferences.openControlCenter')
    expect(shellAccountMenuSource).not.toContain('preferences.openStageManager')
  })

  it('opens a read-only shortcuts viewer instead of opening Stage Manager directly', () => {
    expect(shellAccountMenuSource).toContain('shortcutsPanelOpen')
    expect(shellAccountMenuSource).toContain('shell.shortcuts.title')
    expect(shellAccountMenuSource).toContain('shell.shortcuts.readOnly')
    expect(shellAccountMenuSource).toContain('shell.shortcuts.stageManager')
    expect(shellAccountMenuSource).toContain('Cmd/Ctrl + Shift + M')
    expect(shellAccountMenuSource).toContain('shell.shortcuts.controlCenter')
    expect(shellAccountMenuSource).toContain('shell.shortcuts.aiAssistant')
    expect(shellAccountMenuSource).toContain('shell.shortcuts.commandPalette')
    expect(shellAccountMenuSource).toContain('shell.shortcuts.unbound')
  })

  it('keeps the account menu light and closes it when clicking outside', () => {
    expect(shellAccountMenuSource).not.toContain('Home')
    expect(shellAccountMenuSource).not.toContain('RouterLink')
    expect(shellAccountMenuSource).toContain('menuRoot')
    expect(shellAccountMenuSource).toContain("window.addEventListener('pointerdown'")
    expect(shellAccountMenuSource).toContain("window.removeEventListener('pointerdown'")
  })
})
