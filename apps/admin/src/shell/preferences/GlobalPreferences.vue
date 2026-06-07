<script setup lang="ts">
import { Settings2, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  builtInLayoutPresets,
  type ColorMode,
  type Density,
  type DesignProfileId,
  type LayoutPresetId,
  type StageManagerPresentationMode
} from '@super-admin-org/core'
import { AdminButton, AdminScrollArea, StatusPill } from '@super-admin-org/ui'
import { builtInDesignProfiles } from '@/super-admin/theme-registry.generated'
import type { Locale } from '@/i18n'
import { usePreferencesStore } from '@/stores/preferences.store'

const props = withDefaults(
  defineProps<{
    trigger?: 'floating' | 'auth' | 'none'
  }>(),
  {
    trigger: 'floating'
  }
)

const preferences = usePreferencesStore()
const { t } = useI18n()

const modeOptions = computed<{ id: ColorMode; label: string; detail: string }[]>(() => [
  { id: 'light', label: t('shell.preferences.modes.light.label'), detail: t('shell.preferences.modes.light.detail') },
  { id: 'dark', label: t('shell.preferences.modes.dark.label'), detail: t('shell.preferences.modes.dark.detail') },
  { id: 'system', label: t('shell.preferences.modes.system.label'), detail: t('shell.preferences.modes.system.detail') }
])

const localeOptions = computed<{ id: Locale; label: string; detail: string }[]>(() => [
  { id: 'zh-CN', label: t('shell.preferences.locales.zhCN.label'), detail: t('shell.preferences.locales.zhCN.detail') },
  { id: 'en-US', label: t('shell.preferences.locales.enUS.label'), detail: t('shell.preferences.locales.enUS.detail') }
])

const densityOptions = computed<{ id: Density; label: string; detail: string }[]>(() => [
  { id: 'comfortable', label: t('shell.preferences.density.comfortable.label'), detail: t('shell.preferences.density.comfortable.detail') },
  { id: 'compact', label: t('shell.preferences.density.compact.label'), detail: t('shell.preferences.density.compact.detail') }
])

const stagePresentationOptions = computed<{ id: StageManagerPresentationMode; label: string; detail: string }[]>(() => [
  { id: 'side-dock', label: t('shell.preferences.stageModes.sideDock.label'), detail: t('shell.preferences.stageModes.sideDock.detail') },
  { id: 'all-windows', label: t('shell.preferences.stageModes.allWindows.label'), detail: t('shell.preferences.stageModes.allWindows.detail') }
])

const activeProfileName = computed(
  () => builtInDesignProfiles.find((profile) => profile.id === preferences.profileId)?.name ?? preferences.profileId
)
const activeModeName = computed(
  () => modeOptions.value.find((mode) => mode.id === preferences.colorMode)?.label ?? preferences.colorMode
)
const triggerTitle = computed(() =>
  props.trigger === 'auth'
    ? t('shell.preferences.open', { profile: activeProfileName.value, mode: activeModeName.value })
    : t('shell.preferences.title')
)
const triggerSize = computed(() => (props.trigger === 'auth' ? 'md' : 'icon'))
const showTrigger = computed(() => props.trigger !== 'none')
const triggerClass = computed(() =>
  props.trigger === 'auth'
    ? 'shadow-[var(--card-shadow)]'
    : 'shadow-[var(--panel-shadow)]'
)

function selectProfile(profileId: DesignProfileId): void {
  preferences.setProfile(profileId)
}

function selectMode(colorMode: ColorMode): void {
  preferences.setColorMode(colorMode)
}

function selectLocale(locale: Locale): void {
  preferences.setLocale(locale)
}

function selectLayout(layoutPreset: LayoutPresetId): void {
  preferences.setLayoutPreset(layoutPreset)
}

function selectDensity(density: Density): void {
  preferences.setDensity(density)
}

function selectStagePresentationMode(presentationMode: StageManagerPresentationMode): void {
  preferences.setStageManagerPresentationMode(presentationMode)
}

</script>

<template>
  <div>
    <AdminButton
      v-if="showTrigger"
      variant="secondary"
      :size="triggerSize"
      :class="triggerClass"
      :title="triggerTitle"
      @click="preferences.openControlCenter()"
    >
      <Settings2 class="size-4" />
      <span v-if="props.trigger === 'auth'" class="text-xs">
        {{ activeProfileName }} / {{ activeModeName }}
      </span>
    </AdminButton>

    <Teleport to="body">
      <div v-if="preferences.controlCenterOpen" class="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" @keydown.esc="preferences.closeControlCenter()">
        <section
          class="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--panel-shadow)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="control-center-title"
        >
          <header class="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--header-background)] p-5">
            <div>
              <div class="flex items-center gap-2">
                <StatusPill :label="t('shell.preferences.live')" />
                <span class="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{{ t('shell.preferences.title') }}</span>
              </div>
              <h2 id="control-center-title" class="mt-2 [font-family:var(--font-display)] text-2xl text-[var(--foreground)]">
                {{ t('shell.preferences.workspaceConfiguration', { profile: activeProfileName }) }}
              </h2>
              <p class="mt-1 text-sm text-[var(--muted-foreground)]">
                {{ t('shell.preferences.immediateUpdate') }}
              </p>
            </div>
            <AdminButton variant="ghost" size="icon" :title="t('shell.preferences.close')" @click="preferences.closeControlCenter()">
              <X class="size-4" />
            </AdminButton>
          </header>

          <AdminScrollArea class="max-h-[calc(88vh-92px)]" view-class="grid gap-5 p-5 md:grid-cols-[1fr_1.15fr]">
            <section class="grid gap-4">
              <div class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h3 class="[font-family:var(--font-display)] text-lg">{{ t('shell.preferences.themeProfile') }}</h3>
                    <p class="text-xs text-[var(--muted-foreground)]">{{ t('shell.preferences.themeProfileDescription') }}</p>
                  </div>
                  <StatusPill :label="activeProfileName" />
                </div>
                <div class="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    v-for="profile in builtInDesignProfiles"
                    :key="profile.id"
                    type="button"
                    class="rounded-[var(--radius-md)] border p-3 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                    :class="profile.id === preferences.profileId ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]'"
                    @click="selectProfile(profile.id)"
                  >
                    <div class="flex items-center gap-2">
                      <span class="size-3 rounded-full bg-[var(--primary)] shadow-[var(--glow)]" />
                      <span class="[font-family:var(--font-display)] text-base">{{ profile.name }}</span>
                    </div>
                    <p class="mt-2 line-clamp-2 text-xs text-[var(--muted-foreground)]">{{ profile.description }}</p>
                  </button>
                </div>
              </div>

              <div class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
                <h3 class="[font-family:var(--font-display)] text-lg">{{ t('shell.preferences.modeDensity') }}</h3>
                <div class="mt-4 grid gap-3">
                  <div>
                    <div class="flex items-center justify-between gap-3 pb-2">
                      <span class="text-sm">{{ t('shell.preferences.locale') }}</span>
                      <span class="text-[11px] text-[var(--muted-foreground)]">{{ t('shell.preferences.localeDescription') }}</span>
                    </div>
                    <div class="grid gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2 sm:grid-cols-2">
                      <button
                        v-for="localeOption in localeOptions"
                        :key="localeOption.id"
                        type="button"
                        class="rounded-[var(--radius-sm)] px-3 py-2 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                        :class="localeOption.id === preferences.locale ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--glow)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'"
                        @click="selectLocale(localeOption.id)"
                      >
                        <span class="block text-sm">{{ localeOption.label }}</span>
                        <span class="block text-[11px] opacity-75">{{ localeOption.detail }}</span>
                      </button>
                    </div>
                  </div>

                  <div class="grid gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2 sm:grid-cols-3">
                    <button
                      v-for="mode in modeOptions"
                      :key="mode.id"
                      type="button"
                      class="rounded-[var(--radius-sm)] px-3 py-2 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                      :class="mode.id === preferences.colorMode ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--glow)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'"
                      @click="selectMode(mode.id)"
                    >
                      <span class="block text-sm">{{ mode.label }}</span>
                      <span class="block text-[11px] opacity-75">{{ mode.detail }}</span>
                    </button>
                  </div>

                  <div class="grid gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2 sm:grid-cols-2">
                    <button
                      v-for="density in densityOptions"
                      :key="density.id"
                      type="button"
                      class="rounded-[var(--radius-sm)] px-3 py-2 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                      :class="density.id === preferences.density ? 'bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'"
                      @click="selectDensity(density.id)"
                    >
                      <span class="block text-sm">{{ density.label }}</span>
                      <span class="block text-[11px]">{{ density.detail }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="grid gap-4">
              <div class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
                <h3 class="[font-family:var(--font-display)] text-lg">{{ t('shell.preferences.layout') }}</h3>
                <p class="text-xs text-[var(--muted-foreground)]">{{ t('shell.preferences.layoutDescription') }}</p>
                <div class="mt-4 grid gap-3 xl:grid-cols-3">
                  <button
                    v-for="layout in builtInLayoutPresets"
                    :key="layout.id"
                    type="button"
                    class="rounded-[var(--radius-md)] border bg-[var(--surface)] p-3 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                    :class="layout.id === preferences.layoutPreset ? 'border-[var(--border-strong)] shadow-[var(--glow)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'"
                    @click="selectLayout(layout.id)"
                  >
                    <div class="grid h-24 gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-sunken)] p-2">
                      <template v-if="layout.id === 'tri-column'">
                        <div class="grid grid-cols-[0.35fr_0.8fr_1.8fr_0.9fr] gap-1">
                          <span class="rounded-[var(--radius-xs)] bg-[var(--primary)]" />
                          <span class="rounded-[var(--radius-xs)] bg-[var(--surface-raised)]" />
                          <span class="rounded-[var(--radius-xs)] bg-[var(--accent)] opacity-60" />
                          <span class="rounded-[var(--radius-xs)] bg-[var(--surface-raised)]" />
                        </div>
                      </template>
                      <template v-else-if="layout.id === 'dual-column'">
                        <div class="grid grid-cols-[1fr_2fr] gap-1">
                          <span class="rounded-[var(--radius-xs)] bg-[var(--surface-raised)]" />
                          <span class="rounded-[var(--radius-xs)] bg-[var(--accent)] opacity-60" />
                        </div>
                      </template>
                      <template v-else>
                        <div class="grid grid-rows-[0.45fr_0.55fr_2fr] gap-1">
                          <span class="rounded-[var(--radius-xs)] bg-[var(--primary)]" />
                          <span class="rounded-[var(--radius-xs)] bg-[var(--surface-raised)]" />
                          <span class="rounded-[var(--radius-xs)] bg-[var(--accent)] opacity-60" />
                        </div>
                      </template>
                    </div>
                    <div class="mt-3 [font-family:var(--font-display)] text-base">{{ layout.name }}</div>
                    <p class="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">{{ layout.description }}</p>
                  </button>
                </div>
              </div>

              <div class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h3 class="[font-family:var(--font-display)] text-lg">{{ t('shell.preferences.workspace') }}</h3>
                    <p class="text-xs text-[var(--muted-foreground)]">{{ t('shell.preferences.workspaceDescription') }}</p>
                  </div>
                  <StatusPill :label="t('shell.preferences.keepAlive')" tone="success" />
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    class="rounded-[var(--radius-md)] border p-3 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                    :class="preferences.workspaceTabs.enabled ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]'"
                    @click="preferences.setTabsEnabled(!preferences.workspaceTabs.enabled)"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span class="text-sm">{{ t('shell.preferences.workspaceTabs') }}</span>
                      <span class="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px]">
                        {{ preferences.workspaceTabs.enabled ? t('shell.preferences.on') : t('shell.preferences.off') }}
                      </span>
                    </span>
                    <span class="mt-2 block text-[11px] opacity-75">{{ t('shell.preferences.tabsDescription') }}</span>
                  </button>

                  <button
                    type="button"
                    class="rounded-[var(--radius-md)] border p-3 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                    :class="preferences.stageManager.enabled ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]'"
                    @click="preferences.setStageManagerEnabled(!preferences.stageManager.enabled)"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span class="text-sm">{{ t('shell.preferences.stageManagerShortcut') }}</span>
                      <span class="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px]">
                        {{ preferences.stageManager.enabled ? t('shell.preferences.on') : t('shell.preferences.off') }}
                      </span>
                    </span>
                    <span class="mt-2 block text-[11px] opacity-75">{{ t('shell.preferences.stageDescription') }}</span>
                  </button>

                </div>

                <div class="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div class="flex items-center justify-between gap-3 pb-2">
                    <span class="text-sm">{{ t('shell.preferences.stagePresentationMode') }}</span>
                    <span class="text-[11px] text-[var(--muted-foreground)]">{{ t('shell.preferences.stagePresentationDescription') }}</span>
                  </div>
                  <div class="grid gap-2 sm:grid-cols-2">
                    <button
                      v-for="stageMode in stagePresentationOptions"
                      :key="stageMode.id"
                      type="button"
                      class="rounded-[var(--radius-sm)] px-3 py-2 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                      :class="stageMode.id === preferences.stageManager.presentationMode ? 'bg-[var(--active-tab-background)] text-[var(--foreground)] shadow-[var(--glow)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'"
                      @click="selectStagePresentationMode(stageMode.id)"
                    >
                      <span class="block text-sm">{{ stageMode.label }}</span>
                      <span class="block text-[11px] opacity-75">{{ stageMode.detail }}</span>
                    </button>
                  </div>
                </div>

                <div class="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm">{{ t('shell.preferences.aiProvider') }}</span>
                    <StatusPill :label="t('shell.preferences.providerUnavailable')" tone="warning" />
                  </div>
                  <p class="mt-2 text-xs text-[var(--muted-foreground)]">
                    {{ t('shell.preferences.providerDescription') }}
                  </p>
                </div>
              </div>
            </section>
          </AdminScrollArea>
        </section>
      </div>
    </Teleport>
  </div>
</template>
