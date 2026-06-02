import { createPageListResult } from '@super-admin/core'
import type { UserListParams, UserListResult, UserRecord } from '@/modules/users/users.types'

export type ReferenceUsersApiConfig = {
  baseUrl: string
  token: string
}

export type ReferenceUsersResponse = {
  data: {
    items: UserRecord[]
    total: number
    page: number
    pageSize: number
  }
}

type ReferenceApiErrorResponse = {
  error?: {
    message?: string
  }
}

export function normalizeReferenceUsersResponse(response: ReferenceUsersResponse, params: UserListParams): UserListResult {
  return createPageListResult(response.data.items, response.data.total, {
    page: response.data.page ?? params.page,
    pageSize: response.data.pageSize ?? params.pageSize
  })
}

function createUsersUrl(params: UserListParams, baseUrl: string): string {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize)
  })
  const keyword = params.keyword?.trim()

  if (keyword) {
    query.set('keyword', keyword)
  }

  query.set('status', params.status)

  return `${baseUrl.replace(/\/$/, '')}/users?${query.toString()}`
}

async function readReferenceError(response: Response): Promise<string> {
  const fallbackMessage = `Reference users request failed with status ${response.status}.`

  try {
    const body = (await response.json()) as ReferenceApiErrorResponse

    return body.error?.message ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export async function listReferenceUsers(params: UserListParams, config: ReferenceUsersApiConfig): Promise<UserListResult> {
  const response = await fetch(createUsersUrl(params, config.baseUrl), {
    headers: {
      Authorization: `Bearer ${config.token}`
    }
  })

  if (!response.ok) {
    throw new Error(await readReferenceError(response))
  }

  return normalizeReferenceUsersResponse((await response.json()) as ReferenceUsersResponse, params)
}
