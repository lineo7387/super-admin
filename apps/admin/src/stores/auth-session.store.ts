import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import type { AuthSession } from '@/modules/auth/auth.types'

const STORAGE_KEY = 'super-admin:auth-session'

function getStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage
}

function readStoredSession(): AuthSession | null {
  const raw = getStorage()?.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (typeof parsed === 'object' && parsed !== null && 'token' in parsed) {
      return parsed as AuthSession
    }
  } catch {
    return null
  }

  return null
}

export const useAuthSessionStore = defineStore('authSession', () => {
  const session = shallowRef<AuthSession | null>(readStoredSession())

  const isAuthenticated = computed(() => session.value !== null)
  const authorizationHeader = computed(() => (session.value ? `${session.value.tokenType} ${session.value.token}` : undefined))
  const currentUser = computed(() => session.value?.user ?? null)

  function setReferenceSession(nextSession: AuthSession): void {
    session.value = nextSession
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(nextSession))
  }

  function clearSession(): void {
    session.value = null
    getStorage()?.removeItem(STORAGE_KEY)
  }

  return {
    authorizationHeader,
    clearSession,
    currentUser,
    isAuthenticated,
    session,
    setReferenceSession
  }
})
