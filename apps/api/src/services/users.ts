import { listReferenceUsers } from '../db/queries/users'
import type { UsersListParams, UsersListResult } from '../types'

export async function listUsers(params: UsersListParams): Promise<UsersListResult> {
  return listReferenceUsers(params)
}
