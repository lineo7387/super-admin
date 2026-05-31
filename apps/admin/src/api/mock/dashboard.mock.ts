export type MockDashboardTone = 'neutral' | 'success' | 'warning' | 'danger'

export type MockDashboardMetric = {
  metricId: string
  label: string
  displayValue: string
  trendText: string
  tone: MockDashboardTone
}

export type MockDashboardSignal = {
  signalId: 'signal-routing' | 'api-boundary' | 'provider-safety'
  heading: string
  body: string
  tone: MockDashboardTone
}

export type MockDashboardActivity = {
  activityId: string
  message: string
}

export const dashboardMetrics: MockDashboardMetric[] = [
  { metricId: 'revenue-flow', label: 'Revenue Flow', displayValue: '$847K', trendText: '+12.8% today', tone: 'success' },
  { metricId: 'open-jobs', label: 'Open Jobs', displayValue: '128', trendText: '14 need review', tone: 'warning' },
  { metricId: 'audit-events', label: 'Audit Events', displayValue: '2.4K', trendText: 'normal drift', tone: 'neutral' },
  { metricId: 'risk-holds', label: 'Risk Holds', displayValue: '7', trendText: '3 high priority', tone: 'danger' }
]

export const dashboardSignals: MockDashboardSignal[] = [
  {
    signalId: 'signal-routing',
    heading: 'Signal routing',
    body: 'Layouts can change without rewriting feature pages.',
    tone: 'success'
  },
  {
    signalId: 'api-boundary',
    heading: 'API boundary',
    body: 'Pages, types, queries, and API adapters can evolve together for real workflows.',
    tone: 'neutral'
  },
  {
    signalId: 'provider-safety',
    heading: 'Provider safety',
    body: 'AI starts unavailable instead of pretending to be connected.',
    tone: 'warning'
  }
]

export const dashboardActivity: MockDashboardActivity[] = [
  { activityId: 'settlement-job-complete', message: 'Settlement job completed across 12 regions' },
  { activityId: 'access-policy-update', message: 'Access policy updated for finance operators' },
  { activityId: 'tab-cache-warmed', message: 'New workspace tab cache warmed for Users' },
  { activityId: 'ai-provider-unconfigured', message: 'AI provider remains unconfigured by default' }
]
