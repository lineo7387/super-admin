import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getAccessMatrix } from '@/api/access.api'
import type { AccessMatrixParams, AccessMatrixResult } from './access.types'

export function useAccessMatrixQuery(params: Ref<AccessMatrixParams>): ReturnType<typeof useQuery<AccessMatrixResult, Error>> {
  return useQuery<AccessMatrixResult, Error>({
    queryKey: computed(() => ['access', 'matrix', { ...params.value }]),
    queryFn: () => getAccessMatrix(params.value)
  })
}
