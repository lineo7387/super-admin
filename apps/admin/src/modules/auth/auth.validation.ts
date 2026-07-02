import type { AuthFieldErrors, LoginInput, RegisterInput } from './auth.types'
import { translateAdminMessage, type MessageTranslator } from '@/i18n'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validateLoginInput(input: LoginInput, t: MessageTranslator = translateAdminMessage): AuthFieldErrors<keyof LoginInput> {
  const errors: AuthFieldErrors<keyof LoginInput> = {}

  if (!isValidEmail(input.email)) {
    errors.email = t('validation.email')
  }

  if (!input.password.trim()) {
    errors.password = t('validation.passwordRequired')
  }

  return errors
}

export function validateRegisterInput(input: RegisterInput, t: MessageTranslator = translateAdminMessage): AuthFieldErrors<keyof RegisterInput> {
  const errors: AuthFieldErrors<keyof RegisterInput> = {}

  if (!input.name.trim()) {
    errors.name = t('validation.nameRequired')
  }

  if (!isValidEmail(input.email)) {
    errors.email = t('validation.email')
  }

  if (!input.organization.trim()) {
    errors.organization = t('validation.workspaceRequired')
  }

  if (input.password.length < 8) {
    errors.password = t('validation.passwordMin')
  }

  return errors
}
