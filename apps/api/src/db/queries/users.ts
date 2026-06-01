import type { ApiUser, UserStatusFilter, UsersListParams, UsersListResult } from '../../types'

const referenceUsers: ApiUser[] = [
  {
    id: 'u-1001',
    name: 'Mira Chen',
    email: 'mira.owner@example.com',
    role: 'Owner',
    status: 'active',
    region: 'Singapore',
    notes: 'Owns workspace policy and billing approvals.'
  },
  {
    id: 'u-1002',
    name: 'Jon Bell',
    email: 'jon.operator@example.com',
    role: 'Operator',
    status: 'review',
    region: 'New York',
    notes: 'Pending expanded access review.'
  },
  {
    id: 'u-1003',
    name: 'Ana Torres',
    email: 'ana.auditor@example.com',
    role: 'Auditor',
    status: 'active',
    region: 'Madrid',
    notes: 'Reviews monthly access exports.'
  },
  {
    id: 'u-1004',
    name: 'Kai Martin',
    email: 'kai.analyst@example.com',
    role: 'Analyst',
    status: 'paused',
    region: 'Berlin',
    notes: 'Paused while contract renewal is reviewed.'
  },
  {
    id: 'u-1005',
    name: 'Priya Rao',
    email: 'priya.owner@example.com',
    role: 'Owner',
    status: 'review',
    region: 'Bangalore',
    notes: 'Secondary owner for regional operations.'
  },
  {
    id: 'u-1006',
    name: 'Luca Moretti',
    email: 'luca.operator@example.com',
    role: 'Operator',
    status: 'active',
    region: 'Milan',
    notes: 'Coordinates daily workspace handoffs.'
  }
]

function matchesStatus(user: ApiUser, status: UserStatusFilter): boolean {
  return status === 'all' || user.status === status
}

function matchesKeyword(user: ApiUser, keyword: string): boolean {
  const term = keyword.trim().toLowerCase()

  if (!term) {
    return true
  }

  return [user.name, user.email, user.role, user.status, user.region].some((value) => value.toLowerCase().includes(term))
}

export async function findReferenceUserById(id: string): Promise<ApiUser | null> {
  return referenceUsers.find((user) => user.id === id) ?? null
}

export async function listReferenceUsers(params: UsersListParams): Promise<UsersListResult> {
  const filteredUsers = referenceUsers.filter((user) => matchesStatus(user, params.status) && matchesKeyword(user, params.keyword ?? ''))
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    items: filteredUsers.slice(start, end),
    total: filteredUsers.length,
    page: params.page,
    pageSize: params.pageSize
  }
}
