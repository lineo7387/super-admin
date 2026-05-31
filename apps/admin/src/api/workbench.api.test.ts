import { describe, expect, it } from 'vitest'
import { listWorkbenchJobs } from './workbench.api'

describe('workbench api adapter', () => {
  it('returns mock jobs with operational state labels', async () => {
    const result = await listWorkbenchJobs({ state: 'all', scenario: 'normal' })

    expect(result.items).toHaveLength(3)
    expect(result.items.map((job) => job.id)).toEqual(['settlement-sync', 'risk-reconcile', 'access-review'])
    expect(result.total).toBe(3)
  })

  it('filters jobs by state', async () => {
    const result = await listWorkbenchJobs({ state: 'queued', scenario: 'normal' })

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.id).toBe('risk-reconcile')
    expect(result.total).toBe(1)
  })

  it('throws API adapter errors through a mock data scenario', async () => {
    await expect(listWorkbenchJobs({ state: 'all', scenario: 'error' })).rejects.toThrow('Unable to load workbench jobs')
  })
})
