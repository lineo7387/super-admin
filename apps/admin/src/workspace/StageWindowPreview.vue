<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { StageWindowPreviewModel } from './stage-manager'

const props = withDefaults(
  defineProps<{
    component?: Component
    preview?: StageWindowPreviewModel
    previewUnavailableLabel: string
    variant?: 'overview' | 'thumb'
  }>(),
  {
    variant: 'thumb'
  }
)

const visibleTabs = computed(() => props.preview?.tabs.slice(0, 4) ?? [])
</script>

<template>
  <div
    class="stage-window-preview"
    :class="{
      'stage-window-preview--overview': props.variant === 'overview',
      'stage-window-preview--thumb': props.variant === 'thumb'
    }"
    :data-stage-preview-layout="props.preview?.layoutPreset ?? 'unavailable'"
  >
    <div
      class="stage-window-scale"
      :class="{
        'stage-window-scale--overview': props.variant === 'overview',
        'stage-window-scale--thumb': props.variant === 'thumb'
      }"
    >
      <div
        v-if="props.preview"
        class="stage-window-preview__shell"
        :data-stage-preview-layout="props.preview.layoutPreset"
      >
        <header class="stage-window-preview__chrome">
          <span class="stage-window-preview__brand">SA</span>
          <span class="stage-window-preview__chrome-line stage-window-preview__chrome-line--strong" />
          <span class="stage-window-preview__chrome-line" />
        </header>

        <div class="stage-window-preview__layout" :data-stage-preview-layout="props.preview.layoutPreset">
          <aside
            v-if="props.preview.layoutPreset === 'tri-column'"
            class="stage-window-preview__dock"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
            <span />
          </aside>

          <aside
            v-if="props.preview.layoutPreset === 'tri-column' || props.preview.layoutPreset === 'dual-column'"
            class="stage-window-preview__sidebar"
            aria-hidden="true"
          >
            <span class="stage-window-preview__sidebar-heading" />
            <span />
            <span />
            <span />
            <span />
          </aside>

          <nav
            v-if="props.preview.layoutPreset === 'top-header'"
            class="stage-window-preview__top-nav"
            aria-hidden="true"
          >
            <span class="stage-window-preview__top-nav-brand" />
            <span />
            <span />
            <span />
          </nav>

          <section class="stage-window-preview__workspace">
            <div class="stage-window-preview__tabs" aria-hidden="true">
              <span
                v-for="tab in visibleTabs"
                :key="tab.id"
                class="stage-window-preview__tab"
                :class="tab.active ? 'stage-window-preview__tab--active' : ''"
              >
                <span v-if="tab.pinned" class="stage-window-preview__pin" />
                <span class="stage-window-preview__tab-label">{{ tab.title }}</span>
              </span>
            </div>

            <div class="stage-window-preview__workspace-header">
              <span class="stage-window-preview__module">{{ props.preview.moduleName }}</span>
              <span class="stage-window-preview__title">{{ props.preview.title }}</span>
            </div>

            <div
              class="stage-window-preview__route"
              :aria-label="props.preview.title"
              :data-stage-preview-route="props.preview.routePath"
            >
              <component :is="props.component" v-if="props.component" />
              <div v-else class="stage-window-preview__route-empty">
                {{ props.previewUnavailableLabel }}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div v-else class="stage-window-preview__empty">
        {{ props.previewUnavailableLabel }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage-window-preview {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), transparent 48%),
    color-mix(in srgb, var(--surface-raised) 72%, transparent);
}

.stage-window-preview--thumb {
  height: var(--stage-preview-thumb-height, 5.05rem);
}

.stage-window-preview--overview {
  min-height: 0;
  flex: 1 1 auto;
  height: auto;
}

.stage-window-scale {
  pointer-events: none;
  transform-origin: top left;
}

.stage-window-scale--thumb {
  width: 86rem;
  height: 40rem;
  transform: scale(var(--stage-preview-thumb-scale, 0.125));
}

.stage-window-scale--overview {
  width: 82rem;
  height: 52rem;
  transform: scale(var(--stage-overview-scale));
}

.stage-window-preview__shell {
  display: grid;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  grid-template-rows: 2.6rem minmax(0, 1fr);
  border: 1px solid color-mix(in srgb, var(--border-strong) 58%, transparent);
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--surface) 86%, transparent);
}

.stage-window-preview__chrome {
  display: grid;
  min-width: 0;
  grid-template-columns: auto minmax(0, 0.34fr) minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 74%, transparent);
  background: color-mix(in srgb, var(--header-background) 72%, transparent);
  padding: 0 1rem;
}

.stage-window-preview__brand {
  display: grid;
  width: 2rem;
  height: 1.55rem;
  place-items: center;
  border-radius: 0.45rem;
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.72rem;
  font-weight: 900;
  line-height: 1;
}

.stage-window-preview__chrome-line,
.stage-window-preview__sidebar span,
.stage-window-preview__top-nav span,
.stage-window-preview__dock span {
  display: block;
  min-width: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--muted-foreground) 34%, transparent);
}

.stage-window-preview__chrome-line {
  height: 0.42rem;
}

.stage-window-preview__chrome-line--strong {
  background: color-mix(in srgb, var(--primary) 48%, transparent);
}

.stage-window-preview__layout {
  display: grid;
  min-height: 0;
  gap: 0.7rem;
  padding: 0.7rem;
}

.stage-window-preview__layout[data-stage-preview-layout="tri-column"] {
  grid-template-columns: 4rem 16rem minmax(0, 1fr);
}

.stage-window-preview__layout[data-stage-preview-layout="dual-column"] {
  grid-template-columns: 17rem minmax(0, 1fr);
}

.stage-window-preview__layout[data-stage-preview-layout="top-header"] {
  grid-template-rows: 3.1rem minmax(0, 1fr);
}

.stage-window-preview__dock,
.stage-window-preview__sidebar,
.stage-window-preview__top-nav,
.stage-window-preview__workspace {
  min-width: 0;
  min-height: 0;
  border: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  background: color-mix(in srgb, var(--nav-background) 76%, transparent);
}

.stage-window-preview__dock {
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 0.78rem;
  border-radius: 0.75rem;
  padding: 0.85rem 0.45rem;
}

.stage-window-preview__dock span {
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 0.38rem;
}

.stage-window-preview__sidebar {
  display: grid;
  align-content: start;
  gap: 0.74rem;
  border-radius: 0.75rem;
  padding: 1rem 0.85rem;
}

.stage-window-preview__sidebar span {
  height: 0.5rem;
}

.stage-window-preview__sidebar-heading {
  width: 78%;
  height: 0.7rem;
  background: color-mix(in srgb, var(--foreground) 24%, transparent);
}

.stage-window-preview__top-nav {
  display: grid;
  grid-template-columns: 1fr 0.72fr 0.62fr 0.54fr;
  align-items: center;
  gap: 0.72rem;
  border-radius: 0.75rem;
  padding: 0.72rem 0.9rem;
}

.stage-window-preview__top-nav span {
  height: 0.56rem;
}

.stage-window-preview__top-nav-brand {
  background: color-mix(in srgb, var(--primary) 42%, transparent);
}

.stage-window-preview__workspace {
  display: grid;
  overflow: hidden;
  grid-template-rows: auto auto minmax(0, 1fr);
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--surface-sunken) 86%, transparent);
}

.stage-window-preview__tabs {
  display: flex;
  min-width: 0;
  gap: 0.45rem;
  overflow: hidden;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  padding: 0.58rem 0.68rem;
}

.stage-window-preview__tab {
  display: inline-flex;
  max-width: 10rem;
  min-width: 2.6rem;
  align-items: center;
  gap: 0.3rem;
  border: 1px solid color-mix(in srgb, var(--border) 74%, transparent);
  border-radius: 0.48rem;
  background: color-mix(in srgb, var(--tab-background) 82%, transparent);
  padding: 0.34rem 0.52rem;
  color: var(--muted-foreground);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
}

.stage-window-preview__tab--active {
  border-color: color-mix(in srgb, var(--border-strong) 78%, transparent);
  background: color-mix(in srgb, var(--active-tab-background) 86%, transparent);
  color: var(--foreground);
}

.stage-window-preview__pin {
  width: 0.42rem;
  height: 0.42rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--primary);
}

.stage-window-preview__tab-label,
.stage-window-preview__module,
.stage-window-preview__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stage-window-preview__workspace-header {
  display: grid;
  min-width: 0;
  gap: 0.24rem;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 64%, transparent);
  padding: 0.72rem 0.9rem;
}

.stage-window-preview__module {
  color: var(--muted-foreground);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
}

.stage-window-preview__title {
  color: var(--foreground);
  font-size: 1.3rem;
  font-weight: 850;
  line-height: 1.05;
}

.stage-window-preview__route {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  contain: layout paint style;
}

.stage-window-preview__route :deep(> *) {
  min-width: 0;
}

.stage-window-preview__route :deep(.min-h-screen) {
  min-height: 100%;
}

.stage-window-preview__route :deep(.fixed) {
  position: absolute;
}

.stage-window-preview__route-empty,
.stage-window-preview__empty {
  display: grid;
  height: 100%;
  min-height: 0;
  place-items: center;
  padding: 0.75rem;
  color: var(--muted-foreground);
  font-size: 1.1rem;
  text-align: center;
}
</style>
