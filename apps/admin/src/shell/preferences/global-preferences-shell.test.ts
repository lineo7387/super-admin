import { describe, expect, it } from 'vitest'
import appShellSource from '../AppShell.vue?raw'
import globalPreferencesSource from './GlobalPreferences.vue?raw'

describe('global preferences shell wiring', () => {
  it('mounts the control center modal once without a fixed app-shell trigger', () => {
    expect(appShellSource).toContain('<GlobalPreferences trigger="none" />')
    expect(globalPreferencesSource).toContain('preferences.controlCenterOpen')
    expect(globalPreferencesSource).not.toContain('fixed right-4 top-3')
  })
})
