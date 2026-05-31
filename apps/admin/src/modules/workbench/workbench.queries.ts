import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { listWorkbenchJobs } from '@/api/workbench.api'
import type { WorkbenchJobListParams, WorkbenchJobListResult } from './workbench.types'

export function useWorkbenchJobsQuery(params: Ref<WorkbenchJobListParams>): ReturnType<typeof useQuery<WorkbenchJobListResult, Error>> {
  return useQuery<WorkbenchJobListResult, Error>({
    queryKey: computed(() => ['workbench', 'jobs', { ...params.value }]),
    queryFn: () => listWorkbenchJobs(params.value)
  })
}
