import type { AuthSession } from './auth.types'

type AuthEnv = {
  VITE_SUPER_ADMIN_USERS_API?: 'mock' | 'reference'
}

export function shouldUseReferenceAuth(env?: AuthEnv): boolean {
  return (env?.VITE_SUPER_ADMIN_USERS_API ?? import.meta.env.VITE_SUPER_ADMIN_USERS_API) === 'reference'
}

export function createTemplateAuthSession(): AuthSession {
  return {
    permissions: ['users:read'],
    token: 'template-session-token',
    tokenType: 'Bearer',
    user: {
      email: 'mira.owner@example.com',
      id: 'template-user',
      name: 'Mira Chen',
      role: 'Owner'
    }
  }
}
