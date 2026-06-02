import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthSessionStore } from './auth-session.store'

function createMemoryStorage(): Storage {
  const values = new Map<string, string>()

  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value)
  }
}

describe('auth session store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('window', {
      localStorage: createMemoryStorage()
    })
    window.localStorage.clear()
  })

  it('persists reference login sessions', () => {
    const session = useAuthSessionStore()

    session.setReferenceSession({
      permissions: ['users:read'],
      token: 'reference-admin-token',
      tokenType: 'Bearer',
      user: {
        email: 'mira.owner@example.com',
        id: 'u-1001',
        name: 'Mira Chen',
        role: 'Owner'
      }
    })

    expect(session.isAuthenticated).toBe(true)
    expect(session.authorizationHeader).toBe('Bearer reference-admin-token')
    expect(JSON.parse(window.localStorage.getItem('super-admin:auth-session') ?? '{}')).toEqual({
      permissions: ['users:read'],
      token: 'reference-admin-token',
      tokenType: 'Bearer',
      user: {
        email: 'mira.owner@example.com',
        id: 'u-1001',
        name: 'Mira Chen',
        role: 'Owner'
      }
    })
  })

  it('clears stored sessions', () => {
    const session = useAuthSessionStore()

    session.setReferenceSession({
      permissions: [],
      token: 'reference-auditor-token',
      tokenType: 'Bearer',
      user: {
        email: 'ana.auditor@example.com',
        id: 'u-1003',
        name: 'Ana Torres',
        role: 'Auditor'
      }
    })

    session.clearSession()

    expect(session.isAuthenticated).toBe(false)
    expect(session.authorizationHeader).toBeUndefined()
    expect(window.localStorage.getItem('super-admin:auth-session')).toBeNull()
  })
})
