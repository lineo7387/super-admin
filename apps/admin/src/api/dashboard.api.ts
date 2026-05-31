import { dashboardActivity, dashboardMetrics, dashboardSignals } from '@/api/mock/dashboard.mock'
import type { MockDashboardActivity, MockDashboardMetric, MockDashboardSignal } from '@/api/mock/dashboard.mock'
import type {
  DashboardActivity,
  DashboardMetric,
  DashboardOverviewParams,
  DashboardOverviewResult,
  DashboardSignal
} from '@/modules/dashboard/dashboard.types'

function normalizeMetric(metric: MockDashboardMetric): DashboardMetric {
  return {
    id: metric.metricId,
    label: metric.label,
    value: metric.displayValue,
    meta: metric.trendText,
    tone: metric.tone
  }
}

function normalizeSignal(signal: MockDashboardSignal): DashboardSignal {
  return {
    id: signal.signalId,
    title: signal.heading,
    description: signal.body,
    tone: signal.tone
  }
}

function normalizeActivity(activity: MockDashboardActivity): DashboardActivity {
  return {
    id: activity.activityId,
    message: activity.message
  }
}

export async function getDashboardOverview(params: DashboardOverviewParams = {}): Promise<DashboardOverviewResult> {
  if (params.scenario === 'error') {
    throw new Error('Unable to load dashboard overview')
  }

  if (params.scenario === 'empty') {
    return {
      statusLabel: 'Mock mode',
      metrics: [],
      signals: [],
      activity: []
    }
  }

  return {
    statusLabel: 'Mock mode',
    metrics: dashboardMetrics.map(normalizeMetric),
    signals: dashboardSignals.map(normalizeSignal),
    activity: dashboardActivity.map(normalizeActivity)
  }
}
