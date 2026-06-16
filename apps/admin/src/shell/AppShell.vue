<script setup lang="ts">
import { Settings2 } from '@lucide/vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdminButton } from '@super-admin-org/ui'
import { usePreferencesStore } from '@/stores/preferences.store'
import { translateRouteTitle } from '@/i18n/navigation'
import StageOverview from '@/workspace/StageOverview.vue'
import StageRail from '@/workspace/StageRail.vue'
import StageTransitionGhost from '@/workspace/StageTransitionGhost.vue'
import WorkspaceRouterView from '@/workspace/WorkspaceRouterView.vue'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'
import AiAssistantFloatingPanel from './AiAssistantFloatingPanel.vue'
import DualColumnLayout from './layouts/DualColumnLayout.vue'
import TopHeaderLayout from './layouts/TopHeaderLayout.vue'
import TriColumnLayout from './layouts/TriColumnLayout.vue'
import GlobalPreferences from './preferences/GlobalPreferences.vue'
import { useShellShortcuts } from './shell-shortcuts'

const route = useRoute()
const { t } = useI18n()
const preferences = usePreferencesStore()
const tabs = useWorkspaceTabsStore()

useShellShortcuts()

const activeLayout = computed(() => {
  if (preferences.layoutPreset === 'dual-column') {
    return DualColumnLayout
  }
  if (preferences.layoutPreset === 'top-header') {
    return TopHeaderLayout
  }
  return TriColumnLayout
})
const showStageRail = computed(
  () => preferences.stageManagerDesktopAvailable && preferences.stageManager.railEnabled && tabs.state.tabs.length > 1
)

function openControlCenter(): void {
  preferences.openControlCenter()
}

watch(
  () => route.fullPath,
  () => {
    if (!route.name || !route.meta.title) {
      return
    }

    tabs.openTab({
      title: translateRouteTitle(t, route.path, route.meta.workspaceTitle ?? route.meta.title),
      routePath: route.fullPath,
      keepAlive: route.meta.keepAlive ?? { enabled: true }
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="stage-shell-frame" :data-stage-rail-open="showStageRail">
    <Transition name="stage-rail-shell">
      <StageRail v-if="showStageRail" />
    </Transition>
    <div class="stage-shell-frame__app">
      <component :is="activeLayout">
        <template #workspace>
          <WorkspaceRouterView />
        </template>
      </component>
    </div>
  </div>
  <AdminButton
    variant="secondary"
    size="sm"
    class="control-center-trigger fixed right-4 top-4 z-[64] shadow-[var(--panel-shadow)]"
    :title="t('shell.preferences.title')"
    @click="openControlCenter"
  >
    <span class="control-center-trigger__icon" aria-hidden="true">
      <Settings2 class="size-4" />
    </span>
    <span class="control-center-trigger__label">{{ t('shell.preferences.title') }}</span>
  </AdminButton>
  <AiAssistantFloatingPanel />
  <StageOverview />
  <StageTransitionGhost />
  <GlobalPreferences trigger="none" />
</template>

<style scoped>
.stage-shell-frame {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1fr);
  background: var(--app-background);
  transition: grid-template-columns 300ms var(--easing);
}

.stage-shell-frame[data-stage-rail-open="true"] {
  grid-template-columns: 14rem minmax(0, 1fr);
}

.stage-shell-frame__app {
  min-width: 0;
}

.stage-rail-shell-enter-active,
.stage-rail-shell-leave-active {
  transition:
    opacity 300ms var(--easing),
    transform 300ms var(--easing);
}

.stage-rail-shell-enter-from,
.stage-rail-shell-leave-to {
  opacity: 0;
  transform: translateX(-0.75rem);
}

.control-center-trigger {
  position: fixed;
  isolation: isolate;
  overflow: hidden;
  gap: 0.48rem;
  border-color: color-mix(in srgb, var(--primary) 34%, var(--border-strong));
  border-radius: var(--radius-md);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--primary) 13%, transparent), transparent 48%),
    var(--texture),
    color-mix(in srgb, var(--surface-raised) 88%, var(--surface));
  box-shadow: var(--panel-shadow), var(--glow);
  color: var(--foreground);
  transition:
    border-color 180ms var(--easing),
    box-shadow 180ms var(--easing),
    transform 180ms var(--easing);
}

.control-center-trigger::before {
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(
    110deg,
    transparent 0%,
    color-mix(in srgb, var(--primary) 18%, transparent) 42%,
    color-mix(in srgb, var(--foreground) 12%, transparent) 50%,
    transparent 66%
  );
  content: '';
  opacity: 0;
  transform: translateX(-120%);
  animation: control-center-surface-sweep 900ms var(--easing) 420ms both;
}

.control-center-trigger:hover,
.control-center-trigger:focus-visible {
  border-color: color-mix(in srgb, var(--primary) 58%, var(--border-strong));
  box-shadow: var(--panel-shadow), 0 0 0.9rem color-mix(in srgb, var(--primary) 24%, transparent), var(--glow);
  transform: translateY(-1px);
}

.control-center-trigger:hover::before,
.control-center-trigger:focus-visible::before {
  animation: control-center-surface-sweep 900ms var(--easing) both;
}

.control-center-trigger:hover .control-center-trigger__icon,
.control-center-trigger:focus-visible .control-center-trigger__icon {
  transform: rotate(8deg);
}

.control-center-trigger__icon {
  display: grid;
  place-items: center;
  color: var(--primary);
  transition: transform 180ms var(--easing);
}

.control-center-trigger__label {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(
      100deg,
      var(--foreground) 0%,
      var(--foreground) 34%,
      color-mix(in srgb, var(--primary) 76%, var(--foreground)) 48%,
      var(--foreground) 62%,
      var(--foreground) 100%
    );
  background-clip: text;
  background-size: 230% 100%;
  color: transparent;
  font-weight: 800;
  letter-spacing: 0;
  -webkit-background-clip: text;
  animation: control-center-title-sweep 1100ms var(--easing) 620ms both;
}

.control-center-trigger:hover .control-center-trigger__label,
.control-center-trigger:focus-visible .control-center-trigger__label {
  animation: control-center-title-sweep 1100ms var(--easing) both;
}

@keyframes control-center-surface-sweep {
  0% {
    opacity: 0;
    transform: translateX(-120%);
  }

  38% {
    opacity: 0.86;
  }

  100% {
    opacity: 0;
    transform: translateX(120%);
  }
}

@keyframes control-center-title-sweep {
  0% {
    background-position: 120% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .control-center-trigger,
  .control-center-trigger::before,
  .control-center-trigger__icon,
  .control-center-trigger__label {
    animation: none;
    transition: border-color 160ms ease, box-shadow 160ms ease, color 160ms ease;
    transform: none;
  }

  .control-center-trigger::before {
    opacity: 0;
  }

  .control-center-trigger__label {
    background: none;
    color: var(--foreground);
  }
}

@media (max-width: 1279px) {
  .stage-shell-frame,
  .stage-shell-frame[data-stage-rail-open="true"] {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
