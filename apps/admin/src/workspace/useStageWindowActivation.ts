import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences.store'
import { useWorkspaceTabsStore } from '@/stores/workspace-tabs.store'

const STAGE_TRANSITION_TARGET_SELECTOR = '[data-stage-transition-target]'
const STAGE_TRANSITION_TARGET_ATTEMPTS = 8

function waitForAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

function getStageTransitionTargetRect(): DOMRect | null {
  const rect = document.querySelector<HTMLElement>(STAGE_TRANSITION_TARGET_SELECTOR)?.getBoundingClientRect() ?? null
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return null
  }

  return rect
}

async function waitForStageTransitionSourceFrame(): Promise<void> {
  await nextTick()
  await waitForAnimationFrame()
}

async function waitForStageTransitionTargetRect(): Promise<DOMRect | null> {
  for (let attempt = 0; attempt < STAGE_TRANSITION_TARGET_ATTEMPTS; attempt += 1) {
    await nextTick()
    await waitForAnimationFrame()

    const targetRect = getStageTransitionTargetRect()
    if (targetRect) {
      return targetRect
    }
  }

  return null
}

export function useStageWindowActivation(): {
  activateStage: (path: string, title: string, sourceRect: DOMRect) => Promise<void>
  closeStage: (tabId: string, activePath: string) => Promise<void>
  refreshStage: (tabId: string) => void
  toggleStagePin: (tabId: string) => void
} {
  const preferences = usePreferencesStore()
  const router = useRouter()
  const tabs = useWorkspaceTabsStore()

  async function activateStage(path: string, title: string, sourceRect: DOMRect): Promise<void> {
    preferences.startStageTransition(sourceRect, title)
    await waitForStageTransitionSourceFrame()
    tabs.activateTab(path)
    await router.push(path)

    const targetRect = await waitForStageTransitionTargetRect()
    if (targetRect) {
      preferences.finishStageTransition(targetRect)
      return
    }

    preferences.clearStageTransition()
  }

  async function closeStage(tabId: string, activePath: string): Promise<void> {
    const next = tabs.closeTab(tabId)
    if (activePath === tabId && next) {
      await router.push(next.routePath)
      return
    }

    if (activePath === tabId) {
      await router.push('/examples/dashboard')
    }
  }

  function toggleStagePin(tabId: string): void {
    tabs.pinTab(tabId)
  }

  function refreshStage(tabId: string): void {
    tabs.refreshTab(tabId)
  }

  return {
    activateStage,
    closeStage,
    refreshStage,
    toggleStagePin
  }
}
