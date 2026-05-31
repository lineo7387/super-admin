import { describe, expect, it } from 'vitest'
import { listUsers } from './users.service'
import { validateUserInput } from './users.validation'

describe('users service', () => {
  it('filters and paginates normal mock users', async () => {
    const result = await listUsers({
      page: 1,
      pageSize: 2,
      keyword: 'owner',
      status: 'all',
      scenario: 'normal'
    })

    expect(result.items).toHaveLength(2)
    expect(result.total).toBeGreaterThanOrEqual(2)
    expect(result.items.every((user) => [user.name, user.email, user.role].some((value) => value.toLowerCase().includes('owner')))).toBe(
      true
    )
  })

  it('returns empty results through a mock data scenario', async () => {
    const result = await listUsers({
      page: 1,
      pageSize: 10,
      status: 'all',
      scenario: 'empty'
    })

    expect(result.items).toEqual([])
    expect(result.total).toBe(0)
  })

  it('throws service errors through a mock data scenario', async () => {
    await expect(
      listUsers({
        page: 1,
        pageSize: 10,
        status: 'all',
        scenario: 'error'
      })
    ).rejects.toThrow('Unable to load users')
  })
})

describe('users validation', () => {
  it('returns field errors for missing required fields and invalid email', () => {
    expect(
      validateUserInput({
        name: '',
        email: 'not-an-email',
        role: '',
        status: '',
        region: '',
        notes: ''
      })
    ).toEqual({
      name: 'Name is required.',
      email: 'Enter a valid email address.',
      role: 'Role is required.',
      status: 'Status is required.'
    })
  })
})
