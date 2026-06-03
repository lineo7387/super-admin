import type { ColorMode, Density, DesignProfileId } from './design-profile'
import type { LayoutPresetId } from './shell'
import type { WorkspaceTabCloseStrategy } from './workspace-tabs'

export type LocalePreference = 'zh-CN' | 'en-US'

export type WorkspaceTabPreferences = {
  enabled: boolean
  restorePinnedTabs: boolean
  closeStrategy: WorkspaceTabCloseStrategy
}

export type StageManagerPreferences = {
  enabled: boolean
}

export type AppearanceState = {
  profileId: DesignProfileId
  locale: LocalePreference
  colorMode: ColorMode
  density: Density
  layoutPreset: LayoutPresetId
  workspaceTabs: WorkspaceTabPreferences
  stageManager: StageManagerPreferences
}

export type AppearanceStateInput = Partial<Omit<AppearanceState, 'workspaceTabs' | 'stageManager'>> & {
  workspaceTabs?: Partial<WorkspaceTabPreferences>
  stageManager?: Partial<StageManagerPreferences>
}

export const defaultAppearanceState: AppearanceState = {
  profileId: 'crypto',
  locale: 'zh-CN',
  colorMode: 'dark',
  density: 'comfortable',
  layoutPreset: 'tri-column',
  workspaceTabs: {
    enabled: true,
    restorePinnedTabs: true,
    closeStrategy: 'activate-nearest'
  },
  stageManager: {
    enabled: true
  }
}

export function mergeAppearanceState(input: AppearanceStateInput): AppearanceState {
  return {
    ...defaultAppearanceState,
    ...input,
    workspaceTabs: {
      ...defaultAppearanceState.workspaceTabs,
      ...input.workspaceTabs
    },
    stageManager: {
      ...defaultAppearanceState.stageManager,
      ...input.stageManager
    }
  }
}
