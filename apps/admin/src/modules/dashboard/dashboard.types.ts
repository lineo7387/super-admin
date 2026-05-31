export type DashboardPreviewScenario = 'normal' | 'empty' | 'error'

export type DashboardMetricTone = 'neutral' | 'success' | 'warning' | 'danger'

export type DashboardSignalIcon = 'signal-routing' | 'api-boundary' | 'provider-safety'

export type DashboardMetric = {
  id: string
  label: string
  value: string
  meta: string
  tone: DashboardMetricTone
}

export type DashboardSignal = {
  id: DashboardSignalIcon
  title: string
  description: string
  tone: DashboardMetricTone
}

export type DashboardActivity = {
  id: string
  message: string
}

export type DashboardOverviewParams = {
  scenario?: DashboardPreviewScenario
}

export type DashboardOverviewResult = {
  statusLabel: string
  metrics: DashboardMetric[]
  signals: DashboardSignal[]
  activity: DashboardActivity[]
}
