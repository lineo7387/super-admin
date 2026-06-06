import { describe, expect, it } from 'vitest'
import stageDockPanelSource from './StageDockPanel.vue?raw'
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

  it('keeps side-dock hit targets flat while moving tilt to a non-interactive surface', () => {
    const thumbBlock = stageDockThumbSource.match(/\.stage-thumb \{[\s\S]*?\n\}/)?.[0] ?? ''
    const surfaceBlock = stageDockThumbSource.match(/\.stage-thumb__surface \{[\s\S]*?\n\}/)?.[0] ?? ''

    expect(stageDockThumbSource).toContain('defineEmits')
    expect(stageDockThumbSource).toContain('activate')
    expect(stageDockThumbSource).toContain('stage-thumb__button')
    expect(stageDockThumbSource).toContain('stage-thumb__surface')
    expect(stageDockThumbSource).toContain('stage-action-host')
    expect(thumbBlock).not.toContain('transform: perspective')
    expect(surfaceBlock).toContain('pointer-events: none;')
    expect(surfaceBlock).toContain('transform: perspective(1000px) rotateY(18deg) scale(0.88);')
    expect(stageDockThumbSource).not.toContain('.stage-thumb:hover :deep(.stage-action--reveal)')
    expect(stageDockThumbSource).not.toContain('.stage-thumb:focus-within :deep(.stage-action--reveal)')
  })

  it('composes the side-dock group and window views without importing stores or router', () => {
    expect(stageDockPanelSource).toContain('StageDockThumb')
    expect(stageDockPanelSource).toContain('StageWindowPreview')
    expect(stageDockPanelSource).toContain('StageWindowActions')
    expect(stageDockPanelSource.match(/visibility="reveal"/g)?.length).toBe(2)
    expect(stageDockPanelSource).toContain('stage-dock--clipped')
    expect(stageDockPanelSource).not.toContain('scrollOverflow')
    expect(stageDockPanelSource).not.toContain('stage-dock--scrollable')
    expect(stageDockPanelSource).not.toContain('overflow-y: auto;')
    expect(stageDockPanelSource).toContain(':aria-label="props.labels.stages"')
    expect(stageDockPanelSource).toContain('enterGroup')
    expect(stageDockPanelSource).toContain('exitGroup')
    expect(stageDockPanelSource).not.toContain('useWorkspaceTabsStore')
    expect(stageDockPanelSource).not.toContain('useRouter')
  })

  it('renders all-windows cards with the same reveal action behavior and no stacked chrome', () => {
    expect(stageOverviewCardSource).toContain('defineEmits')
    expect(stageOverviewCardSource).toContain('activate')
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
