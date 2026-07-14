<script setup lang="ts">
import { computed } from 'vue'
import GlobalPreferences from '@/shell/preferences/GlobalPreferences.vue'
import { usePreferencesStore } from '@/stores/preferences.store'
import { resolveAuthRecipe } from './auth-recipe-registry.generated'
import type { AuthRecipeProps } from './recipes/auth-recipe'

const props = defineProps<AuthRecipeProps>()
const preferences = usePreferencesStore()
const activeRecipe = computed(() => resolveAuthRecipe(preferences.profileId))
</script>

<template>
  <main class="auth-shell min-h-screen overflow-hidden bg-[var(--app-background)] text-[var(--foreground)]" :data-auth-profile="activeRecipe.profileId">
    <div class="auth-shell__texture absolute inset-0" aria-hidden="true" />
    <div class="auth-preferences-slot pointer-events-none absolute inset-x-0 top-4 z-[70] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex justify-end">
        <GlobalPreferences trigger="auth" class="pointer-events-auto" />
      </div>
    </div>

    <component :is="activeRecipe.component" v-bind="props">
      <slot />
    </component>
  </main>
</template>

<style scoped>
.auth-shell {
  position: relative;
}

.auth-shell__texture {
  background:
    radial-gradient(circle at 18% 18%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 28rem),
    linear-gradient(120deg, color-mix(in srgb, var(--surface-sunken) 72%, transparent), transparent), var(--texture);
  opacity: 0.86;
  pointer-events: none;
}
</style>
