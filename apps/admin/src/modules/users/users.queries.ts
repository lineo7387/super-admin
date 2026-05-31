import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { listUsers } from './users.service'
import type { UserListParams, UserListResult } from './users.types'

export function useUsersQuery(params: Ref<UserListParams>) {
  return useQuery<UserListResult, Error>({
    queryKey: computed(() => ['users', 'list', { ...params.value }]),
    queryFn: () => listUsers(params.value)
  })
}
