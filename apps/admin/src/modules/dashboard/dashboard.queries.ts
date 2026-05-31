import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { getDashboardOverview } from '@/api/dashboard.api'
import type { DashboardOverviewParams, DashboardOverviewResult } from './dashboard.types'

export function useDashboardOverviewQuery(params: Ref<DashboardOverviewParams>): ReturnType<typeof useQuery<DashboardOverviewResult, Error>> {
  return useQuery<DashboardOverviewResult, Error>({
    queryKey: computed(() => ['dashboard', 'overview', { ...params.value }]),
    queryFn: () => getDashboardOverview(params.value)
  })
}
