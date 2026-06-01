export type ApiSuccess<Data> = {
  data: Data
  meta?: Record<string, unknown>
}

export type ApiErrorBody = {
  error: {
    code: string
    message: string
    fields?: Record<string, string>
  }
}

export function apiSuccess<Data>(data: Data, meta?: Record<string, unknown>): ApiSuccess<Data> {
  return {
    data,
    ...(meta ? { meta } : {})
  }
}

export function apiError(code: string, message: string, fields?: Record<string, string>): ApiErrorBody {
  return {
    error: {
      code,
      message,
      ...(fields ? { fields } : {})
    }
  }
}
