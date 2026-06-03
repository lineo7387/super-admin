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

  it('does not keep context as a permanent layout rail', () => {
    expect(triColumnSource).not.toContain('<slot name="context"')
    expect(dualColumnSource).not.toContain('<slot name="context"')
    expect(topHeaderSource).not.toContain('<slot name="context"')
    expect(dualColumnSource).not.toContain('context-rail')
    expect(topHeaderSource).not.toContain('context-rail')
  })
})
