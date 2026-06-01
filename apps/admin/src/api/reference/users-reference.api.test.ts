import { describe, expect, it } from 'vitest'
import { normalizeReferenceUsersResponse } from './users-reference.api'

describe('reference users api adapter normalization', () => {
  it('normalizes the optional reference backend users response into the module result shape', () => {
    const result = normalizeReferenceUsersResponse(
      {
        data: {
          items: [
            {
              email: 'mira.owner@example.com',
              id: 'u-1001',
              name: 'Mira Chen',
              notes: 'Owns workspace policy and billing approvals.',
              region: 'Singapore',
              role: 'Owner',
              status: 'active'
            }
          ],
          page: 1,
          pageSize: 10,
          total: 1
        }
      },
      {
        page: 1,
        pageSize: 10,
        status: 'all'
      }
    )

    expect(result).toEqual({
      items: [
        {
          email: 'mira.owner@example.com',
          id: 'u-1001',
          name: 'Mira Chen',
          notes: 'Owns workspace policy and billing approvals.',
          region: 'Singapore',
          role: 'Owner',
          status: 'active'
        }
      ],
      page: 1,
      pageSize: 10,
      total: 1
    })
  })
})
