import type { AuthFieldErrors, LoginInput, RegisterInput } from './auth.types'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validateLoginInput(input: LoginInput): AuthFieldErrors<keyof LoginInput> {
  const errors: AuthFieldErrors<keyof LoginInput> = {}

  if (!isValidEmail(input.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!input.password.trim()) {
    errors.password = 'Password is required.'
  }

  return errors
}

export function validateRegisterInput(input: RegisterInput): AuthFieldErrors<keyof RegisterInput> {
  const errors: AuthFieldErrors<keyof RegisterInput> = {}

  if (!input.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!isValidEmail(input.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!input.organization.trim()) {
    errors.organization = 'Workspace name is required.'
  }

  if (input.password.length < 8) {
    errors.password = 'Use at least 8 characters.'
  }

  return errors
}
