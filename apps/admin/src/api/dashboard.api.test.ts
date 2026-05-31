import { describe, expect, it } from 'vitest'
import { getDashboardOverview } from './dashboard.api'

describe('dashboard api adapter', () => {
  it('returns operations metrics, signals, and activity from mock data', async () => {
    const overview = await getDashboardOverview({ scenario: 'normal' })

    expect(overview.metrics).toHaveLength(4)
    expect(overview.signals.map((signal) => signal.id)).toEqual(['signal-routing', 'api-boundary', 'provider-safety'])
    expect(overview.activity[0]?.message).toContain('Settlement job')
    expect(overview.statusLabel).toBe('Mock mode')
  })

  it('returns empty overview data through a mock data scenario', async () => {
    const overview = await getDashboardOverview({ scenario: 'empty' })

    expect(overview.metrics).toEqual([])
    expect(overview.signals).toEqual([])
    expect(overview.activity).toEqual([])
  })

  it('throws API adapter errors through a mock data scenario', async () => {
    await expect(getDashboardOverview({ scenario: 'error' })).rejects.toThrow('Unable to load dashboard overview')
  })
})
