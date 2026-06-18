import { describe, expect, it } from 'vitest'
import stageDockThumbSource from './StageDockThumb.vue?raw'
import stageOverviewCardSource from './StageOverviewCard.vue?raw'
import stageWindowActionsSource from './StageWindowActions.vue?raw'
import stageWindowPreviewSource from './StageWindowPreview.vue?raw'

describe('stage manager child components', () => {
  it('renders previews through a focused preview frame component without app background fills', () => {
    expect(stageWindowPreviewSource).toContain('defineProps')
    expect(stageWindowPreviewSource).toContain('component?: Component')
    expect(stageWindowPreviewSource).toContain('stage-window-preview')
    expect(stageWindowPreviewSource).toContain('stage-window-scale')
    expect(stageWindowPreviewSource).toContain('previewUnavailableLabel')
    expect(stageWindowPreviewSource).toContain('height: var(--stage-preview-thumb-height, 5.05rem);')
    expect(stageWindowPreviewSource).toContain('transform: scale(var(--stage-preview-thumb-scale, 0.19));')
    expect(stageWindowPreviewSource).not.toContain('background: var(--app-background);')
  })

  it('keeps stage window actions shared while supporting reveal controls', () => {
    expect(stageWindowActionsSource).toContain('defineEmits')
    expect(stageWindowActionsSource).toContain('togglePin')
    expect(stageWindowActionsSource).toContain('refresh')
    expect(stageWindowActionsSource).toContain('close')
    expect(stageWindowActionsSource).toContain('.stage-action {')
    expect(stageWindowActionsSource).toContain('pointer-events: none;')
    expect(stageWindowActionsSource).toContain(':global(.stage-action-host:hover .stage-action)')
    expect(stageWindowActionsSource).toContain(':global(.stage-action-host:focus-within .stage-action)')
    expect(stageWindowActionsSource).toContain(':global(.stage-action-host:active .stage-action)')
    expect(stageWindowActionsSource).not.toContain('opacity-0')
    expect(stageWindowActionsSource).not.toContain('group-hover:opacity-100')
  })

  it('keeps stage thumbnail hit targets flat while rail-level 3D owns the angle', () => {
    const thumbBlock = stageDockThumbSource.match(/\.stage-thumb \{[\s\S]*?\n\}/)?.[0] ?? ''
    const actionsBlock = stageDockThumbSource.match(/\.stage-thumb__actions \{[\s\S]*?\n\}/)?.[0] ?? ''
    const surfaceBlock = stageDockThumbSource.match(/\.stage-thumb__surface \{[\s\S]*?\n\}/)?.[0] ?? ''
    const stackBlock = stageDockThumbSource.match(/\.stage-thumb__card-stack \{[\s\S]*?\n\}/)?.[0] ?? ''

    expect(stageDockThumbSource).toContain('defineEmits')
    expect(stageDockThumbSource).toContain('activate: [sourceRect: DOMRect]')
    expect(stageDockThumbSource).toContain('<div v-if="props.stacked" class="stage-thumb__card-stack" aria-hidden="true">')
    expect(stageDockThumbSource).toContain('stage-thumb__stack-card')
    expect(stageDockThumbSource).toContain('getBoundingClientRect()')
    expect(stageDockThumbSource).toContain('stage-thumb__button')
    expect(stageDockThumbSource).toContain('stage-thumb__surface')
    expect(stageDockThumbSource).toContain('stage-thumb__actions')
    expect(stageDockThumbSource).toContain('stage-action-host')
    expect(stageDockThumbSource).toContain('stage-thumb--pressed')
    expect(stageDockThumbSource).toContain('@pointerdown="pressThumb"')
    expect(stageDockThumbSource).toContain('@pointercancel="releaseThumb"')
    expect(stageDockThumbSource).toContain('@pointerleave="releaseThumb"')
    expect(stageDockThumbSource).toContain('@pointerup="releaseThumb"')
    expect(thumbBlock).toContain('--stage-thumb-rest-scale: 0.98;')
    expect(thumbBlock).toContain('--stage-thumb-hover-scale: 1;')
    expect(thumbBlock).toContain('width: 12rem;')
    expect(thumbBlock).not.toContain('rotateY(')
    expect(thumbBlock).not.toContain('matrix3d(')
    expect(thumbBlock).not.toMatch(/\n\s*transform:\s*perspective/)
    expect(stackBlock).toContain('pointer-events: none;')
    expect(surfaceBlock).toContain('pointer-events: none;')
    expect(surfaceBlock).toContain('padding: 0.55rem;')
    expect(surfaceBlock).toContain('background: transparent;')
    expect(stageDockThumbSource).not.toContain('.stage-thumb__surface::before')
    expect(stageDockThumbSource).not.toContain('transform: rotateY(-74deg) translateZ(-0.18rem);')
    expect(actionsBlock).toContain('pointer-events: none;')
    expect(stageDockThumbSource).toContain('transform: scale(var(--stage-thumb-rest-scale));')
    expect(stageDockThumbSource).toContain('transform: scale(var(--stage-thumb-hover-scale));')
    expect(stageDockThumbSource).toContain('.stage-thumb:focus-within .stage-thumb__plane')
    expect(stageDockThumbSource).toContain('.stage-thumb:active .stage-thumb__plane')
    expect(stageDockThumbSource).toContain('.stage-thumb--pressed .stage-thumb__plane')
    expect(stageDockThumbSource).not.toContain('rotateY(9deg)')
    expect(stageDockThumbSource).not.toContain('--stage-thumb-projection')
    expect(stageDockThumbSource).not.toContain('--stage-thumb-hover-transform')
    expect(stageDockThumbSource).not.toContain('--stage-thumb-rest-transform')
    expect(stageDockThumbSource).not.toContain('transform-style: preserve-3d')
    expect(stageDockThumbSource).not.toContain('.stage-thumb:hover :deep(.stage-action--reveal)')
    expect(stageDockThumbSource).not.toContain('.stage-thumb:focus-within :deep(.stage-action--reveal)')
    expect(stageDockThumbSource).not.toContain('stage-thumb--right')
  })

  it('renders fullscreen overview cards with the same reveal action behavior and no stacked chrome', () => {
    expect(stageOverviewCardSource).toContain('defineEmits')
    expect(stageOverviewCardSource).toContain('activate: [sourceRect: DOMRect]')
    expect(stageOverviewCardSource).toContain('getBoundingClientRect()')
    expect(stageOverviewCardSource).toContain('StageWindowPreview')
    expect(stageOverviewCardSource).toContain('StageWindowActions')
    expect(stageOverviewCardSource).toContain('stage-action-host')
    expect(stageOverviewCardSource).not.toContain('.stage-overview-card:hover :deep(.stage-action--reveal)')
    expect(stageOverviewCardSource).not.toContain('.stage-overview-card:focus-within :deep(.stage-action--reveal)')
    expect(stageOverviewCardSource).toContain('stage-overview-card')
    expect(stageOverviewCardSource).toContain('@click.stop')
    expect(stageOverviewCardSource).not.toContain('stage-group-cue')
    expect(stageOverviewCardSource).not.toContain('stage-close--muted')
  })
})
