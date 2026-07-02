import type { UserFormErrors, UserFormInput } from './users.types'
import { translateAdminMessage, type MessageTranslator } from '@/i18n'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateUserInput(input: UserFormInput, t: MessageTranslator = translateAdminMessage): UserFormErrors {
  const errors: UserFormErrors = {}

  if (!input.name.trim()) {
    errors.name = t('validation.nameRequired')
  }

  if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = t('validation.email')
  }

  if (!input.role) {
    errors.role = t('validation.roleRequired')
  }

  if (!input.status) {
    errors.status = t('validation.statusRequired')
  }

  return errors
}
