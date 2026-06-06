<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { resolveColorMode } from '@super-admin/core'
import { applyDesignProfile } from '@super-admin/theme'
import { getBuiltInDesignProfile } from './super-admin/theme-registry.generated'
import { usePreferencesStore } from './stores/preferences.store'
import AppShell from './shell/AppShell.vue'

const preferences = usePreferencesStore()
const route = useRoute()

const resolvedMode = computed(() => resolveColorMode(preferences.colorMode, preferences.systemMode))
const activeProfile = computed(() => getBuiltInDesignProfile(preferences.profileId))
const isAuthLayout = computed(() => route.meta.authLayout === true)

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
  <RouterView v-if="isAuthLayout" />
  <AppShell v-else />
</template>
