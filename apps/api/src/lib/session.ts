import { createMiddleware } from 'hono/factory'
import { findReferenceUserById } from '../db/queries/users'
import type { ApiEnv, CurrentUser, Permission, SessionContext } from '../types'

const referenceSessions: Record<string, { userId: string; permissions: Permission[] }> = {
  'reference-admin-token': {
    userId: 'u-1001',
    permissions: ['users:read']
  },
  'reference-auditor-token': {
    userId: 'u-1003',
    permissions: []
  }
}

export const anonymousSession: SessionContext = {
  authenticated: false,
  permissions: [],
  user: null
}

function readBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authorizationHeader.slice('Bearer '.length).trim()

  return token || null
}

function toCurrentUser(user: Awaited<ReturnType<typeof findReferenceUserById>>): CurrentUser | null {
  if (!user) {
    return null
  }

  return {
    email: user.email,
    id: user.id,
    name: user.name,
    role: user.role
  }
}

export async function resolveSession(authorizationHeader: string | undefined): Promise<SessionContext> {
  const token = readBearerToken(authorizationHeader)

  if (!token) {
    return anonymousSession
  }

  const referenceSession = referenceSessions[token]

  if (!referenceSession) {
    return anonymousSession
  }

  const user = toCurrentUser(await findReferenceUserById(referenceSession.userId))

  if (!user) {
    return anonymousSession
  }

  return {
    authenticated: true,
    permissions: referenceSession.permissions,
    user
  }
}

export const sessionMiddleware = createMiddleware<ApiEnv>(async (context, next) => {
  context.set('session', await resolveSession(context.req.header('Authorization')))
  await next()
})
