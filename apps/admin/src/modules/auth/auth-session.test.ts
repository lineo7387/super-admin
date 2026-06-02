import { describe, expect, it } from 'vitest'
import { createTemplateAuthSession, shouldUseReferenceAuth } from './auth-session'

describe('auth session helpers', () => {
  it('creates a frontend-first template session without requiring a backend', () => {
    expect(createTemplateAuthSession()).toEqual({
      permissions: ['users:read'],
      token: 'template-session-token',
      tokenType: 'Bearer',
      user: {
        email: 'mira.owner@example.com',
        id: 'template-user',
        name: 'Mira Chen',
        role: 'Owner'
      }
    })
  })

  it('uses reference auth only when the optional reference users API is enabled', () => {
    expect(shouldUseReferenceAuth({ VITE_SUPER_ADMIN_USERS_API: 'reference' })).toBe(true)
    expect(shouldUseReferenceAuth({ VITE_SUPER_ADMIN_USERS_API: 'mock' })).toBe(false)
    expect(shouldUseReferenceAuth({ VITE_SUPER_ADMIN_USERS_API: undefined })).toBe(false)
  })
})
