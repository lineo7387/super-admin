import { describe, expect, it } from 'vitest'
import { authRoutes } from './auth-routes'

describe('auth routes', () => {
  it('registers standalone auth layout routes', () => {
    expect(authRoutes.find((route) => route.path === '/auth')?.redirect).toBe('/auth/login')
    expect(authRoutes.find((route) => route.path === '/auth/login')?.meta).toMatchObject({
      authLayout: true,
      workspaceTitle: 'Sign in'
    })
    expect(authRoutes.find((route) => route.path === '/auth/register')?.meta).toMatchObject({
      authLayout: true,
      workspaceTitle: 'Create account'
    })
  })
})
