export type AuthFieldErrors<Field extends string = string> = Partial<Record<Field, string>>

export type AuthUserRole = 'Owner' | 'Operator' | 'Auditor' | 'Analyst'

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  name: string
  email: string
  organization: string
  password: string
}

export type AuthUser = {
  email: string
  id: string
  name: string
  role: AuthUserRole
}

export type AuthSession = {
  permissions: string[]
  token: string
  tokenType: 'Bearer'
  user: AuthUser
}
