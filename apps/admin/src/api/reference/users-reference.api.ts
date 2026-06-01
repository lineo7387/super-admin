import { createPageListResult } from '@super-admin/core'
import type { UserListParams, UserListResult, UserRecord } from '@/modules/users/users.types'

export type ReferenceUsersResponse = {
  data: {
    items: UserRecord[]
    total: number
    page: number
    pageSize: number
  }
}

export function normalizeReferenceUsersResponse(response: ReferenceUsersResponse, params: UserListParams): UserListResult {
  return createPageListResult(response.data.items, response.data.total, {
    page: response.data.page ?? params.page,
    pageSize: response.data.pageSize ?? params.pageSize
  })
}
