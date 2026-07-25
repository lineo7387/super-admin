import { describe, expect, it } from 'vitest'
import { resolveAuthRedirect, resolvePostLoginPath } from './auth-guard'

describe('auth route guard', () => {
  it('redirects logged-out workspace routes to login with the original path', () => {
    expect(
      resolveAuthRedirect(
        {
          fullPath: '/examples/users/all?page=2',
          meta: {}
        },
        false,
        '/examples/dashboard'
      )
    ).toEqual({
      path: '/auth/login',
      query: {
        redirect: '/examples/users/all?page=2'
      }
    })
  })

  it('allows logged-out auth routes', () => {
    expect(
      resolveAuthRedirect(
        {
          fullPath: '/auth/login',
          meta: {
            authLayout: true
          }
        },
        false,
        '/examples/dashboard'
      )
    ).toBeNull()
  })

  it('redirects authenticated visitors away from auth routes', () => {
    expect(
      resolveAuthRedirect(
        {
          fullPath: '/auth/register',
          meta: {
            authLayout: true
          },
          query: {
            redirect: '/examples/users/all'
          }
        },
        true,
        '/ui-kit/foundations'
      )
    ).toBe('/examples/users/all')
  })

  it('uses the registry fallback when an authenticated auth route has no safe redirect', () => {
    expect(
      resolveAuthRedirect(
        {
          fullPath: '/auth/login',
          meta: {
            authLayout: true
          }
        },
        true,
        '/ui-kit/foundations'
      )
    ).toBe('/ui-kit/foundations')
  })
})

describe('post-login redirect', () => {
  it('returns the original internal path after login', () => {
    expect(resolvePostLoginPath('/examples/users/all?page=2', '/ui-kit/foundations')).toBe('/examples/users/all?page=2')
  })

  it('uses the registry fallback for unsafe redirect values', () => {
    expect(resolvePostLoginPath('https://example.com/admin', '/ui-kit/foundations')).toBe('/ui-kit/foundations')
    expect(resolvePostLoginPath('//example.com/admin', '/ui-kit/foundations')).toBe('/ui-kit/foundations')
    expect(resolvePostLoginPath('/auth/register', '/ui-kit/foundations')).toBe('/ui-kit/foundations')
    expect(resolvePostLoginPath(undefined, '/ui-kit/foundations')).toBe('/ui-kit/foundations')
  })
})
