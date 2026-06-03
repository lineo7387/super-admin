import { describe, expect, it } from 'vitest'
import stageManagerOverlaySource from './StageManagerOverlay.vue?raw'

describe('stage manager overlay entry', () => {
  it('opens from shell state instead of rendering a permanent viewport button', () => {
    expect(stageManagerOverlaySource).toContain('preferences.stageManagerOpen')
    expect(stageManagerOverlaySource).not.toContain('fixed right-16 top-3')
    expect(stageManagerOverlaySource).not.toContain('@click="openStageManager"')
  })
})
