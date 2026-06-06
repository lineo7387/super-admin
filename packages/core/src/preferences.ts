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
  enabled: boolean
  presentationMode: StageManagerPresentationMode
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
    enabled: true,
    presentationMode: 'side-dock'
  }
}

function mergeStageManagerPreferences(input?: Partial<StageManagerPreferences>): StageManagerPreferences {
  return {
    enabled: input?.enabled ?? defaultAppearanceState.stageManager.enabled,
    presentationMode: input?.presentationMode ?? defaultAppearanceState.stageManager.presentationMode
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
