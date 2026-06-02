import { describe, expect, it } from 'vitest'
import {
  buildAdminEnv,
  createSmokeConfig,
  findRequest,
  getReferenceSmokeResult
} from './reference-integration-smoke.mjs'

describe('reference integration smoke helpers', () => {
  it('creates isolated local service URLs from explicit ports', () => {
    expect(createSmokeConfig({ apiPort: 19001, adminPort: 19002 })).toMatchObject({
      apiUrl: 'http://127.0.0.1:19001',
      adminUrl: 'http://127.0.0.1:19002'
    })
  })

  it('sets reference-mode admin env without requiring the fallback reference token', () => {
    expect(buildAdminEnv({ apiUrl: 'http://127.0.0.1:19001' })).toMatchObject({
      VITE_SUPER_ADMIN_API_BASE_URL: 'http://127.0.0.1:19001',
      VITE_SUPER_ADMIN_USERS_API: 'reference'
    })
    expect(buildAdminEnv({ apiUrl: 'http://127.0.0.1:19001' })).not.toHaveProperty('VITE_SUPER_ADMIN_REFERENCE_TOKEN')
  })

  it('finds API requests by method and path', () => {
    const requests = [
      {
        headers: {},
        method: 'POST',
        url: 'http://127.0.0.1:19001/auth/login'
      },
      {
        headers: {
          authorization: 'Bearer reference-admin-token'
        },
        method: 'GET',
        url: 'http://127.0.0.1:19001/users?page=1&pageSize=4&status=all'
      }
    ]

    expect(findRequest(requests, { baseUrl: 'http://127.0.0.1:19001', method: 'GET', path: '/users' })).toEqual(requests[1])
  })

  it('summarizes the real auth token wiring requirements', () => {
    expect(
      getReferenceSmokeResult({
        apiUrl: 'http://127.0.0.1:19001',
        authToken: 'reference-admin-token',
        finalUrl: 'http://127.0.0.1:19002/auth/login?redirect=/examples/users/all',
        requests: [
          {
            headers: {},
            method: 'POST',
            url: 'http://127.0.0.1:19001/auth/login'
          },
          {
            headers: {
              authorization: 'Bearer reference-admin-token'
            },
            method: 'GET',
            url: 'http://127.0.0.1:19001/users?page=1&pageSize=4&status=all'
          }
        ],
        usersTotal: 6
      })
    ).toEqual({
      authLoginPosted: true,
      logoutReturnedToLogin: true,
      usersRenderedFromReferenceApi: true,
      usersRequestedWithLoginToken: true
    })
  })
})
