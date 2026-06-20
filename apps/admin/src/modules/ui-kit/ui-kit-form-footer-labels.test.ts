import { describe, expect, it } from 'vitest'
import actionsSource from './UiKitActionsPage.vue?raw'
import formsSource from './UiKitFormsPage.vue?raw'
import overlaysSource from './UiKitOverlaysPage.vue?raw'

describe('UI Kit AdminFormFooter call sites pass localized labels', () => {
  it('UiKitActionsPage passes cancel, dirty, and clean labels from common.primitives', () => {
    expect(actionsSource).toContain(':cancel-label="t(\'common.primitives.cancel\')"')
    expect(actionsSource).toContain(':dirty-label="t(\'common.primitives.unsavedChanges\')"')
    expect(actionsSource).toContain(':clean-label="t(\'common.primitives.noChanges\')"')
  })

  it('UiKitFormsPage passes cancel, submitting, dirty, and clean labels from common.primitives', () => {
    expect(formsSource).toContain(':cancel-label="t(\'common.primitives.cancel\')"')
    expect(formsSource).toContain(':submitting-label="t(\'common.primitives.saving\')"')
    expect(formsSource).toContain(':dirty-label="t(\'common.primitives.unsavedChanges\')"')
    expect(formsSource).toContain(':clean-label="t(\'common.primitives.noChanges\')"')
  })

  it('UiKitOverlaysPage passes cancel, dirty, and clean labels from common.primitives', () => {
    expect(overlaysSource).toContain(':cancel-label="t(\'common.primitives.cancel\')"')
    expect(overlaysSource).toContain(':dirty-label="t(\'common.primitives.unsavedChanges\')"')
    expect(overlaysSource).toContain(':clean-label="t(\'common.primitives.noChanges\')"')
  })
})
