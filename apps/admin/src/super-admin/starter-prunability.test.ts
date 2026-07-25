import { describe, expect, it } from 'vitest'
import authTypesSource from '@/modules/auth/auth.types.ts?raw'
import loginPageSource from '@/modules/auth/LoginPage.vue?raw'
import routerIndexSource from '@/router/index.ts?raw'
import authGuardSource from '@/router/auth-guard.ts?raw'
import workspaceTabsSource from '@/workspace/WorkspaceTabs.vue?raw'
import stageWindowActivationSource from '@/workspace/useStageWindowActivation.ts?raw'

const baseInfrastructureSources = {
  'router/auth-guard.ts': authGuardSource,
  'router/index.ts': routerIndexSource,
  'workspace/useStageWindowActivation.ts': stageWindowActivationSource,
  'workspace/WorkspaceTabs.vue': workspaceTabsSource
}

describe('starter prunability wiring', () => {
  it.each(Object.entries(baseInfrastructureSources))('keeps removable example paths out of base infrastructure: %s', (_relativePath, source) => {
    expect(source).not.toContain('/examples/')
  })

  it('routes every authenticated fallback through the module registry contract', () => {
    for (const source of [routerIndexSource, loginPageSource, workspaceTabsSource, stageWindowActivationSource]) {
      expect(source).toContain('defaultAuthenticatedPath')
    }
  })

  it('keeps auth contracts independent from removable examples', () => {
    expect(authTypesSource).not.toContain('@/modules/users/')
    expect(authTypesSource).toContain('export type AuthUserRole')
  })
})
