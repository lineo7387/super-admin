import { describe, expect, it } from 'vitest'
import stageDockThumbSource from './StageDockThumb.vue?raw'
import stageOverviewCardSource from './StageOverviewCard.vue?raw'
import stageRailSource from './StageRail.vue?raw'
import stageWindowActionsSource from './StageWindowActions.vue?raw'
import stageWindowPreviewSource from './StageWindowPreview.vue?raw'

describe('stage manager child components', () => {
  it('renders previews through a focused preview frame component without app background fills', () => {
    expect(stageWindowPreviewSource).toContain('defineProps')
    expect(stageWindowPreviewSource).toContain('component?: Component')
    expect(stageWindowPreviewSource).toContain('stage-window-preview')
    expect(stageWindowPreviewSource).toContain('stage-window-scale')
    expect(stageWindowPreviewSource).toContain('previewUnavailableLabel')
    expect(stageWindowPreviewSource).not.toContain('background: var(--app-background);')
  })

  it('keeps stage window actions shared while supporting reveal controls', () => {
    expect(stageWindowActionsSource).toContain('defineEmits')
    expect(stageWindowActionsSource).toContain('togglePin')
    expect(stageWindowActionsSource).toContain('refresh')
    expect(stageWindowActionsSource).toContain('close')
    expect(stageWindowActionsSource).toContain("visibility?: 'always' | 'reveal'")
    expect(stageWindowActionsSource).toContain("visibility: 'always'")
    expect(stageWindowActionsSource).toContain('.stage-action {')
    expect(stageWindowActionsSource).toContain('stage-action--always')
    expect(stageWindowActionsSource).toContain('stage-action--reveal')
    expect(stageWindowActionsSource).toContain('pointer-events: none;')
    expect(stageWindowActionsSource).toContain(':global(.stage-action-host:hover .stage-action--reveal)')
    expect(stageWindowActionsSource).toContain(':global(.stage-action-host:focus-within .stage-action--reveal)')
    expect(stageWindowActionsSource).toContain(':global(.stage-action-host:active .stage-action--reveal)')
    expect(stageWindowActionsSource).not.toContain('opacity-0')
    expect(stageWindowActionsSource).not.toContain('group-hover:opacity-100')
  })

  it('keeps stage thumbnail hit targets flat while moving tilt to a non-interactive surface', () => {
    const thumbBlock = stageDockThumbSource.match(/\.stage-thumb \{[\s\S]*?\n\}/)?.[0] ?? ''
    const surfaceBlock = stageDockThumbSource.match(/\.stage-thumb__surface \{[\s\S]*?\n\}/)?.[0] ?? ''
    const stackBlock = stageDockThumbSource.match(/\.stage-thumb__card-stack \{[\s\S]*?\n\}/)?.[0] ?? ''

    expect(stageDockThumbSource).toContain('defineEmits')
    expect(stageDockThumbSource).toContain('activate: [sourceRect: DOMRect]')
    expect(stageDockThumbSource).toContain("orientation?: 'left' | 'right'")
    expect(stageDockThumbSource).toContain('<div v-if="props.stacked" class="stage-thumb__card-stack" aria-hidden="true">')
    expect(stageDockThumbSource).toContain('stage-thumb__stack-card')
    expect(stageDockThumbSource).toContain('transform: translate(-1.35rem, 0.72rem) scale(0.92);')
    expect(stageDockThumbSource).toContain('transform: translate(-0.72rem, 0.36rem) scale(0.96);')
    expect(stageDockThumbSource).toContain('getBoundingClientRect()')
    expect(stageDockThumbSource).toContain('stage-thumb__button')
    expect(stageDockThumbSource).toContain('stage-thumb__surface')
    expect(stageDockThumbSource).toContain('stage-action-host')
    expect(thumbBlock).not.toContain('transform: perspective')
    expect(stackBlock).toContain('pointer-events: none;')
    expect(stackBlock).toContain('transform: perspective(1000px) rotateY(18deg) scale(0.88);')
    expect(surfaceBlock).toContain('pointer-events: none;')
    expect(surfaceBlock).toContain('transform: perspective(1000px) rotateY(18deg) scale(0.88);')
    expect(stageDockThumbSource).not.toContain('.stage-thumb:hover :deep(.stage-action--reveal)')
    expect(stageDockThumbSource).not.toContain('.stage-thumb:focus-within :deep(.stage-action--reveal)')
  })

  it('composes the left-side Stage Rail as a window-only layout surface', () => {
    const groupedPreviewBlock = stageRailSource.match(
      /<StageWindowPreview\s+[\s\S]*?:component="stageGroup\.component"[\s\S]*?\/>/
    )?.[0] ?? ''

    expect(stageRailSource).toContain('StageDockThumb')
    expect(stageRailSource).toContain('StageWindowPreview')
    expect(stageRailSource).toContain('StageWindowActions')
    expect(stageRailSource).toContain('visibility="reveal"')
    expect(stageRailSource).toContain('stage-rail')
    expect(stageRailSource).toContain('orientation="left"')
    expect(stageDockThumbSource).toContain('stage-thumb__card-stack')
    expect(stageDockThumbSource).toContain('stage-thumb__stack-card')
    expect(stageRailSource).not.toContain('stage-rail__preview-stack')
    expect(stageRailSource).not.toContain('stage-rail__stack-card')
    expect(stageRailSource).toContain('resolveStageGroupWindow')
    expect(stageRailSource).toContain('stage-rail__window-title')
    expect(stageRailSource).toContain('{{ stageGroup.activeTabTitle }}')
    expect(stageRailSource).toContain('{{ stage.title }}')
    expect(stageRailSource).toContain(':stacked="stageGroup.isStacked"')
    expect(groupedPreviewBlock).not.toContain(':stacked="stageGroup.isStacked"')
    expect(stageRailSource).not.toContain('scrollOverflow')
    expect(stageRailSource).not.toContain('stage-dock--scrollable')
    expect(stageRailSource).not.toContain('overflow-y: auto;')
    expect(stageRailSource).toContain(':aria-label="t(\'workspace.stage.stages\')"')
    expect(stageRailSource).toContain('enterWindowGroup')
    expect(stageRailSource).toContain('exitWindowGroup')
    expect(stageRailSource).toContain('useStageWindows')
    expect(stageRailSource).not.toContain('useWorkspaceTabsStore')
    expect(stageRailSource).not.toContain('useRoute')
    expect(stageRailSource).not.toContain('stage-rail__header')
    expect(stageRailSource).not.toContain('StatusPill')
    expect(stageRailSource).not.toContain('{{ stageGroup.label }}')
    expect(stageRailSource).not.toContain('<Teleport')
    expect(stageRailSource).not.toContain('resolveNextGroupWindow')
  })

  it('renders fullscreen overview cards with the same reveal action behavior and no stacked chrome', () => {
    expect(stageOverviewCardSource).toContain('defineEmits')
    expect(stageOverviewCardSource).toContain('activate: [sourceRect: DOMRect]')
    expect(stageOverviewCardSource).toContain('getBoundingClientRect()')
    expect(stageOverviewCardSource).toContain('StageWindowPreview')
    expect(stageOverviewCardSource).toContain('StageWindowActions')
    expect(stageOverviewCardSource).toContain('visibility="reveal"')
    expect(stageOverviewCardSource).toContain('stage-action-host')
    expect(stageOverviewCardSource).not.toContain('.stage-overview-card:hover :deep(.stage-action--reveal)')
    expect(stageOverviewCardSource).not.toContain('.stage-overview-card:focus-within :deep(.stage-action--reveal)')
    expect(stageOverviewCardSource).toContain('stage-overview-card')
    expect(stageOverviewCardSource).toContain('@click.stop')
    expect(stageOverviewCardSource).not.toContain('stage-group-cue')
    expect(stageOverviewCardSource).not.toContain('stage-close--muted')
  })
})
