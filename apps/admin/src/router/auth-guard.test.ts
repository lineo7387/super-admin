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
        false
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
        false
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
        true
      )
    ).toBe('/examples/users/all')
  })
})

describe('post-login redirect', () => {
  it('returns the original internal path after login', () => {
    expect(resolvePostLoginPath('/examples/users/all?page=2')).toBe('/examples/users/all?page=2')
  })

  it('falls back to the dashboard for unsafe redirect values', () => {
    expect(resolvePostLoginPath('https://example.com/admin')).toBe('/examples/dashboard')
    expect(resolvePostLoginPath('//example.com/admin')).toBe('/examples/dashboard')
  })
})
