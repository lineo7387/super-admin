import { mockUsers } from '@/api/mock/users.mock'
import type { MockUser } from '@/api/mock/users.mock'
import type { UserListParams, UserListResult, UserRecord } from '@/modules/users/users.types'

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

export async function listUsers(params: UserListParams): Promise<UserListResult> {
  if (params.scenario === 'error') {
    throw new Error('Unable to load users')
  }

  if (params.scenario === 'loading') {
    await delay(LOADING_DELAY_MS)
  }

  const filteredUsers = params.scenario === 'empty' ? [] : filterUsers(params)
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    items: filteredUsers.slice(start, end),
    total: filteredUsers.length,
    page: params.page,
    pageSize: params.pageSize
  }
}
