import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { apiError, type ApiErrorBody } from './http'

export class ApiError extends Error {
  readonly code: string
  readonly status: ContentfulStatusCode
  readonly fields?: Record<string, string>

  constructor(status: ContentfulStatusCode, code: string, message: string, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

export function toApiErrorBody(error: ApiError): ApiErrorBody {
  return apiError(error.code, error.message, error.fields)
}

export function notFoundError(): ApiErrorBody {
  return apiError('not_found', 'Route not found.')
}

export function internalServerError(): ApiErrorBody {
  return apiError('internal_server_error', 'Internal server error.')
}
