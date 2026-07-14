import { describe, expect, it } from 'vitest'
import { resolveHorizontalNavDropdownPosition } from './primary-nav-floating-menu'

describe('resolveHorizontalNavDropdownPosition', () => {
  it('centers the dropdown below a trigger when it fits in the viewport', () => {
    expect(
      resolveHorizontalNavDropdownPosition({
        trigger: { bottom: 48, left: 400, width: 112 },
        viewportWidth: 1200
      })
    ).toEqual({ left: 368, top: 54, width: 176 })
  })

  it('clamps the first dropdown to the viewport safe area', () => {
    expect(
      resolveHorizontalNavDropdownPosition({
        trigger: { bottom: 96, left: 0, width: 112 },
        viewportWidth: 1200
      })
    ).toEqual({ left: 8, top: 102, width: 176 })
  })

  it('clamps the last dropdown and its width on narrow viewports', () => {
    expect(
      resolveHorizontalNavDropdownPosition({
        trigger: { bottom: 72, left: 280, width: 112 },
        viewportWidth: 360
      })
    ).toEqual({ left: 176, top: 78, width: 176 })

    expect(
      resolveHorizontalNavDropdownPosition({
        trigger: { bottom: 72, left: 0, width: 112 },
        viewportWidth: 160
      })
    ).toEqual({ left: 8, top: 78, width: 144 })
  })
})
