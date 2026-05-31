import type { UserFormErrors, UserFormInput } from './users.types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateUserInput(input: UserFormInput): UserFormErrors {
  const errors: UserFormErrors = {}

  if (!input.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!input.role) {
    errors.role = 'Role is required.'
  }

  if (!input.status) {
    errors.status = 'Status is required.'
  }

  return errors
}
