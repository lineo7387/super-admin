import { createMiddleware } from 'hono/factory'
import { ApiError } from './errors'
import type { ApiEnv, Permission } from '../types'

export function requirePermission(permission: Permission) {
  return createMiddleware<ApiEnv>(async (context, next) => {
    const session = context.var.session

    if (!session.authenticated) {
      throw new ApiError(401, 'unauthorized', 'Authentication is required.')
    }

    if (!session.permissions.includes(permission)) {
      throw new ApiError(403, 'forbidden', 'Permission is required.')
    }

    await next()
  })
}
