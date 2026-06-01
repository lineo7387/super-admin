export type PagePaginationParams = {
  page: number
  pageSize: number
}

export type ListResult<Item> = {
  items: Item[]
  total: number
}

export type PageListResult<Item> = ListResult<Item> & PagePaginationParams

export type CursorPaginationParams = {
  cursor?: string
  limit: number
}

export type CursorListResult<Item> = {
  items: Item[]
  nextCursor?: string
  hasMore: boolean
}

export type SortDirection = 'asc' | 'desc'

export type SortParam<Field extends string = string> = {
  field: Field
  direction: SortDirection
}

export type FieldErrors<Field extends string = string> = Partial<Record<Field, string>>

export type MutationSuccess<Result = undefined> = {
  ok: true
  message?: string
  data?: Result
}

export type MutationFailure<Field extends string = string> = {
  ok: false
  message: string
  fieldErrors?: FieldErrors<Field>
}

export type MutationResult<Result = undefined, Field extends string = string> =
  | MutationSuccess<Result>
  | MutationFailure<Field>

export type AdapterErrorCode = 'unknown' | 'network' | 'unauthorized' | 'forbidden' | 'not-found' | 'validation'

export type AdapterErrorPayload = {
  code: AdapterErrorCode
  message: string
  status?: number
}

export type ProviderRequirement = 'none' | 'optional' | 'required'

export type CapabilityState =
  | { state: 'available'; providerRequirement?: ProviderRequirement }
  | { state: 'not-configured'; providerRequirement: Exclude<ProviderRequirement, 'none'>; providerName?: string; message: string }
  | { state: 'unavailable'; reason: string; message: string }

export function createPageListResult<Item>(
  items: Item[],
  total: number,
  pagination: PagePaginationParams
): PageListResult<Item> {
  return {
    items,
    total,
    page: pagination.page,
    pageSize: pagination.pageSize
  }
}

export function createCursorListResult<Item>(
  items: Item[],
  options: { hasMore: boolean; nextCursor?: string }
): CursorListResult<Item> {
  return {
    items,
    hasMore: options.hasMore,
    ...(options.nextCursor === undefined ? {} : { nextCursor: options.nextCursor })
  }
}

export function createMutationSuccess<Result = undefined>(
  data?: Result,
  message?: string
): MutationSuccess<Result> {
  return {
    ok: true,
    ...(message ? { message } : {}),
    ...(data === undefined ? {} : { data })
  }
}

export function createMutationFailure<Field extends string = string>(
  message: string,
  fieldErrors?: FieldErrors<Field>
): MutationFailure<Field> {
  return {
    ok: false,
    message,
    ...(fieldErrors ? { fieldErrors } : {})
  }
}

export function normalizeAdapterError(error: unknown, fallbackMessage = 'Request failed'): AdapterErrorPayload {
  if (error instanceof Error) {
    return {
      code: 'unknown',
      message: error.message || fallbackMessage
    }
  }

  return {
    code: 'unknown',
    message: fallbackMessage
  }
}
