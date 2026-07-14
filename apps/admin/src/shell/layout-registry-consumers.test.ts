import { describe, expect, it } from 'vitest'
import appShellSource from './AppShell.vue?raw'
import globalPreferencesSource from './preferences/GlobalPreferences.vue?raw'
import layoutPresetPreviewSource from './preferences/LayoutPresetPreview.vue?raw'
import stageWindowPreviewSource from '@/workspace/StageWindowPreview.vue?raw'

describe('layout registry consumers', () => {
  it('resolves the app shell component through the registry', () => {
    expect(appShellSource).toContain('resolveAppLayoutRegistration')
    expect(appShellSource).not.toContain("preferences.layoutPreset === 'dual-column'")
    expect(appShellSource).not.toContain("preferences.layoutPreset === 'top-header'")
    expect(appShellSource).not.toContain("import DualColumnLayout from './layouts/DualColumnLayout.vue'")
  })

  it('drives Stage Manager chrome from registered presentation metadata', () => {
    expect(stageWindowPreviewSource).toContain('resolveAppLayoutRegistration')
    expect(stageWindowPreviewSource).toContain('layoutRegistration.preview.showDock')
    expect(stageWindowPreviewSource).toContain('layoutRegistration.preview.stage.gridTemplateColumns')
    expect(stageWindowPreviewSource).not.toContain("props.preview.layoutPreset === 'tri-column'")
    expect(stageWindowPreviewSource).not.toContain("props.preview.layoutPreset === 'top-header'")
  })

  it('renders Control Center choices from the same app registry', () => {
    expect(globalPreferencesSource).toContain('appLayoutRegistry')
    expect(globalPreferencesSource).toContain(':presentation="layout.preview"')
    expect(layoutPresetPreviewSource).toContain('props.presentation.compact.gridTemplateColumns')
    expect(globalPreferencesSource).not.toContain('builtInLayoutPresets')
    expect(globalPreferencesSource).not.toContain("layout.id === 'tri-column'")
    expect(globalPreferencesSource).not.toContain("layout.id === 'dual-column'")
  })
})
