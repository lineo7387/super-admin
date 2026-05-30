import {
  defaultAiAvailability,
  mergeAppearanceState,
  type AiAvailability,
  type AppearanceState,
  type AppearanceStateInput,
  type ColorMode,
  type Density,
  type DesignProfileId,
  type LayoutPresetId,
  type ResolvedColorMode
} from '@super-admin/core'
import { defineStore } from 'pinia'
import { computed, reactive, shallowRef } from 'vue'

const STORAGE_KEY = 'super-admin:preferences'

function readStoredPreferences(): AppearanceStateInput {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return {}
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? (parsed as AppearanceStateInput) : {}
  } catch {
    return {}
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const state = reactive<AppearanceState>(mergeAppearanceState(readStoredPreferences()))
  const systemMode = shallowRef<ResolvedColorMode>('dark')
  const providerMode = shallowRef<'mock' | 'custom'>('mock')
  const aiAvailability = shallowRef<AiAvailability>(defaultAiAvailability)

  const profileId = computed(() => state.profileId)
  const colorMode = computed(() => state.colorMode)
  const density = computed(() => state.density)
  const layoutPreset = computed(() => state.layoutPreset)
  const workspaceTabs = computed(() => state.workspaceTabs)
  const stageManager = computed(() => state.stageManager)
  const summary = computed(
    () => `${state.profileId} / ${state.colorMode} / ${state.layoutPreset}`
  )

  function persist(): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function setProfile(profileId: DesignProfileId): void {
    state.profileId = profileId
    persist()
  }

  function setColorMode(colorMode: ColorMode): void {
    state.colorMode = colorMode
    persist()
  }

  function setDensity(density: Density): void {
    state.density = density
    persist()
  }

  function setLayoutPreset(layoutPreset: LayoutPresetId): void {
    state.layoutPreset = layoutPreset
    persist()
  }

  function setTabsEnabled(enabled: boolean): void {
    state.workspaceTabs.enabled = enabled
    persist()
  }

  function setStageManagerEnabled(enabled: boolean): void {
    state.stageManager.enabled = enabled
    persist()
  }

  function bindSystemColorMode(): void {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = (): void => {
      systemMode.value = query.matches ? 'dark' : 'light'
    }
    update()
    query.addEventListener('change', update)
  }

  return {
    providerMode,
    aiAvailability,
    systemMode,
    summary,
    profileId,
    colorMode,
    density,
    layoutPreset,
    workspaceTabs,
    stageManager,
    bindSystemColorMode,
    setColorMode,
    setDensity,
    setLayoutPreset,
    setProfile,
    setTabsEnabled,
    setStageManagerEnabled
  }
})
