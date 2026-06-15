import type { ColorMode, Density, DesignProfileId } from './design-profile'
import type { LayoutPresetId } from './shell'
import type { WorkspaceTabCloseStrategy } from './workspace-tabs'

export type LocalePreference = 'zh-CN' | 'en-US'

export type WorkspaceTabPreferences = {
  enabled: boolean
  restorePinnedTabs: boolean
  closeStrategy: WorkspaceTabCloseStrategy
}

export type StageManagerPresentationMode = 'side-dock' | 'all-windows'

export type StageManagerPreferences = {
  railEnabled: boolean
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
  stageManager?: Partial<StageManagerPreferences> & {
    enabled?: boolean
    presentationMode?: StageManagerPresentationMode
  }
}

export const defaultAppearanceState: AppearanceState = {
  profileId: 'base',
  locale: 'zh-CN',
  colorMode: 'light',
  density: 'comfortable',
  layoutPreset: 'tri-column',
  workspaceTabs: {
    enabled: true,
    restorePinnedTabs: true,
    closeStrategy: 'activate-nearest'
  },
  stageManager: {
    railEnabled: true
  }
}

function mergeStageManagerPreferences(input?: AppearanceStateInput['stageManager']): StageManagerPreferences {
  return {
    railEnabled: input?.railEnabled ?? input?.enabled ?? defaultAppearanceState.stageManager.railEnabled
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
    stageManager: mergeStageManagerPreferences(input.stageManager)
  }
}
