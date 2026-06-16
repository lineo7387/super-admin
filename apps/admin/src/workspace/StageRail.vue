<script setup lang="ts">
import { ArrowLeft, Layers2 } from '@lucide/vue'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { resolveStageGroupWindow } from './stage-manager'
import type { StageWindowView } from './stage-manager'
import StageDockThumb from './StageDockThumb.vue'
import StageWindowActions from './StageWindowActions.vue'
import StageWindowPreview from './StageWindowPreview.vue'
import { useStageWindows } from './useStageWindows'

const { t } = useI18n()
const { activateStage, closeStage, createWindowView, refreshStage, stageGroups, toggleStagePin } = useStageWindows()
const activeWindowGroupId = shallowRef<string | null>(null)

const visibleStageGroups = computed(() => stageGroups.value.slice(0, 4))
const activeWindowGroup = computed(() =>
  activeWindowGroupId.value ? stageGroups.value.find((group) => group.id === activeWindowGroupId.value) ?? null : null
)
const windowStages = computed<StageWindowView[]>(() =>
  (activeWindowGroup.value?.tabs ?? []).slice(0, 4).map(createWindowView)
)

async function activateStageGroup(groupId: string, sourceRect: DOMRect): Promise<void> {
  const group = stageGroups.value.find((item) => item.id === groupId)
  if (!group) {
    return
  }

  const nextWindow = resolveStageGroupWindow(group)
  await activateStage(nextWindow.routePath, createWindowView(nextWindow).title, sourceRect)
}

async function activateStageWindow(stage: StageWindowView, sourceRect: DOMRect): Promise<void> {
  activeWindowGroupId.value = null
  await activateStage(stage.tab.routePath, stage.title, sourceRect)
}

function enterWindowGroup(groupId: string): void {
  activeWindowGroupId.value = groupId
}

function exitWindowGroup(): void {
  activeWindowGroupId.value = null
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
          orientation="left"
          :stacked="stageGroup.isStacked"
          @activate="activateStageGroup(stageGroup.id, $event)"
        >
          <StageWindowPreview
            :component="stageGroup.component"
            :preview-unavailable-label="t('workspace.stage.previewUnavailable')"
          />
          <div class="stage-rail__window-title" :title="stageGroup.activeTabTitle">
            {{ stageGroup.activeTabTitle }}
          </div>
          <template #actions>
            <StageWindowActions
              :can-close="!stageGroup.activeTab.pinned"
              :close-label="t('workspace.stage.closeStage')"
              :pin-label="t('workspace.stage.pin')"
              :pinned="stageGroup.activeTab.pinned"
              :refresh-label="t('workspace.stage.refresh')"
              :unpin-label="t('workspace.stage.unpin')"
              visibility="reveal"
              @close="closeStage(stageGroup.activeTab.id)"
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
        <StageDockThumb
          v-for="stage in windowStages"
          :key="stage.tab.id"
          :active="stage.isActive"
          orientation="left"
          @activate="activateStageWindow(stage, $event)"
        >
          <StageWindowPreview
            :component="stage.component"
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
              visibility="reveal"
              @close="closeStage(stage.tab.id)"
              @refresh="refreshStage(stage.tab.id)"
              @toggle-pin="toggleStagePin(stage.tab.id)"
            />
          </template>
        </StageDockThumb>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.stage-rail {
  --stage-thumb-height: 8.35rem;

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
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  overflow: visible;
  padding: 3.75rem 0.75rem 1.25rem;
  perspective: 1200px;
}

.stage-rail__window-title {
  position: relative;
  z-index: 3;
  margin-top: 0.42rem;
  overflow: hidden;
  color: var(--foreground);
  font-size: 0.7rem;
  font-weight: 750;
  line-height: 1.15;
  text-overflow: ellipsis;
  text-shadow: 0 1px 8px color-mix(in srgb, var(--app-background) 78%, transparent);
  white-space: nowrap;
}

.stage-rail__group-cue {
  position: absolute;
  right: 0.72rem;
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
  transform: perspective(1000px) rotateY(18deg) scale(0.88);
  transform-origin: center center;
  transition: transform var(--duration-base) var(--easing);
}

.stage-rail__group-count {
  min-width: 0.75rem;
  text-align: center;
}

:deep(.stage-thumb:hover) .stage-rail__group-cue-surface {
  transform: perspective(1000px) rotateY(9deg) scale(1);
}
</style>
