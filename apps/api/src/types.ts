export type UserStatus = 'active' | 'review' | 'paused'

export type UserStatusFilter = 'all' | UserStatus

export type UserRole = 'Owner' | 'Operator' | 'Auditor' | 'Analyst'

export type Permission = 'users:read'

export type ApiUser = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  region: string
  notes?: string
}

export type CurrentUser = Pick<ApiUser, 'id' | 'name' | 'email' | 'role'>

export type SessionContext = {
  authenticated: boolean
  user: CurrentUser | null
  permissions: Permission[]
}

export type ApiEnv = {
  Variables: {
    session: SessionContext
  }
}

export type UsersListParams = {
  page: number
  pageSize: number
  keyword?: string
  status: UserStatusFilter
}

export type UsersListResult = {
  items: ApiUser[]
  total: number
  page: number
  pageSize: number
}
