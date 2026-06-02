import { createPageListResult } from '@super-admin/core'
import { mockUsers } from '@/api/mock/users.mock'
import type { MockUser } from '@/api/mock/users.mock'
import { listReferenceUsers, type ReferenceUsersApiConfig } from '@/api/reference/users-reference.api'
import type { UserListParams, UserListResult, UserRecord } from '@/modules/users/users.types'
import { useAuthSessionStore } from '@/stores/auth-session.store'

const LOADING_DELAY_MS = 700

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function matchesKeyword(user: UserRecord, keyword: string): boolean {
  const term = keyword.trim().toLowerCase()
  if (!term) {
    return true
  }

  return [user.name, user.email, user.role, user.status, user.region].some((value) => value.toLowerCase().includes(term))
}

function normalizeUser(user: MockUser): UserRecord {
  return {
    id: user.userId,
    name: user.displayName,
    email: user.emailAddress,
    role: user.roleName,
    status: user.state,
    region: user.regionName,
    notes: user.profileNotes
  }
}

function filterUsers(params: UserListParams): UserRecord[] {
  return mockUsers.map(normalizeUser).filter((user) => {
    const matchesStatus = params.status === 'all' || user.status === params.status

    return matchesStatus && matchesKeyword(user, params.keyword ?? '')
  })
}

function readReferenceUsersApiConfig(env: ImportMetaEnv = import.meta.env): ReferenceUsersApiConfig | null {
  if (env.VITE_SUPER_ADMIN_USERS_API !== 'reference') {
    return null
  }

  const baseUrl = env.VITE_SUPER_ADMIN_API_BASE_URL?.trim()
  const session = useAuthSessionStore()
  const token = session.session?.token ?? env.VITE_SUPER_ADMIN_REFERENCE_TOKEN?.trim()

  if (!baseUrl || !token) {
    throw new Error('Reference users API requires VITE_SUPER_ADMIN_API_BASE_URL and a login session or VITE_SUPER_ADMIN_REFERENCE_TOKEN.')
  }

  return {
    baseUrl,
    token
  }
}

export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const referenceConfig = readReferenceUsersApiConfig()

  if (referenceConfig) {
    return listReferenceUsers(params, referenceConfig)
  }

  if (params.scenario === 'error') {
    throw new Error('Unable to load users')
  }

  if (params.scenario === 'loading') {
    await delay(LOADING_DELAY_MS)
  }

  const filteredUsers = params.scenario === 'empty' ? [] : filterUsers(params)
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return createPageListResult(filteredUsers.slice(start, end), filteredUsers.length, params)
}
