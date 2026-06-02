import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'

export const DEFAULT_AUTHENTICATED_PATH = '/examples/dashboard'
export const LOGIN_PATH = '/auth/login'

type GuardTarget = Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'meta'> & {
  query?: Record<string, unknown>
}

function readRedirectQuery(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return undefined
}

export function resolvePostLoginPath(redirect: unknown): string {
  const path = readRedirectQuery(redirect)

  if (!path?.startsWith('/') || path.startsWith('//') || path.startsWith('/auth/')) {
    return DEFAULT_AUTHENTICATED_PATH
  }

  return path
}

export function resolveAuthRedirect(to: GuardTarget, isAuthenticated: boolean): RouteLocationRaw | null {
  const isAuthRoute = to.meta.authLayout === true

  if (isAuthRoute) {
    return isAuthenticated ? resolvePostLoginPath(to.query?.redirect) : null
  }

  if (isAuthenticated) {
    return null
  }

  return {
    path: LOGIN_PATH,
    query: {
      redirect: to.fullPath
    }
  }
}
