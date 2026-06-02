<script setup lang="ts">
import { Moon, Palette, Sun } from 'lucide-vue-next'
import { computed } from 'vue'
import { type ColorMode, type DesignProfileId } from '@super-admin/core'
import { builtInDesignProfiles } from '@super-admin/theme'
import { AdminButton, StatusPill } from '@super-admin/ui'
import { usePreferencesStore } from '@/stores/preferences.store'

const preferences = usePreferencesStore()

const activeProfileName = computed(
  () => builtInDesignProfiles.find((profile) => profile.id === preferences.profileId)?.name ?? preferences.profileId
)

const modeOptions: { id: ColorMode; label: string }[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'system', label: 'System' }
]

function selectProfile(profileId: DesignProfileId): void {
  preferences.setProfile(profileId)
}

function selectMode(mode: ColorMode): void {
  preferences.setColorMode(mode)
}
</script>

<template>
  <section class="auth-appearance" aria-label="Appearance">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <Palette class="size-4 text-[var(--primary)]" />
        <span class="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Appearance</span>
      </div>
      <StatusPill :label="activeProfileName" />
    </div>

    <div class="mt-3 grid gap-2">
      <div class="grid grid-cols-3 gap-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-1">
        <button
          v-for="profile in builtInDesignProfiles"
          :key="profile.id"
          type="button"
          class="h-8 rounded-[var(--radius-sm)] px-2 text-xs transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
          :class="profile.id === preferences.profileId ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--glow)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'"
          @click="selectProfile(profile.id)"
        >
          {{ profile.name }}
        </button>
      </div>

      <div class="grid grid-cols-3 gap-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-1">
        <button
          v-for="mode in modeOptions"
          :key="mode.id"
          type="button"
          class="inline-flex h-8 items-center justify-center gap-1 rounded-[var(--radius-sm)] px-2 text-xs transition focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
          :class="mode.id === preferences.colorMode ? 'bg-[var(--active-tab-background)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]'"
          @click="selectMode(mode.id)"
        >
          <Sun v-if="mode.id === 'light'" class="size-3" />
          <Moon v-else-if="mode.id === 'dark'" class="size-3" />
          <span>{{ mode.label }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-appearance {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--surface-raised) 84%, transparent)),
    var(--texture);
  box-shadow: var(--card-shadow);
  padding: 0.85rem;
}
</style>
