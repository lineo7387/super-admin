<script setup lang="ts">
import { Pin, PinOff, RotateCw, X } from 'lucide-vue-next'
import type { Component } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findActiveModule, findModuleRoute } from '@super-admin/core'
import { AdminButton } from '@super-admin/ui'
import { usePreferencesStore } from '@/stores/preferences.store'
import { registeredModules } from '@/modules/module-registry'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'

const preferences = usePreferencesStore()
const route = useRoute()
const router = useRouter()
const tabs = useWorkspaceTabsStore()

const stages = computed(() =>
  tabs.state.tabs.map((tab) => {
    const module = findActiveModule(registeredModules, tab.routePath)
    const moduleRoute = findModuleRoute(module, tab.routePath)
    const isActive = tab.routePath === route.fullPath

    return {
      tab,
      component: moduleRoute?.component as Component | undefined,
      isActive
    }
  })
)

function closeStageManager(): void {
  preferences.closeStageManager()
}

function activateStage(path: string): void {
  tabs.activateTab(path)
  closeStageManager()
  void router.push(path)
}

function closeStage(tabId: string): void {
  const next = tabs.closeTab(tabId)
  if (route.fullPath === tabId && next) {
    void router.push(next.routePath)
    return
  }

  if (route.fullPath === tabId) {
    void router.push('/dashboard')
  }
}

function toggleStagePin(tabId: string): void {
  tabs.pinTab(tabId)
}

function refreshStage(tabId: string): void {
  tabs.refreshTab(tabId)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="preferences.stageManager.enabled && preferences.stageManagerOpen"
      class="stage-layer fixed inset-0 z-[75] pointer-events-none"
      @keydown.esc="closeStageManager"
    >
      <section
        class="relative h-full w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-manager-title"
      >
        <div class="stage-side-mask" />

        <header class="pointer-events-none absolute left-7 top-6 z-20 max-w-sm">
          <div>
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--primary)]">Stage Manager</div>
            <h2 id="stage-manager-title" class="mt-1 [font-family:var(--font-display)] text-lg text-[var(--foreground)]">
              Open workspaces
            </h2>
          </div>
        </header>

        <AdminButton
          variant="secondary"
          size="icon"
          class="pointer-events-auto absolute left-[13.75rem] top-6 z-30 shadow-[var(--panel-shadow)]"
          title="Close Stage Manager"
          @click="closeStageManager"
        >
          <X class="size-4" />
        </AdminButton>

        <div class="stage-dock" aria-label="Workspace stages">
          <article
            v-for="stage in stages"
            :key="stage.tab.id"
            class="stage-thumb group"
            :class="stage.isActive ? 'stage-thumb--active' : ''"
          >
            <button
              type="button"
              class="block h-full w-full text-left focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
              @click="activateStage(stage.tab.routePath)"
            >
              <div class="stage-window-preview stage-window-preview--thumb">
                <div class="stage-window-scale stage-window-scale--thumb">
                  <component :is="stage.component" v-if="stage.component" />
                  <div v-else class="grid h-full place-items-center text-sm text-[var(--muted-foreground)]">
                    Preview unavailable
                  </div>
                </div>
              </div>
              <div class="mt-2 truncate text-xs font-semibold text-[var(--foreground)]">{{ stage.tab.title }}</div>
              <div class="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
                <span v-if="stage.isActive" class="text-[var(--primary)]">Current</span>
                <span v-if="stage.tab.pinned" class="text-[var(--accent)]">Pinned</span>
              </div>
            </button>
            <button
              type="button"
              class="stage-action stage-action--pin opacity-0 transition group-hover:opacity-100"
              :title="stage.tab.pinned ? 'Unpin stage' : 'Pin stage'"
              @click.stop="toggleStagePin(stage.tab.id)"
            >
              <PinOff v-if="stage.tab.pinned" class="size-3" />
              <Pin v-else class="size-3" />
            </button>
            <button
              type="button"
              class="stage-action stage-action--refresh opacity-0 transition group-hover:opacity-100"
              title="Refresh stage"
              @click.stop="refreshStage(stage.tab.id)"
            >
              <RotateCw class="size-3" />
            </button>
            <button
              v-if="!stage.tab.pinned"
              type="button"
              class="stage-action stage-action--close opacity-0 transition group-hover:opacity-100"
              title="Close stage"
              @click.stop="closeStage(stage.tab.id)"
            >
              <X class="size-3" />
            </button>
          </article>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.stage-layer {
  background: transparent;
  perspective: 1400px;
}

.stage-side-mask {
  position: absolute;
  inset: 0 auto 0 0;
  width: min(19rem, 42vw);
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--app-background) 82%, black 18%) 0%,
      color-mix(in srgb, var(--app-background) 58%, transparent) 72%,
      transparent 100%
    );
  backdrop-filter: blur(2px);
  border-right: 1px solid color-mix(in srgb, var(--border) 58%, transparent);
}

.stage-dock {
  position: absolute;
  pointer-events: auto;
  left: clamp(1.25rem, 4vw, 3rem);
  top: 7rem;
  display: flex;
  width: 12.6rem;
  height: calc(100vh - 11rem);
  flex-direction: column;
  gap: 1rem;
  transform-style: preserve-3d;
}

.stage-thumb {
  position: relative;
  width: 12rem;
  padding: 0.55rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  box-shadow: var(--panel-shadow);
  backdrop-filter: blur(10px);
  transform: perspective(1000px) rotateY(12deg) scale(0.96);
  transform-origin: right center;
  transition:
    transform var(--duration-base) var(--easing),
    border-color var(--duration-base) var(--easing);
}

.stage-thumb--active {
  border-color: var(--border-strong);
  box-shadow: var(--glow), var(--panel-shadow);
}

.stage-thumb:hover {
  border-color: var(--border-strong);
  transform: perspective(1000px) rotateY(7deg) scale(1) translateX(0.35rem);
}

.stage-window-preview {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--app-background);
}

.stage-window-preview--thumb {
  height: 7.2rem;
}

.stage-window-scale {
  pointer-events: none;
  transform-origin: top left;
}

.stage-window-scale--thumb {
  width: 56rem;
  height: 38rem;
  padding: 0.85rem;
  transform: scale(0.21);
}

.stage-action {
  position: absolute;
  top: 0.4rem;
  display: grid;
  width: 1.35rem;
  height: 1.35rem;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-raised);
  color: var(--foreground);
}

.stage-action--close {
  right: 0.4rem;
}

.stage-action--refresh {
  right: 1.95rem;
}

.stage-action--pin {
  right: 3.5rem;
}

@media (max-width: 760px) {
  .stage-dock {
    left: 1rem;
    top: 6rem;
    width: 10rem;
  }

  .stage-thumb {
    width: 9.5rem;
  }
}
</style>
