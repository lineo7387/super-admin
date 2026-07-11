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
} from '@super-admin-org/core'
import { defineStore } from 'pinia'
import { computed, reactive, shallowRef } from 'vue'
import superAdminConfig from '../../super-admin.config'
import { DEFAULT_LOCALE, resolveLocale, setActiveLocale, type Locale } from '@/i18n'

const STORAGE_KEY = 'super-admin:preferences'
const STAGE_MANAGER_DESKTOP_QUERY = '(min-width: 1280px)'
const installedProfiles: DesignProfileId[] = [...superAdminConfig.themes.installed]
const defaultProfile = superAdminConfig.themes.default

export type StageTransitionRect = {
  height: number
  left: number
  top: number
  width: number
}

export type StageTransitionGhost = {
  id: number
  source: StageTransitionRect
  status: 'measuring' | 'animating'
  target: StageTransitionRect
  title: string
}

function toStageTransitionRect(rect: DOMRect): StageTransitionRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width
  }
}

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

function resolveProfileId(profileId: DesignProfileId | undefined): DesignProfileId {
  return profileId && installedProfiles.includes(profileId) ? profileId : defaultProfile
}

function createInitialAppearanceState(): AppearanceState {
  const state = mergeAppearanceState(readStoredPreferences())

  return {
    ...state,
    locale: resolveLocale(state.locale),
    profileId: resolveProfileId(state.profileId)
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const state = reactive<AppearanceState>(createInitialAppearanceState())
  const systemMode = shallowRef<ResolvedColorMode>('dark')
  const providerMode = shallowRef<'mock' | 'custom'>('mock')
  const aiAvailability = shallowRef<AiAvailability>(defaultAiAvailability)
  const controlCenterOpen = shallowRef(false)
  const stageOverviewOpen = shallowRef(false)
  const stageManagerDesktopAvailable = shallowRef(false)
  const stageTransitionGhost = shallowRef<StageTransitionGhost | null>(null)
  const aiAssistantOpen = shallowRef(false)
  const commandPaletteOpen = shallowRef(false)

  const profileId = computed(() => state.profileId)
  const locale = computed(() => state.locale)
  const colorMode = computed(() => state.colorMode)
  const density = computed(() => state.density)
  const layoutPreset = computed(() => state.layoutPreset)
  const workspaceTabs = computed(() => state.workspaceTabs)
  const stageManager = computed(() => state.stageManager)
  const summary = computed(() => `${state.profileId} / ${state.colorMode} / ${state.layoutPreset}`)

  function persist(): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  setActiveLocale(resolveLocale(state.locale ?? DEFAULT_LOCALE))

  function setProfile(profileId: DesignProfileId): void {
    state.profileId = resolveProfileId(profileId)
    persist()
  }

  function setLocale(locale: Locale): void {
    state.locale = resolveLocale(locale)
    setActiveLocale(state.locale)
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

  function setStageRailEnabled(enabled: boolean): void {
    state.stageManager.railEnabled = enabled
    persist()
  }

  function setStageManagerDesktopAvailable(available: boolean): void {
    stageManagerDesktopAvailable.value = available
    if (!available) {
      stageOverviewOpen.value = false
    }
  }

  function openControlCenter(): void {
    controlCenterOpen.value = true
  }

  function closeControlCenter(): void {
    controlCenterOpen.value = false
  }

  function openStageOverview(): void {
    if (!stageManagerDesktopAvailable.value) {
      return
    }

    controlCenterOpen.value = false
    stageOverviewOpen.value = true
  }

  function closeStageOverview(): void {
    stageOverviewOpen.value = false
  }

  function startStageTransition(sourceRect: DOMRect, title: string): void {
    const source = toStageTransitionRect(sourceRect)
    stageTransitionGhost.value = {
      id: Date.now(),
      source,
      status: 'measuring',
      target: source,
      title
    }
  }

  function finishStageTransition(targetRect: DOMRect): void {
    if (!stageTransitionGhost.value) {
      return
    }

    stageTransitionGhost.value = {
      ...stageTransitionGhost.value,
      status: 'animating',
      target: toStageTransitionRect(targetRect)
    }
  }

  function clearStageTransition(): void {
    stageTransitionGhost.value = null
  }

  function openAiAssistant(): void {
    aiAssistantOpen.value = true
  }

  function closeAiAssistant(): void {
    aiAssistantOpen.value = false
  }

  function openCommandPalette(): void {
    commandPaletteOpen.value = true
  }

  function closeCommandPalette(): void {
    commandPaletteOpen.value = false
  }

  function bindSystemColorMode(): void {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = (): void => {
      systemMode.value = query.matches ? 'dark' : 'light'
    }
    update()
    query.addEventListener('change', update)
  }

  function bindStageManagerDesktopAvailability(): void {
    const query = window.matchMedia(STAGE_MANAGER_DESKTOP_QUERY)
    const update = (): void => setStageManagerDesktopAvailable(query.matches)
    update()
    query.addEventListener('change', update)
  }

  return {
    providerMode,
    aiAvailability,
    aiAssistantOpen,
    closeAiAssistant,
    closeCommandPalette,
    closeControlCenter,
    closeStageOverview,
    clearStageTransition,
    controlCenterOpen,
    commandPaletteOpen,
    finishStageTransition,
    openControlCenter,
    openAiAssistant,
    openCommandPalette,
    openStageOverview,
    stageManagerDesktopAvailable,
    stageOverviewOpen,
    stageTransitionGhost,
    systemMode,
    summary,
    profileId,
    locale,
    colorMode,
    density,
    layoutPreset,
    workspaceTabs,
    stageManager,
    bindStageManagerDesktopAvailability,
    bindSystemColorMode,
    setColorMode,
    setDensity,
    setLayoutPreset,
    setLocale,
    setProfile,
    setStageManagerDesktopAvailable,
    setTabsEnabled,
    setStageRailEnabled,
    startStageTransition
  }
})
