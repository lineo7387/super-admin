export type MockWorkbenchJobStatus = 'running' | 'queued' | 'paused'

export type MockWorkbenchJob = {
  jobId: string
  title: string
  status: MockWorkbenchJobStatus
  statusLabel: string
  tone: 'neutral' | 'success' | 'warning' | 'danger'
  nextCheckpoint: string
  ownerTeam: string
}

export const mockWorkbenchJobs: MockWorkbenchJob[] = [
  {
    jobId: 'settlement-sync',
    title: 'Settlement Sync',
    status: 'running',
    statusLabel: 'Running',
    tone: 'success',
    nextCheckpoint: '04:22',
    ownerTeam: 'Treasury Ops'
  },
  {
    jobId: 'risk-reconcile',
    title: 'Risk Reconcile',
    status: 'queued',
    statusLabel: 'Queued',
    tone: 'warning',
    nextCheckpoint: '12:05',
    ownerTeam: 'Risk Desk'
  },
  {
    jobId: 'access-review',
    title: 'Access Review',
    status: 'paused',
    statusLabel: 'Paused',
    tone: 'neutral',
    nextCheckpoint: 'Manual',
    ownerTeam: 'Security'
  }
]
