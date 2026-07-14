import { describe, expect, it } from 'vitest'
import { registeredModules } from '@/modules/module-registry'
import { neutralLayoutRegistration, resolveAppLayoutRegistration } from '@/shell/layout-registry'

describe('starter extension contracts', () => {
  it('keeps registered module routes unique', () => {
    const routes = registeredModules.flatMap((manifest) => manifest.routes)

    expect(new Set(routes.map((route) => route.path)).size).toBe(routes.length)
    expect(new Set(routes.map((route) => route.name)).size).toBe(routes.length)
  })

  it('uses the neutral shell when a layout has not been registered', () => {
    expect(resolveAppLayoutRegistration('custom-layout')).toBe(neutralLayoutRegistration)
  })
})
