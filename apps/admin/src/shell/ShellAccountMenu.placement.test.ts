import { describe, expect, it } from 'vitest'
import dualColumnSource from './layouts/DualColumnLayout.vue?raw'
import topHeaderSource from './layouts/TopHeaderLayout.vue?raw'
import triColumnSource from './layouts/TriColumnLayout.vue?raw'

describe('shell account menu placement', () => {
  it('places the compact account menu at the bottom of the tri-column logo rail', () => {
    expect(triColumnSource).toContain("import ShellAccountMenu from '../ShellAccountMenu.vue'")
    expect(triColumnSource).toContain('<ShellAccountMenu variant="dock"')
    expect(triColumnSource).toContain('mt-auto')
  })

  it('places the account menu at the bottom of the dual-column navigation rail', () => {
    expect(dualColumnSource).toContain("import ShellAccountMenu from '../ShellAccountMenu.vue'")
    expect(dualColumnSource).toContain('<ShellAccountMenu variant="sidebar"')
    expect(dualColumnSource).toContain('mt-auto')
  })

  it('keeps the account menu in the top-header actions slot for header-first layouts', () => {
    expect(topHeaderSource).toContain("import ShellAccountMenu from '../ShellAccountMenu.vue'")
    expect(topHeaderSource).toContain('<template #actions>')
    expect(topHeaderSource).toContain('<ShellAccountMenu variant="header"')
  })

  it('keeps context in a dedicated side rail instead of blending into workspace content', () => {
    expect(dualColumnSource).toContain('context-rail')
    expect(topHeaderSource).toContain('context-rail')
    expect(dualColumnSource).toContain('xl:grid-cols-[minmax(0,1fr)_320px]')
    expect(topHeaderSource).toContain('xl:grid-cols-[minmax(0,1fr)_320px]')
  })
})
