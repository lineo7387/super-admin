<script setup lang="ts">
import { ArrowLeft, Layers2 } from '@lucide/vue'
import { motion, useReducedMotion } from 'motion-v'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { StageWindowView } from './stage-manager'
import StageDockThumb from './StageDockThumb.vue'
import StageWindowActions from './StageWindowActions.vue'
import StageWindowPreview from './StageWindowPreview.vue'
import { useStageWindows } from './useStageWindows'

const { t } = useI18n()
const { activateStage, closeStage, closeStageGroup, createWindowView, refreshStage, stageGroups, toggleStagePin } = useStageWindows()
const prefersReducedMotion = useReducedMotion()
const activeWindowGroupId = shallowRef<string | null>(null)
const isCollapsingWindowGroup = shallowRef(false)

type RailItemMotionTarget = {
  filter: string
  opacity: number
  scale: number
  x: number
  y: number
}

const visibleStageGroups = computed(() => stageGroups.value.slice(0, 4))
const activeWindowGroup = computed(() =>
  activeWindowGroupId.value ? stageGroups.value.find((group) => group.id === activeWindowGroupId.value) ?? null : null
)
const windowStages = computed<StageWindowView[]>(() =>
  (activeWindowGroup.value?.tabs ?? []).slice(0, 4).map(createWindowView)
)
const railItemAnimate: RailItemMotionTarget = {
  filter: 'blur(0px)',
  opacity: 1,
  scale: 1,
  x: 0,
  y: 0
}

function resolveWindowItemFolded(index: number): RailItemMotionTarget {
  if (prefersReducedMotion.value) {
    return railItemAnimate
  }

  return {
    filter: 'blur(1.2px)',
    opacity: 0,
    scale: 0.74,
    x: -42 - index * 9,
    y: 22 + index * 6
  }
}

function resolveWindowItemTarget(index: number): RailItemMotionTarget {
  return isCollapsingWindowGroup.value ? resolveWindowItemFolded(index) : railItemAnimate
}

function resolveWindowItemTransition(index: number): { delay: number; duration: number; ease: string | number[] } {
  const order = isCollapsingWindowGroup.value ? windowStages.value.length - 1 - index : index

  return {
    delay: prefersReducedMotion.value ? 0 : Math.max(order, 0) * 0.035,
    duration: prefersReducedMotion.value ? 0.12 : 0.36,
    ease: prefersReducedMotion.value ? 'easeOut' : [0.22, 1, 0.36, 1]
  }
}

async function activateStageGroup(groupId: string, sourceRect: DOMRect): Promise<void> {
  const group = stageGroups.value.find((item) => item.id === groupId)
  if (!group) {
    return
  }

  const nextWindow = group.activeTab
  await activateStage(nextWindow.routePath, createWindowView(nextWindow).title, sourceRect)
}

async function activateStageWindow(stage: StageWindowView, sourceRect: DOMRect): Promise<void> {
  isCollapsingWindowGroup.value = false
  activeWindowGroupId.value = null
  await activateStage(stage.tab.routePath, stage.title, sourceRect)
}

function enterWindowGroup(groupId: string): void {
  isCollapsingWindowGroup.value = false
  activeWindowGroupId.value = groupId
}

function exitWindowGroup(): void {
  if (prefersReducedMotion.value || windowStages.value.length === 0) {
    activeWindowGroupId.value = null
    isCollapsingWindowGroup.value = false
    return
  }

  isCollapsingWindowGroup.value = true
}

function handleWindowItemMotionComplete(index: number): void {
  if (!isCollapsingWindowGroup.value || index !== 0) {
    return
  }

  activeWindowGroupId.value = null
  isCollapsingWindowGroup.value = false
}
</script>

<template>
  <aside class="stage-rail" :aria-label="t('workspace.stage.stages')">
    <button
      v-if="activeWindowGroup"
      type="button"
      class="stage-rail__back"
      :title="t('workspace.stage.backToGroups')"
      :aria-label="t('workspace.stage.backToGroups')"
      :disabled="isCollapsingWindowGroup"
      @click="exitWindowGroup"
    >
      <ArrowLeft class="size-3.5" aria-hidden="true" />
    </button>

    <div class="stage-rail__dock" :aria-label="t('workspace.stage.stages')">
      <template v-if="!activeWindowGroup">
        <StageDockThumb
          v-for="stageGroup in visibleStageGroups"
          :key="stageGroup.id"
          :active="stageGroup.isActive"
          :stacked="stageGroup.isStacked"
          @activate="activateStageGroup(stageGroup.id, $event)"
        >
          <StageWindowPreview
            :component="stageGroup.component"
            :preview="stageGroup.preview"
            :preview-unavailable-label="t('workspace.stage.previewUnavailable')"
          />
          <div class="stage-rail__window-title" :title="stageGroup.activeTabTitle">
            {{ stageGroup.activeTabTitle }}
          </div>
          <template #actions>
            <StageWindowActions
              :can-close="stageGroup.tabs.every((tab) => !tab.pinned)"
              :close-label="t('workspace.stage.closeStage')"
              :pin-label="t('workspace.stage.pin')"
              :pinned="stageGroup.activeTab.pinned"
              :refresh-label="t('workspace.stage.refresh')"
              :unpin-label="t('workspace.stage.unpin')"
              @close="closeStageGroup(stageGroup)"
              @refresh="refreshStage(stageGroup.activeTab.id)"
              @toggle-pin="toggleStagePin(stageGroup.activeTab.id)"
            />
          </template>
          <template #cue>
            <button
              v-if="stageGroup.isStacked"
              type="button"
              class="stage-rail__group-cue"
              :title="t('workspace.stage.enterGroupWindows')"
              :aria-label="`${t('workspace.stage.enterGroupWindows')}: ${stageGroup.label}`"
              @click.stop="enterWindowGroup(stageGroup.id)"
            >
              <span class="stage-rail__group-cue-surface">
                <Layers2 class="size-3" aria-hidden="true" />
                <span class="stage-rail__group-count">{{ stageGroup.tabs.length }}</span>
              </span>
            </button>
          </template>
        </StageDockThumb>
      </template>

      <template v-else>
        <motion.div
          v-for="(stage, index) in windowStages"
          :key="stage.tab.id"
          class="stage-rail__motion-item"
          :initial="resolveWindowItemFolded(index)"
          :animate="resolveWindowItemTarget(index)"
          :transition="resolveWindowItemTransition(index)"
          :on-animation-complete="() => handleWindowItemMotionComplete(index)"
        >
          <StageDockThumb
            :active="stage.isActive"
            @activate="activateStageWindow(stage, $event)"
          >
            <StageWindowPreview
              :component="stage.component"
              :preview="stage.preview"
              :preview-unavailable-label="t('workspace.stage.previewUnavailable')"
            />
            <div class="stage-rail__window-title" :title="stage.title">
              {{ stage.title }}
            </div>
            <template #actions>
              <StageWindowActions
                :can-close="!stage.tab.pinned"
                :close-label="t('workspace.stage.closeStage')"
                :pin-label="t('workspace.stage.pin')"
                :pinned="stage.tab.pinned"
                :refresh-label="t('workspace.stage.refresh')"
                :unpin-label="t('workspace.stage.unpin')"
                @close="closeStage(stage.tab.id)"
                @refresh="refreshStage(stage.tab.id)"
                @toggle-pin="toggleStagePin(stage.tab.id)"
              />
            </template>
          </StageDockThumb>
        </motion.div>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.stage-rail {
  --stage-thumb-height: 8.35rem;
  --stage-rail-plane-transform: perspective(860px) rotateY(34deg);

  display: flex;
  position: relative;
  height: 100%;
  min-height: 100vh;
  flex-direction: column;
  border-right: 1px solid color-mix(in srgb, var(--border-strong) 70%, transparent);
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--app-background) 64%, transparent) 0%,
      color-mix(in srgb, var(--app-background) 42%, transparent) 62%,
      color-mix(in srgb, var(--app-background) 20%, transparent) 100%
    );
  backdrop-filter: blur(12px);
  box-shadow: inset -1px 0 0 color-mix(in srgb, var(--foreground) 8%, transparent), var(--panel-shadow);
}

.stage-rail__back {
  position: absolute;
  left: 50%;
  top: 1rem;
  z-index: 10;
  display: inline-flex;
  width: 2.15rem;
  height: 2.15rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--primary) 38%, var(--border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 14%, var(--surface-raised));
  color: var(--foreground);
  font-size: 0.75rem;
  font-weight: 700;
  outline: none;
  transform: translateX(-50%);
  transition:
    border-color var(--duration-base) var(--easing),
    box-shadow var(--duration-base) var(--easing);
}

.stage-rail__back:hover,
.stage-rail__back:focus-visible {
  border-color: var(--border-strong);
  box-shadow: var(--glow);
}

.stage-rail__dock {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.78rem;
  overflow: visible;
  padding: 3.75rem 0.25rem 1.25rem 2rem;
  transform: var(--stage-rail-plane-transform);
  transform-origin: left center;
  transform-style: preserve-3d;
  will-change: transform;
}

.stage-rail__window-title {
  position: absolute;
  left: 0.75rem;
  bottom: 0.52rem;
  z-index: 3;
  max-width: calc(100% - 1.5rem);
  margin-top: 0;
  overflow: hidden;
  color: var(--foreground);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.15;
  text-overflow: ellipsis;
  text-shadow: 0 1px 8px color-mix(in srgb, var(--app-background) 88%, transparent);
  white-space: nowrap;
}

.stage-rail__motion-item {
  width: 13.6rem;
  height: var(--stage-thumb-height);
  flex: 0 0 var(--stage-thumb-height);
  transform-origin: left center;
  will-change: transform, opacity, filter;
}

.stage-rail__motion-item :deep(.stage-thumb) {
  height: 100%;
}

.stage-rail__group-cue {
  position: absolute;
  right: 0.58rem;
  top: 4.45rem;
  z-index: 4;
  display: block;
  max-width: calc(100% - 1.45rem);
  border: 0;
  background: transparent;
  padding: 0;
  pointer-events: auto;
}

.stage-rail__group-cue-surface {
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  border: 1px solid color-mix(in srgb, var(--primary) 48%, var(--border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 18%, var(--surface-raised));
  padding: 0.28rem 0.42rem;
  color: var(--primary);
  font-size: 0.65rem;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}

.stage-rail__group-count {
  min-width: 0.75rem;
  text-align: center;
}

</style>
