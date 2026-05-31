export type WorkbenchJobState = 'running' | 'queued' | 'paused'

export type WorkbenchJobStateFilter = 'all' | WorkbenchJobState

export type WorkbenchPreviewScenario = 'normal' | 'empty' | 'error'

export type WorkbenchJobTone = 'neutral' | 'success' | 'warning' | 'danger'

export type WorkbenchJob = {
  id: string
  name: string
  state: WorkbenchJobState
  stateLabel: string
  tone: WorkbenchJobTone
  eta: string
  owner: string
}

export type WorkbenchJobListParams = {
  state: WorkbenchJobStateFilter
  scenario?: WorkbenchPreviewScenario
}

export type WorkbenchJobListResult = {
  items: WorkbenchJob[]
  total: number
}
