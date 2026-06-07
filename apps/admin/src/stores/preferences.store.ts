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
  type ResolvedColorMode,
  type StageManagerPresentationMode
} from '@super-admin-org/core'
import { defineStore } from 'pinia'
import { computed, reactive, shallowRef } from 'vue'
import { DEFAULT_LOCALE, setActiveLocale, type Locale } from '@/i18n'

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
  const controlCenterOpen = shallowRef(false)
  const stageManagerOpen = shallowRef(false)
  const aiAssistantOpen = shallowRef(false)

  const profileId = computed(() => state.profileId)
  const locale = computed(() => state.locale)
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

  setActiveLocale(state.locale ?? DEFAULT_LOCALE)

  function setProfile(profileId: DesignProfileId): void {
    state.profileId = profileId
    persist()
  }

  function setLocale(locale: Locale): void {
    state.locale = locale
    setActiveLocale(locale)
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
    if (!enabled) {
      stageManagerOpen.value = false
    }
    persist()
  }

  function setStageManagerPresentationMode(presentationMode: StageManagerPresentationMode): void {
    state.stageManager.presentationMode = presentationMode
    persist()
  }

  function openControlCenter(): void {
    controlCenterOpen.value = true
  }

  function closeControlCenter(): void {
    controlCenterOpen.value = false
  }

  function openStageManager(): void {
    if (!state.stageManager.enabled) {
      return
    }

    stageManagerOpen.value = true
  }

  function closeStageManager(): void {
    stageManagerOpen.value = false
  }

  function openAiAssistant(): void {
    aiAssistantOpen.value = true
  }

  function closeAiAssistant(): void {
    aiAssistantOpen.value = false
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
    aiAssistantOpen,
    closeAiAssistant,
    closeControlCenter,
    closeStageManager,
    controlCenterOpen,
    openControlCenter,
    openAiAssistant,
    openStageManager,
    stageManagerOpen,
    systemMode,
    summary,
    profileId,
    locale,
    colorMode,
    density,
    layoutPreset,
    workspaceTabs,
    stageManager,
    bindSystemColorMode,
    setColorMode,
    setDensity,
    setLayoutPreset,
    setLocale,
    setProfile,
    setStageManagerPresentationMode,
    setTabsEnabled,
    setStageManagerEnabled
  }
})
