import { describe, expect, it } from 'vitest'
import stageManagerOverlaySource from './StageManagerOverlay.vue?raw'

describe('stage manager overlay entry', () => {
  it('opens from shell state instead of rendering a permanent viewport button', () => {
    expect(stageManagerOverlaySource).toContain('preferences.stageManagerOpen')
    expect(stageManagerOverlaySource).not.toContain('fixed right-16 top-3')
    expect(stageManagerOverlaySource).not.toContain('@click="openStageManager"')
  })

  it('keeps Stage Manager as a thin orchestration component', () => {
    expect(stageManagerOverlaySource).toContain('StageDockPanel')
    expect(stageManagerOverlaySource).toContain('StageOverviewCard')
    expect(stageManagerOverlaySource).toContain("from './stage-manager'")
    expect(stageManagerOverlaySource).toContain('sortStageGroupsForDock(')
    expect(stageManagerOverlaySource).toContain('resolveNextGroupWindow(group, route.fullPath)')
    expect(stageManagerOverlaySource).toContain('resolveOverviewLayout(allWindowStages.value.length, stageViewportWidth.value)')
    expect(stageManagerOverlaySource).not.toContain('tabs.state.tabs.map')
  })

  it('wires side-dock group and second-level window actions through the dock panel', () => {
    expect(stageManagerOverlaySource).toContain("preferences.stageManager.presentationMode === 'side-dock'")
    expect(stageManagerOverlaySource).toContain(':active-window-group="activeWindowGroup"')
    expect(stageManagerOverlaySource).toContain(':stage-groups="stageGroups"')
    expect(stageManagerOverlaySource).toContain(':window-stages="windowStages"')
    expect(stageManagerOverlaySource).toContain('@activate-group="activateStageGroup"')
    expect(stageManagerOverlaySource).toContain('@activate-window="activateStage"')
    expect(stageManagerOverlaySource).toContain('@enter-group="enterWindowGroup"')
    expect(stageManagerOverlaySource).toContain('@exit-group="exitWindowGroup"')
    expect(stageManagerOverlaySource).not.toContain('scrollOverflow')
    expect(stageManagerOverlaySource).not.toContain('scroll-overflow')
    expect(stageManagerOverlaySource).not.toContain('stage-stack-panel')
    expect(stageManagerOverlaySource).not.toContain('stage-stack-list')
  })

  it('renders all-windows as an ungrouped full-screen overview with backdrop close', () => {
    expect(stageManagerOverlaySource).toContain("preferences.stageManager.presentationMode === 'all-windows'")
    expect(stageManagerOverlaySource).toContain('allWindowStages')
    expect(stageManagerOverlaySource).toContain('StageOverviewCard')
    expect(stageManagerOverlaySource).toContain('@click="closeAllWindowsOnBackdrop"')
    expect(stageManagerOverlaySource).toContain('@activate="activateStage(stage.tab.routePath)"')
    expect(stageManagerOverlaySource).not.toContain('stage-group-cue all-windows')
  })

  it('does not render top close-button chrome in all-windows mode', () => {
    expect(stageManagerOverlaySource).toContain('stage-header--muted')
    expect(stageManagerOverlaySource).toContain("preferences.stageManager.presentationMode !== 'all-windows'")
    expect(stageManagerOverlaySource).not.toContain('stage-close--muted')
  })

  it('keeps side-dock blur on the left mask instead of the full overlay layer', () => {
    const layerBlock = stageManagerOverlaySource.match(/\.stage-layer \{[\s\S]*?\n\}/)?.[0] ?? ''
    const sideMaskBlock = stageManagerOverlaySource.match(/\.stage-side-mask \{[\s\S]*?\n\}/)?.[0] ?? ''

    expect(stageManagerOverlaySource).toContain('stage-side-mask')
    expect(layerBlock).toContain('background: transparent;')
    expect(layerBlock).not.toContain('backdrop-filter: blur(')
    expect(sideMaskBlock).toContain('backdrop-filter: blur(8px);')
    expect(sideMaskBlock).toContain('width: var(--stage-side-mask-width);')
    expect(sideMaskBlock).toContain('border-right: 1px solid')
  })

  it('fits all-windows cards inside a centered non-scrolling grid', () => {
    const overviewGridBlock = stageManagerOverlaySource.match(/\.stage-overview-grid \{[\s\S]*?\n\}/)?.[0] ?? ''

    expect(stageManagerOverlaySource).toContain(':style="overviewGridStyle"')
    expect(overviewGridBlock).toContain('grid-template-columns: repeat(var(--stage-overview-columns), minmax(0, var(--stage-overview-card-width)));')
    expect(overviewGridBlock).toContain('grid-template-rows: repeat(var(--stage-overview-rows), minmax(0, var(--stage-overview-card-height)));')
    expect(overviewGridBlock).toContain('place-content: center;')
    expect(overviewGridBlock).toContain('overflow: hidden;')
    expect(overviewGridBlock).not.toContain('overflow: auto;')
  })
})
