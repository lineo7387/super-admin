<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/stores/preferences.store'
import { resolveOverviewLayout } from './stage-manager'
import StageOverviewCard from './StageOverviewCard.vue'
import { useStageWindows } from './useStageWindows'

const preferences = usePreferencesStore()
const { t } = useI18n()
const { activeRoutePath, allWindowStages, closeStage, refreshStage, toggleStagePin, activateStage } = useStageWindows()
const stageViewportWidth = shallowRef(1280)

const overviewGridStyle = computed<Record<string, string>>(() => {
  const layout = resolveOverviewLayout(allWindowStages.value.length, stageViewportWidth.value)

  return {
    '--stage-overview-columns': String(layout.columns),
    '--stage-overview-rows': String(layout.rows),
    '--stage-overview-card-width': layout.cardWidth,
    '--stage-overview-card-height': layout.cardHeight,
    '--stage-overview-scale': String(layout.scale)
  }
})

function syncStageViewportWidth(): void {
  stageViewportWidth.value = window.innerWidth
}

onMounted(() => {
  syncStageViewportWidth()
  window.addEventListener('resize', syncStageViewportWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', syncStageViewportWidth)
})

function closeOverviewOnBackdrop(): void {
  preferences.closeStageOverview()
}

async function activateOverviewStage(path: string, title: string, sourceRect: DOMRect): Promise<void> {
  await activateStage(path, title, sourceRect)
  preferences.closeStageOverview()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="preferences.stageManagerDesktopAvailable && preferences.stageOverviewOpen"
      class="stage-overview-layer fixed inset-0 z-[75] pointer-events-auto"
      @keydown.esc="preferences.closeStageOverview()"
    >
      <section
        class="relative h-full w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-overview-title"
        @click="closeOverviewOnBackdrop"
      >
        <div class="stage-all-windows-mask" aria-hidden="true" />

        <header class="pointer-events-none absolute left-7 top-6 z-20 max-w-sm opacity-50">
          <div>
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">{{ t('workspace.stage.title') }}</div>
            <h2 id="stage-overview-title" class="mt-1 [font-family:var(--font-display)] text-lg text-[var(--foreground)]">
              {{ t('workspace.stage.openWorkspaces') }}
            </h2>
          </div>
        </header>

        <div
          class="stage-overview-grid"
          :style="overviewGridStyle"
          :aria-label="t('workspace.stage.stages')"
        >
          <StageOverviewCard
            v-for="stage in allWindowStages"
            :key="stage.tab.id"
            :active="stage.isActive"
            :close-label="t('workspace.stage.closeStage')"
            :component="stage.component"
            :current-label="t('workspace.stage.current')"
            :pin-label="t('workspace.stage.pin')"
            :pinned="stage.tab.pinned"
            :preview-unavailable-label="t('workspace.stage.previewUnavailable')"
            :refresh-label="t('workspace.stage.refresh')"
            :route-path="stage.tab.routePath"
            :title="stage.title"
            :unpin-label="t('workspace.stage.unpin')"
            @activate="activateOverviewStage(stage.tab.routePath, stage.title, $event)"
            @close="closeStage(stage.tab.id)"
            @refresh="refreshStage(stage.tab.id)"
            @toggle-pin="toggleStagePin(stage.tab.id)"
          />
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.stage-overview-layer {
  background: transparent;
  perspective: 1400px;
}

.stage-all-windows-mask {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: color-mix(in srgb, var(--app-background) 18%, transparent);
  backdrop-filter: blur(16px);
}

.stage-overview-grid {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(var(--stage-overview-columns), minmax(0, var(--stage-overview-card-width)));
  grid-template-rows: repeat(var(--stage-overview-rows), minmax(0, var(--stage-overview-card-height)));
  place-content: center;
  justify-content: center;
  align-content: center;
  align-items: stretch;
  justify-items: stretch;
  gap: clamp(0.65rem, 1.4vw, 1.35rem);
  overflow: hidden;
  padding: clamp(5.5rem, 7vh, 7rem) clamp(2rem, 4vw, 4.5rem);
}
</style>
