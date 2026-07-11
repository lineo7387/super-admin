import type { UserRole } from '@/modules/users/users.types'

export type AuthFieldErrors<Field extends string = string> = Partial<Record<Field, string>>

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
  role: UserRole
}

export type AuthSession = {
  permissions: string[]
  token: string
  tokenType: 'Bearer'
  user: AuthUser
}
