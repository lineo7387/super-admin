// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'
import { router } from './index'
import { moduleRoutes } from './routes'

describe('module routes', () => {
  it('materializes compatibility redirects owned by registered modules', () => {
    expect(moduleRoutes).toEqual(
      expect.arrayContaining([
        {
          path: '/dashboard',
          redirect: '/examples/dashboard'
        },
        {
          path: '/users',
          redirect: '/examples/users/all'
        }
      ])
    )
  })

  it('keeps a neutral authenticated route for an empty module registry', () => {
    const emptyWorkspaceRoute = router.getRoutes().find((route) => route.path === '/workspace')

    expect(emptyWorkspaceRoute).toMatchObject({
      meta: {
        keepAlive: {
          enabled: false
        },
        title: 'Workspace setup',
        workspaceTitle: 'Workspace setup'
      },
      name: 'workspace-empty',
      path: '/workspace'
    })
    expect(emptyWorkspaceRoute?.components?.default).toBeTypeOf('function')
  })
})
