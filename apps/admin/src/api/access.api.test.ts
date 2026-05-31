import { describe, expect, it } from 'vitest'
import { getAccessMatrix } from './access.api'

describe('access api adapter', () => {
  it('returns frontend permission metadata without requiring an auth provider', async () => {
    const matrix = await getAccessMatrix({ scenario: 'normal' })

    expect(matrix.roles.map((role) => role.name)).toEqual(['Owner', 'Operator', 'Auditor'])
    expect(matrix.providerRequirement).toBe('none')
    expect(matrix.integrationNote).toContain('reshape the page, types')
  })

  it('returns empty matrix data through a mock data scenario', async () => {
    const matrix = await getAccessMatrix({ scenario: 'empty' })

    expect(matrix.roles).toEqual([])
    expect(matrix.providerRequirement).toBe('none')
  })

  it('throws API adapter errors through a mock data scenario', async () => {
    await expect(getAccessMatrix({ scenario: 'error' })).rejects.toThrow('Unable to load access matrix')
  })
})
