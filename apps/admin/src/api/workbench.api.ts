import { mockWorkbenchJobs } from '@/api/mock/workbench.mock'
import type { MockWorkbenchJob } from '@/api/mock/workbench.mock'
import type { WorkbenchJob, WorkbenchJobListParams, WorkbenchJobListResult } from '@/modules/workbench/workbench.types'

function normalizeJob(job: MockWorkbenchJob): WorkbenchJob {
  return {
    id: job.jobId,
    name: job.title,
    state: job.status,
    stateLabel: job.statusLabel,
    tone: job.tone,
    eta: job.nextCheckpoint,
    owner: job.ownerTeam
  }
}

function filterJobs(params: WorkbenchJobListParams): WorkbenchJob[] {
  const jobs = mockWorkbenchJobs.map(normalizeJob)

  if (params.state === 'all') {
    return jobs
  }

  return jobs.filter((job) => job.state === params.state)
}

export async function listWorkbenchJobs(params: WorkbenchJobListParams): Promise<WorkbenchJobListResult> {
  if (params.scenario === 'error') {
    throw new Error('Unable to load workbench jobs')
  }

  const items = params.scenario === 'empty' ? [] : filterJobs(params)

  return {
    items,
    total: items.length
  }
}
