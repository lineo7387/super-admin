import { describe, expect, it } from 'vitest'
import appShellSource from '../AppShell.vue?raw'
import aiAssistantSource from '../AiAssistantFloatingPanel.vue?raw'
import globalPreferencesSource from './GlobalPreferences.vue?raw'

describe('global preferences shell wiring', () => {
  it('mounts the control center modal once with a fixed right-side app-shell trigger', () => {
    expect(appShellSource).toContain('<GlobalPreferences trigger="none" />')
    expect(appShellSource).toContain('openControlCenter')
    expect(appShellSource).toContain('Settings2')
    expect(appShellSource).toContain('fixed right-4 top-1/2')
    expect(globalPreferencesSource).toContain('preferences.controlCenterOpen')
    expect(globalPreferencesSource).toContain('preferences.setLocale')
    expect(globalPreferencesSource).toContain('shell.preferences.locale')
    expect(globalPreferencesSource).toContain('shell.preferences.displayMode')
    expect(globalPreferencesSource).not.toContain('shell.preferences.modeDensity')
    expect(globalPreferencesSource).toContain('preferences.setStageManagerPresentationMode')
    expect(globalPreferencesSource).toContain('shell.preferences.stagePresentationMode')
    expect(globalPreferencesSource).toContain('shell.preferences.stageModes.sideDock')
    expect(globalPreferencesSource).toContain('shell.preferences.stageModes.allWindows')
    expect(globalPreferencesSource).toContain('data-layout-preview')
    expect(globalPreferencesSource).not.toContain('densityOptions')
    expect(globalPreferencesSource).not.toContain('selectDensity')
    expect(globalPreferencesSource).not.toContain('shell.preferences.density')
    expect(globalPreferencesSource).not.toContain('preferences.setDensity')
    expect(globalPreferencesSource).not.toContain('setStageManagerScrollOverflow')
    expect(globalPreferencesSource).not.toContain('stageManagerScroll')
    expect(globalPreferencesSource).not.toContain('stageScrollDescription')
    expect(globalPreferencesSource).not.toContain('fixed right-4 top-3')
  })

  it('mounts AI assistance as a floating panel instead of a permanent context rail', () => {
    expect(appShellSource).not.toContain('ContextPanelHost')
    expect(appShellSource).toContain('<AiAssistantFloatingPanel />')
    expect(aiAssistantSource).toContain('preferences.aiAssistantOpen')
    expect(aiAssistantSource).toContain('shell.assistant.title')
    expect(aiAssistantSource).toContain('shell.assistant.provider')
    expect(aiAssistantSource).toContain('shell.assistant.providerConnected')
    expect(aiAssistantSource).toContain('shell.assistant.providerUnavailableMessage')
    expect(aiAssistantSource).toContain('translateRouteTitle(t, route.path')
    expect(aiAssistantSource).toContain('translateRouteDescription(t, route.path')
  })
})
