import { afterEach, describe, expect, it, vi } from 'vitest'
import { listUsers } from './users.api'
import { validateUserInput } from '@/modules/users/users.validation'

describe('users api adapter', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

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

  it('throws API adapter errors through a mock data scenario', async () => {
    await expect(
      listUsers({
        page: 1,
        pageSize: 10,
        status: 'all',
        scenario: 'error'
      })
    ).rejects.toThrow('Unable to load users')
  })

  it('requests the optional reference backend when the users API mode is enabled', async () => {
    vi.stubEnv('VITE_SUPER_ADMIN_USERS_API', 'reference')
    vi.stubEnv('VITE_SUPER_ADMIN_API_BASE_URL', 'http://localhost:8787')
    vi.stubEnv('VITE_SUPER_ADMIN_REFERENCE_TOKEN', 'reference-admin-token')

    const fetchMock = vi.fn((): Promise<Response> =>
      Promise.resolve(
        new Response(
          JSON.stringify({
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
              page: 2,
              pageSize: 5,
              total: 1
            }
          }),
          {
            headers: {
              'Content-Type': 'application/json'
            },
            status: 200
          }
        )
      )
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await listUsers({
      page: 2,
      pageSize: 5,
      keyword: 'owner',
      status: 'active',
      scenario: 'error'
    })

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8787/users?page=2&pageSize=5&keyword=owner&status=active', {
      headers: {
        Authorization: 'Bearer reference-admin-token'
      }
    })
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
      page: 2,
      pageSize: 5,
      total: 1
    })
  })

  it('throws when the optional reference backend returns an error', async () => {
    vi.stubEnv('VITE_SUPER_ADMIN_USERS_API', 'reference')
    vi.stubEnv('VITE_SUPER_ADMIN_API_BASE_URL', 'http://localhost:8787')
    vi.stubEnv('VITE_SUPER_ADMIN_REFERENCE_TOKEN', 'reference-admin-token')
    vi.stubGlobal(
      'fetch',
      vi.fn((): Promise<Response> =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              error: {
                code: 'unauthorized',
                message: 'Authentication is required.'
              }
            }),
            {
              headers: {
                'Content-Type': 'application/json'
              },
              status: 401
            }
          )
        )
      )
    )

    await expect(
      listUsers({
        page: 1,
        pageSize: 10,
        status: 'all'
      })
    ).rejects.toThrow('Authentication is required.')
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
