import { describe, expect, it } from 'vitest'
import appShellSource from '@/shell/AppShell.vue?raw'
import stageOverviewSource from './StageOverview.vue?raw'
import stageRailSource from './StageRail.vue?raw'
import stageTransitionGhostSource from './StageTransitionGhost.vue?raw'
import stageWindowActivationSource from './useStageWindowActivation.ts?raw'

describe('stage manager desktop surfaces', () => {
  it('mounts Stage Rail as a left-side app shell region instead of a teleported side overlay', () => {
    expect(appShellSource).toContain('StageRail')
    expect(appShellSource).toContain('stage-shell-frame')
    expect(appShellSource).toContain('v-if="preferences.stageManagerDesktopAvailable"')
    expect(appShellSource).toContain('class="stage-rail-shell"')
    expect(appShellSource).toContain(':aria-hidden="!showStageRail"')
    expect(appShellSource).toContain(':inert="!showStageRail"')
    expect(appShellSource).toContain('<StageRail />')
    expect(appShellSource).toContain('grid-template-columns: 0rem minmax(0, 1fr);')
    expect(appShellSource).toContain('grid-template-columns: 14rem minmax(0, 1fr);')
    expect(appShellSource).toContain('preferences.stageManagerDesktopAvailable')
    expect(appShellSource).toContain('preferences.stageManager.railEnabled')
    expect(appShellSource).toContain('tabs.state.tabs.length > 1')
    expect(appShellSource).toContain('.stage-rail-shell {')
    expect(appShellSource).toContain('.stage-shell-frame[data-stage-rail-open="true"] .stage-rail-shell')
    expect(appShellSource).toContain('grid-template-columns 300ms')
    expect(appShellSource).not.toContain('<Transition name="stage-rail-shell"')
    expect(appShellSource).not.toContain('<StageRail v-if="showStageRail"')
    expect(appShellSource).not.toContain('StageManagerOverlay')
    expect(appShellSource).not.toContain("presentationMode === 'side-dock'")
  })

  it('drives rail motion and app layout from the same state so neither enter nor leave is staggered', () => {
    expect(appShellSource).toContain(':data-stage-rail-open="showStageRail"')
    expect(appShellSource).toContain('position: relative;')
    expect(appShellSource).toContain('overflow-x: clip;')
    expect(appShellSource).toContain('grid-column: 1;')
    expect(appShellSource).toContain('min-width: 0;')
    expect(appShellSource).toContain('min-height: 100vh;')
    expect(appShellSource).toContain('opacity: 0;')
    expect(appShellSource).toContain('transform: translateX(-100%);')
    expect(appShellSource).toContain('opacity: 1;')
    expect(appShellSource).toContain('transform: translateX(0);')
    expect(appShellSource).toContain('pointer-events: none;')
    expect(appShellSource).toContain('pointer-events: auto;')
    expect(appShellSource).not.toContain('stageRailLeaving')
    expect(appShellSource).not.toContain('@before-leave="keepStageRailFrameOpen"')
    expect(appShellSource).not.toContain('stage-rail-shell-leave-active')
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
    const groupedPreviewBlock = stageRailSource.match(
      /<StageWindowPreview\s+[\s\S]*?:component="stageGroup\.component"[\s\S]*?\/>/
    )?.[0] ?? ''

    expect(stageRailSource).toContain('StageDockThumb')
    expect(stageRailSource).toContain('orientation="left"')
    expect(stageRailSource).toContain('stage-rail')
    expect(stageRailSource).toContain('height: 100%;')
    expect(stageRailSource).toContain('min-height: 100vh;')
    expect(stageRailSource).toContain("import { useStageWindows } from './useStageWindows'")
    expect(stageRailSource).toContain(
      'const { activateStage, closeStage, createWindowView, refreshStage, stageGroups, toggleStagePin } = useStageWindows()'
    )
    expect(stageRailSource).toContain('StageWindowActions')
    expect(stageRailSource).toContain('visibility="reveal"')
    expect(stageRailSource).toContain('activateStageGroup')
    expect(stageRailSource).toContain('enterWindowGroup')
    expect(stageRailSource).toContain('exitWindowGroup')
    expect(stageRailSource).toContain('@activate="activateStage')
    expect(stageRailSource).toContain('stage-rail__window-title')
    expect(stageRailSource).toContain('{{ stageGroup.activeTabTitle }}')
    expect(stageRailSource).toContain('{{ stage.title }}')
    expect(stageRailSource).toContain(':stacked="stageGroup.isStacked"')
    expect(groupedPreviewBlock).not.toContain(':stacked="stageGroup.isStacked"')
    expect(stageRailSource).not.toContain('<Teleport')
    expect(stageRailSource).not.toContain('stage-rail__header')
    expect(stageRailSource).not.toContain('StatusPill')
    expect(stageRailSource).not.toContain('{{ stageGroup.label }}')
    expect(stageRailSource).not.toContain("presentationMode === 'side-dock'")
    expect(stageRailSource).not.toContain('createWorkspaceTabGroups')
    expect(stageRailSource).not.toContain('findActiveModule')
    expect(stageRailSource).not.toContain('registeredModules')
    expect(stageRailSource).not.toContain('stage-rail__preview-stack')
    expect(stageRailSource).not.toContain('stage-rail__stack-card')
  })

  it('shares overview window metadata and action wiring with Stage Rail', () => {
    expect(stageOverviewSource).toContain("import { useStageWindows } from './useStageWindows'")
    expect(stageOverviewSource).toContain(
      'const { activeRoutePath, allWindowStages, closeStage, refreshStage, toggleStagePin, activateStage } = useStageWindows()'
    )
    expect(stageOverviewSource).toContain('@close="closeStage(stage.tab.id)"')
    expect(stageOverviewSource).not.toContain('useWorkspaceTabsStore')
    expect(stageOverviewSource).not.toContain('findActiveModule')
    expect(stageOverviewSource).not.toContain('registeredModules')
  })

  it('renders a runtime-only ghost for source-to-workspace transitions', () => {
    expect(appShellSource).toContain('<StageTransitionGhost />')
    expect(stageTransitionGhostSource).toContain("import { motion, useReducedMotion } from 'motion-v'")
    expect(stageTransitionGhostSource).toContain('preferences.stageTransitionGhost')
    expect(stageTransitionGhostSource).toContain('stage-transition-ghost')
    expect(stageTransitionGhostSource).toContain('pointer-events: none;')
    expect(stageTransitionGhostSource).toContain(':initial="initialRect"')
    expect(stageTransitionGhostSource).toContain(':animate="targetRect"')
    expect(stageTransitionGhostSource).toContain('duration: 0.3')
    expect(stageTransitionGhostSource).toContain('opacity: { duration: 0.3')
    expect(stageTransitionGhostSource).not.toContain('transition:')
    expect(stageTransitionGhostSource).not.toContain('left 320ms')
    expect(stageTransitionGhostSource).not.toContain('top 320ms')
    expect(stageWindowActivationSource).not.toContain('STAGE_TRANSITION_DURATION_MS')
  })

  it('waits for route-mounted targets without coupling cleanup to an animation duration', () => {
    expect(stageWindowActivationSource).toContain('const STAGE_TRANSITION_TARGET_ATTEMPTS')
    expect(stageWindowActivationSource).toContain('waitForStageTransitionTargetRect')
    expect(stageWindowActivationSource).toContain('await waitForStageTransitionSourceFrame()')
    expect(stageWindowActivationSource).toContain('await waitForStageTransitionTargetRect()')
    expect(stageWindowActivationSource).toContain('closeStage: (tabId: string) => Promise<void>')
    expect(stageWindowActivationSource).toContain('const wasActive = tabs.state.activeTabId === tabId')
    expect(stageWindowActivationSource).not.toContain('activePath')
    expect(stageWindowActivationSource.indexOf('await waitForStageTransitionSourceFrame()')).toBeLessThan(
      stageWindowActivationSource.indexOf('await router.push(path)')
    )
    expect(stageWindowActivationSource).not.toContain('setTimeout')
  })
})
