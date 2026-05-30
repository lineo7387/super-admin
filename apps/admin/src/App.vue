<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { resolveColorMode } from '@super-admin/core'
import { applyDesignProfile, getBuiltInDesignProfile } from '@super-admin/theme'
import { usePreferencesStore } from './app/preferences.store'
import AppShell from './shell/AppShell.vue'

const preferences = usePreferencesStore()

const resolvedMode = computed(() => resolveColorMode(preferences.colorMode, preferences.systemMode))
const activeProfile = computed(() => getBuiltInDesignProfile(preferences.profileId))

function applyTheme(): void {
  applyDesignProfile(document.documentElement, activeProfile.value, resolvedMode.value, preferences.density)
}

onMounted(() => {
  preferences.bindSystemColorMode()
  applyTheme()
})

watch(
  () => [preferences.profileId, preferences.colorMode, preferences.systemMode, preferences.density] as const,
  () => applyTheme()
)
</script>

<template>
  <AppShell />
</template>
