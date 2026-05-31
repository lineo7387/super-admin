export type UserStatus = 'active' | 'review' | 'paused'

export type UserRole = 'Owner' | 'Operator' | 'Auditor' | 'Analyst'

export type UserPreviewScenario = 'normal' | 'loading' | 'empty' | 'error'

export type UserRecord = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  region: string
  notes?: string
}

export type UserStatusFilter = 'all' | UserStatus

export type UserListParams = {
  page: number
  pageSize: number
  keyword?: string
  status: UserStatusFilter
  scenario?: UserPreviewScenario
}

export type UserListResult = {
  items: UserRecord[]
  total: number
  page: number
  pageSize: number
}

export type UserFormInput = {
  name: string
  email: string
  role: UserRole | ''
  status: UserStatus | ''
  region: string
  notes: string
}

export type UserFormErrors = Partial<Record<keyof UserFormInput, string>>
