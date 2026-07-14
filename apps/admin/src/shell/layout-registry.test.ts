import { describe, expect, it } from 'vitest'
import type { AppLayoutRegistration } from './layout-registry'
import { appLayoutRegistry, createAppLayoutRegistry, neutralLayoutRegistration, resolveAppLayoutRegistration } from './layout-registry'
import NeutralLayout from './layouts/NeutralLayout.vue'

describe('app layout registry', () => {
  it('registers each built-in layout with its component and presentation metadata', () => {
    expect(appLayoutRegistry.map((registration) => registration.preset.id)).toEqual(['tri-column', 'dual-column', 'top-header'])

    for (const registration of appLayoutRegistry) {
      expect(registration.component).toBeDefined()
      expect(registration.preview.stage.gridTemplateColumns).not.toBe('')
      expect(registration.preview.stage.gridTemplateRows).not.toBe('')
      expect(registration.preview.compact.gridTemplateColumns).not.toMatch(/\drem/)
      expect(registration.preview.compact.gridTemplateRows).not.toMatch(/\drem/)
    }
  })

  it('resolves a custom registration without changing shell consumers', () => {
    const customRegistration: AppLayoutRegistration = {
      component: NeutralLayout,
      preset: {
        id: 'custom-layout',
        name: 'Custom layout',
        description: 'A custom shell layout.',
        regions: ['primary']
      },
      preview: {
        compact: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: '0.75fr 3fr'
        },
        stage: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: '4rem minmax(0, 1fr)'
        },
        showDock: false,
        showSidebar: false,
        showTopNavigation: true
      }
    }

    const registry = createAppLayoutRegistry([customRegistration])

    expect(resolveAppLayoutRegistration('custom-layout', registry)).toBe(customRegistration)
  })

  it('uses an explicit neutral layout for unknown IDs', () => {
    const resolved = resolveAppLayoutRegistration('missing-layout')

    expect(resolved).toBe(neutralLayoutRegistration)
    expect(resolved.preset.id).toBe('neutral')
    expect(resolved.preview).toMatchObject({
      compact: {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateRows: 'minmax(0, 1fr)'
      },
      showDock: false,
      showSidebar: false,
      showTopNavigation: false
    })
  })

  it('rejects duplicate layout IDs when constructing a registry', () => {
    expect(() => createAppLayoutRegistry([appLayoutRegistry[0]!, appLayoutRegistry[0]!])).toThrow('Duplicate app layout id "tri-column"')
  })
})
