<script setup lang="ts">
import { ArrowLeft, ChevronRight, Layers2 } from 'lucide-vue-next'
import type { StageGroupView, StageWindowView } from './stage-manager'
import StageDockThumb from './StageDockThumb.vue'
import StageWindowActions from './StageWindowActions.vue'
import StageWindowPreview from './StageWindowPreview.vue'

type StageDockLabels = {
  backToGroups: string
  closeStage: string
  current: string
  enterGroupWindows: string
  pin: string
  pinned: string
  previewUnavailable: string
  refresh: string
  stages: string
  unpin: string
  windows: string
}

const props = defineProps<{
  activeWindowGroup: StageGroupView | null
  labels: StageDockLabels
  stageGroups: StageGroupView[]
  windowStages: StageWindowView[]
}>()

const emit = defineEmits<{
  activateGroup: [groupId: string]
  activateWindow: [routePath: string]
  closeWindow: [tabId: string]
  enterGroup: [groupId: string]
  exitGroup: []
  refreshWindow: [tabId: string]
  togglePin: [tabId: string]
}>()
</script>

<template>
  <button
    v-if="props.activeWindowGroup"
    type="button"
    class="stage-dock-back"
    :title="props.labels.backToGroups"
    @click="emit('exitGroup')"
  >
    <ArrowLeft class="size-3.5" aria-hidden="true" />
    <span class="min-w-0 truncate">{{ props.labels.backToGroups }}</span>
  </button>

  <div class="stage-dock" :aria-label="props.labels.stages" @click.stop>
    <div class="stage-dock__viewport stage-dock--clipped">
      <template v-if="!props.activeWindowGroup">
        <StageDockThumb
          v-for="stageGroup in props.stageGroups"
          :key="stageGroup.id"
          :active="stageGroup.isActive"
          :stacked="stageGroup.isStacked"
          @activate="emit('activateGroup', stageGroup.id)"
        >
          <StageWindowPreview
            :component="stageGroup.component"
            :preview-unavailable-label="props.labels.previewUnavailable"
            :stacked="stageGroup.isStacked"
          />
          <div class="mt-2 flex items-center justify-between gap-2">
            <div class="min-w-0">
              <div class="truncate text-xs font-semibold text-[var(--foreground)]">{{ stageGroup.label }}</div>
              <div class="mt-0.5 truncate text-[10px] text-[var(--muted-foreground)]">
                {{ stageGroup.activeTabTitle }}
              </div>
            </div>
          </div>
          <div class="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
            <span v-if="stageGroup.isActive" class="text-[var(--primary)]">{{ props.labels.current }}</span>
            <span v-if="stageGroup.activeTab.pinned" class="text-[var(--accent)]">{{ props.labels.pinned }}</span>
          </div>
          <template #cue>
            <button
              v-if="stageGroup.isStacked"
              type="button"
              class="stage-group-cue"
              :title="props.labels.enterGroupWindows"
              :aria-label="`${props.labels.enterGroupWindows}: ${stageGroup.label}`"
              @click.stop="emit('enterGroup', stageGroup.id)"
            >
              <span class="stage-group-cue__surface">
                <Layers2 class="size-3" aria-hidden="true" />
                <span>{{ stageGroup.tabs.length }} {{ props.labels.windows }}</span>
                <ChevronRight class="size-3" aria-hidden="true" />
              </span>
            </button>
          </template>
          <template #actions>
            <StageWindowActions
              :can-close="!stageGroup.activeTab.pinned"
              :close-label="props.labels.closeStage"
              :pin-label="props.labels.pin"
              :pinned="stageGroup.activeTab.pinned"
              :refresh-label="props.labels.refresh"
              :unpin-label="props.labels.unpin"
              visibility="reveal"
              @close="emit('closeWindow', stageGroup.activeTab.id)"
              @refresh="emit('refreshWindow', stageGroup.activeTab.id)"
              @toggle-pin="emit('togglePin', stageGroup.activeTab.id)"
            />
          </template>
        </StageDockThumb>
      </template>

      <template v-else>
        <StageDockThumb
          v-for="stage in props.windowStages"
          :key="stage.tab.id"
          :active="stage.isActive"
          @activate="emit('activateWindow', stage.tab.routePath)"
        >
          <StageWindowPreview
            :component="stage.component"
            :preview-unavailable-label="props.labels.previewUnavailable"
          />
          <div class="mt-2 truncate text-xs font-semibold text-[var(--foreground)]">
            {{ stage.title }}
          </div>
          <div class="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
            <span v-if="stage.isActive" class="text-[var(--primary)]">{{ props.labels.current }}</span>
            <span v-if="stage.tab.pinned" class="text-[var(--accent)]">{{ props.labels.pinned }}</span>
          </div>
          <template #actions>
            <StageWindowActions
              :can-close="!stage.tab.pinned"
              :close-label="props.labels.closeStage"
              :pin-label="props.labels.pin"
              :pinned="stage.tab.pinned"
              :refresh-label="props.labels.refresh"
              :unpin-label="props.labels.unpin"
              visibility="reveal"
              @close="emit('closeWindow', stage.tab.id)"
              @refresh="emit('refreshWindow', stage.tab.id)"
              @toggle-pin="emit('togglePin', stage.tab.id)"
            />
          </template>
        </StageDockThumb>
      </template>
    </div>
  </div>
</template>

<style scoped>
.stage-dock {
  --stage-thumb-gap: 0.58rem;
  --stage-thumb-height: 8.35rem;
  --stage-hover-buffer: 0.8rem;
  --stage-perspective-buffer: 8rem;
  --stage-visible-slots: 4;

  position: absolute;
  pointer-events: auto;
  z-index: 10;
  left: calc((var(--stage-side-mask-width) - var(--stage-dock-width)) / 2);
  top: calc(7.15rem - var(--stage-hover-buffer));
  width: var(--stage-dock-width);
  height: calc(
    (var(--stage-visible-slots) * var(--stage-thumb-height)) +
      ((var(--stage-visible-slots) - 1) * var(--stage-thumb-gap)) +
      var(--stage-hover-buffer) +
      var(--stage-perspective-buffer)
  );
  max-height: calc(100vh - 6.7rem);
  overflow: visible;
  transform-style: preserve-3d;
}

.stage-dock__viewport {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
  gap: var(--stage-thumb-gap);
  overflow-x: visible;
  overflow-y: visible;
  padding: var(--stage-hover-buffer) 0.55rem 0.85rem;
}

.stage-dock--clipped .stage-thumb:nth-of-type(n + 5) {
  display: none;
}

.stage-dock-back {
  position: absolute;
  left: calc((var(--stage-side-mask-width) - var(--stage-dock-width)) / 2);
  top: 4.75rem;
  z-index: 30;
  display: inline-flex;
  max-width: 12rem;
  align-items: center;
  gap: 0.38rem;
  border: 1px solid color-mix(in srgb, var(--primary) 38%, var(--border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 14%, var(--surface-raised));
  padding: 0.4rem 0.65rem 0.4rem 0.5rem;
  color: var(--foreground);
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.stage-group-cue {
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

.stage-group-cue__surface {
  display: inline-flex;
  align-items: center;
  gap: 0.22rem;
  border: 1px solid var(--border);
  border-color: color-mix(in srgb, var(--primary) 48%, var(--border));
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

@media (max-width: 760px) {
  .stage-dock {
    top: 6.85rem;
  }

  .stage-dock-back {
    top: 4.75rem;
    max-width: 9.5rem;
  }
}
</style>
