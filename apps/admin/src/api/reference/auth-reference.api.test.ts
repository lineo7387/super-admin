import { afterEach, describe, expect, it, vi } from 'vitest'
import { loginReferenceSession } from './auth-reference.api'

describe('reference auth api adapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('logs in to the optional reference backend and returns the session payload', async () => {
    const fetchMock = vi.fn((): Promise<Response> =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              permissions: ['users:read'],
              token: 'reference-admin-token',
              tokenType: 'Bearer',
              user: {
                email: 'mira.owner@example.com',
                id: 'u-1001',
                name: 'Mira Chen',
                role: 'Owner'
              }
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

    const result = await loginReferenceSession(
      {
        email: 'mira.owner@example.com',
        password: 'reference-admin'
      },
      {
        baseUrl: 'http://localhost:8787'
      }
    )

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8787/auth/login', {
      body: JSON.stringify({
        email: 'mira.owner@example.com',
        password: 'reference-admin'
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    expect(result).toEqual({
      permissions: ['users:read'],
      token: 'reference-admin-token',
      tokenType: 'Bearer',
      user: {
        email: 'mira.owner@example.com',
        id: 'u-1001',
        name: 'Mira Chen',
        role: 'Owner'
      }
    })
  })

  it('throws the reference backend login error message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((): Promise<Response> =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              error: {
                code: 'invalid_credentials',
                message: 'Email or password is incorrect.'
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
      loginReferenceSession(
        {
          email: 'mira.owner@example.com',
          password: 'wrong-password'
        },
        {
          baseUrl: 'http://localhost:8787'
        }
      )
    ).rejects.toThrow('Email or password is incorrect.')
  })
})
