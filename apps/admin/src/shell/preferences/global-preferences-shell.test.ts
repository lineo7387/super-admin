import { describe, expect, it } from 'vitest'
import appShellSource from '../AppShell.vue?raw'
import aiAssistantSource from '../AiAssistantFloatingPanel.vue?raw'
import globalPreferencesSource from './GlobalPreferences.vue?raw'

describe('global preferences shell wiring', () => {
  it('mounts the control center modal once without a fixed app-shell trigger', () => {
    expect(appShellSource).toContain('<GlobalPreferences trigger="none" />')
    expect(globalPreferencesSource).toContain('preferences.controlCenterOpen')
    expect(globalPreferencesSource).toContain('preferences.setLocale')
    expect(globalPreferencesSource).toContain('shell.preferences.locale')
    expect(globalPreferencesSource).not.toContain('fixed right-4 top-3')
  })

  it('mounts AI assistance as a floating panel instead of a permanent context rail', () => {
    expect(appShellSource).not.toContain('ContextPanelHost')
    expect(appShellSource).toContain('<AiAssistantFloatingPanel />')
    expect(aiAssistantSource).toContain('preferences.aiAssistantOpen')
    expect(aiAssistantSource).toContain('shell.assistant.title')
    expect(aiAssistantSource).toContain('shell.assistant.provider')
  })
})
