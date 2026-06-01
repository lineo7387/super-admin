import { apiError, type ApiErrorBody } from './http'

export type ValidationIssue = {
  path: PropertyKey[]
  message: string
}

export type ValidationErrorLike = {
  issues: ValidationIssue[]
}

export function formatZodFieldErrors(error: ValidationErrorLike): Record<string, string> {
  const fields: Record<string, string> = {}

  for (const issue of error.issues) {
    const key = issue.path.join('.')

    if (key && fields[key] === undefined) {
      fields[key] = issue.message
    }
  }

  return fields
}

export function validationErrorBody(error: ValidationErrorLike): ApiErrorBody {
  return apiError('validation_failed', 'Request validation failed.', formatZodFieldErrors(error))
}
