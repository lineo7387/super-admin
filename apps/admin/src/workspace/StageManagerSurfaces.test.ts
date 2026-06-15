import { describe, expect, it } from 'vitest'
import appShellSource from '@/shell/AppShell.vue?raw'
import stageOverviewSource from './StageOverview.vue?raw'
import stageRailSource from './StageRail.vue?raw'
import stageTransitionGhostSource from './StageTransitionGhost.vue?raw'

describe('stage manager desktop surfaces', () => {
  it('mounts Stage Rail as a left-side app shell region instead of a teleported side overlay', () => {
    expect(appShellSource).toContain('StageRail')
    expect(appShellSource).toContain('stage-shell-frame')
    expect(appShellSource).toContain('<StageRail v-if="showStageRail" />')
    expect(appShellSource).toContain('grid-template-columns: 14rem minmax(0, 1fr);')
    expect(appShellSource).toContain('preferences.stageManagerDesktopAvailable')
    expect(appShellSource).toContain('preferences.stageManager.railEnabled')
    expect(appShellSource).not.toContain('StageManagerOverlay')
    expect(appShellSource).not.toContain("presentationMode === 'side-dock'")
  })

  it('keeps fullscreen overview as the only teleported Stage Manager overlay', () => {
    expect(stageOverviewSource).toContain('<Teleport to="body">')
    expect(stageOverviewSource).toContain('preferences.stageOverviewOpen')
    expect(stageOverviewSource).toContain('preferences.stageManagerDesktopAvailable')
    expect(stageOverviewSource).toContain('allWindowStages')
    expect(stageOverviewSource).toContain('StageOverviewCard')
    expect(stageOverviewSource).toContain('@click="closeOverviewOnBackdrop"')
    expect(stageOverviewSource).not.toContain('StageDockPanel')
    expect(stageOverviewSource).not.toContain('stage-side-mask')
  })

  it('keeps Stage Rail grouped, left-oriented, and window-only', () => {
    expect(stageRailSource).toContain('StageDockThumb')
    expect(stageRailSource).toContain('orientation="left"')
    expect(stageRailSource).toContain('stage-rail')
    expect(stageRailSource).toContain('activateStageGroup')
    expect(stageRailSource).toContain('enterWindowGroup')
    expect(stageRailSource).toContain('exitWindowGroup')
    expect(stageRailSource).toContain('@activate="activateStage')
    expect(stageRailSource).toContain('stage-rail__window-title')
    expect(stageRailSource).toContain('{{ stageGroup.activeTabTitle }}')
    expect(stageRailSource).toContain('{{ stage.title }}')
    expect(stageRailSource).not.toContain('<Teleport')
    expect(stageRailSource).not.toContain('StageWindowActions')
    expect(stageRailSource).not.toContain('stage-rail__header')
    expect(stageRailSource).not.toContain('StatusPill')
    expect(stageRailSource).not.toContain('{{ stageGroup.label }}')
    expect(stageRailSource).not.toContain("presentationMode === 'side-dock'")
  })

  it('renders a runtime-only ghost for source-to-workspace transitions', () => {
    expect(appShellSource).toContain('<StageTransitionGhost />')
    expect(stageTransitionGhostSource).toContain('preferences.stageTransitionGhost')
    expect(stageTransitionGhostSource).toContain('stage-transition-ghost')
    expect(stageTransitionGhostSource).toContain('prefers-reduced-motion')
    expect(stageTransitionGhostSource).toContain('pointer-events: none;')
  })
})
