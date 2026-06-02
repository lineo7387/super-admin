import type { ReferenceSessionPayload } from '@/api/reference/auth-reference.api'

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

export type AuthSession = ReferenceSessionPayload
