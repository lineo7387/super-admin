<script setup lang="ts">
import { Settings2, X } from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
import {
  builtInLayoutPresets,
  type ColorMode,
  type Density,
  type DesignProfileId,
  type LayoutPresetId
} from '@super-admin/core'
import { builtInDesignProfiles } from '@super-admin/theme'
import { AdminButton, AdminScrollArea, StatusPill } from '@super-admin/ui'
import { usePreferencesStore } from '@/stores/preferences.store'

const props = withDefaults(
  defineProps<{
    trigger?: 'floating' | 'auth'
  }>(),
  {
    trigger: 'floating'
  }
)

const preferences = usePreferencesStore()
const open = shallowRef(false)

const modeOptions: { id: ColorMode; label: string; detail: string }[] = [
  { id: 'light', label: 'Light', detail: 'Bright operations surface' },
  { id: 'dark', label: 'Dark', detail: 'Signal-first control room' },
  { id: 'system', label: 'System', detail: 'Follow OS preference' }
]

const densityOptions: { id: Density; label: string; detail: string }[] = [
  { id: 'comfortable', label: 'Comfortable', detail: 'Room for scanning' },
  { id: 'compact', label: 'Compact', detail: 'Dense operator mode' }
]

const activeProfileName = computed(
  () => builtInDesignProfiles.find((profile) => profile.id === preferences.profileId)?.name ?? preferences.profileId
)
const activeModeName = computed(
  () => modeOptions.find((mode) => mode.id === preferences.colorMode)?.label ?? preferences.colorMode
)
const triggerTitle = computed(() =>
  props.trigger === 'auth' ? `Open Control Center: ${activeProfileName.value} / ${activeModeName.value}` : 'Control Center'
)
const triggerSize = computed(() => (props.trigger === 'auth' ? 'md' : 'icon'))
const triggerClass = computed(() =>
  props.trigger === 'auth'
    ? 'fixed right-4 top-4 z-[70] max-w-[calc(100vw-2rem)] shadow-[var(--card-shadow)] sm:right-6 sm:top-5'
    : 'fixed right-4 top-3 z-[70] shadow-[var(--panel-shadow)]'
)

function selectProfile(profileId: DesignProfileId): void {
  preferences.setProfile(profileId)
}

function selectMode(colorMode: ColorMode): void {
  preferences.setColorMode(colorMode)
}

function selectLayout(layoutPreset: LayoutPresetId): void {
  preferences.setLayoutPreset(layoutPreset)
}

function selectDensity(density: Density): void {
  preferences.setDensity(density)
}

</script>

<template>
  <div>
    <AdminButton
      variant="secondary"
      :size="triggerSize"
      :class="triggerClass"
      :title="triggerTitle"
      @click="open = true"
    >
      <Settings2 class="size-4" />
      <span v-if="props.trigger === 'auth'" class="text-xs">
        {{ activeProfileName }} / {{ activeModeName }}
      </span>
    </AdminButton>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" @keydown.esc="open = false">
        <section
          class="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--panel-shadow)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="control-center-title"
        >
          <header class="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--header-background)] p-5">
            <div>
              <div class="flex items-center gap-2">
                <StatusPill label="Live" />
                <span class="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Control Center</span>
              </div>
              <h2 id="control-center-title" class="mt-2 [font-family:var(--font-display)] text-2xl text-[var(--foreground)]">
                {{ activeProfileName }} workspace configuration
              </h2>
              <p class="mt-1 text-sm text-[var(--muted-foreground)]">
                Theme, layout, density, tabs, and Stage Manager update immediately.
              </p>
            </div>
            <AdminButton variant="ghost" size="icon" title="Close Control Center" @click="open = false">
              <X class="size-4" />
            </AdminButton>
          </header>

          <AdminScrollArea class="max-h-[calc(88vh-92px)]" view-class="grid gap-5 p-5 md:grid-cols-[1fr_1.15fr]">
            <section class="grid gap-4">
              <div class="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-sunken)] p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <h3 class="[font-family:var(--font-display)] text-lg">Theme Profile</h3>
                    <p class="text-xs text-[var(--muted-foreground)]">Switch between installed design recipes.</p>
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
                <h3 class="[font-family:var(--font-display)] text-lg">Mode & Density</h3>
                <div class="mt-4 grid gap-3">
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
                <h3 class="[font-family:var(--font-display)] text-lg">Layout</h3>
                <p class="text-xs text-[var(--muted-foreground)]">Layout presets stay independent from workspace tools.</p>
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
                    <h3 class="[font-family:var(--font-display)] text-lg">Workspace</h3>
                    <p class="text-xs text-[var(--muted-foreground)]">Tabs and Stage Manager can be enabled together.</p>
                  </div>
                  <StatusPill label="Keep-alive" tone="success" />
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    class="rounded-[var(--radius-md)] border p-3 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                    :class="preferences.workspaceTabs.enabled ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]'"
                    @click="preferences.setTabsEnabled(!preferences.workspaceTabs.enabled)"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span class="text-sm">Workspace Tabs</span>
                      <span class="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px]">
                        {{ preferences.workspaceTabs.enabled ? 'On' : 'Off' }}
                      </span>
                    </span>
                    <span class="mt-2 block text-[11px] opacity-75">Persistent horizontal route tabs.</span>
                  </button>

                  <button
                    type="button"
                    class="rounded-[var(--radius-md)] border p-3 text-left transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                    :class="preferences.stageManager.enabled ? 'border-[var(--border-strong)] bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]'"
                    @click="preferences.setStageManagerEnabled(!preferences.stageManager.enabled)"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span class="text-sm">Stage Manager Button</span>
                      <span class="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px]">
                        {{ preferences.stageManager.enabled ? 'On' : 'Off' }}
                      </span>
                    </span>
                    <span class="mt-2 block text-[11px] opacity-75">macOS-style overview layer for open workspaces.</span>
                  </button>
                </div>

                <div class="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm">AI provider</span>
                    <StatusPill label="Unavailable" tone="warning" />
                  </div>
                  <p class="mt-2 text-xs text-[var(--muted-foreground)]">
                    Provider interfaces are typed, but no provider is attached by default.
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
