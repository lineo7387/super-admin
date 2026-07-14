import { describe, expect, it } from 'vitest'
import globalPreferencesSource from './preferences/GlobalPreferences.vue?raw'
import aiAssistantSource from './AiAssistantFloatingPanel.vue?raw'
import stageOverviewSource from '@/workspace/StageOverview.vue?raw'

describe('global surface focus contract', () => {
  it.each([
    ['Control Center', globalPreferencesSource],
    ['Stage Overview', stageOverviewSource],
    ['AI Assistant', aiAssistantSource]
  ])('%s opts into the shared open-focus behavior', (_name, source) => {
    expect(source).toContain('useOpenSurfaceFocus')
    expect(source).toContain('tabindex="-1"')
  })
})
