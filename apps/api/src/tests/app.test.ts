import { describe, expect, it } from 'vitest'
import { createApiApp } from '../app'
import { referenceAdminAuthHeaders, referenceAuditorAuthHeaders } from '../lib/testing'

describe('reference api app', () => {
  it('returns health status', async () => {
    const app = createApiApp()

    const response = await app.request('/health')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      data: {
        service: 'super-admin-api',
        status: 'ok'
      }
    })
  })

  it('returns an anonymous current-user session by default', async () => {
    const app = createApiApp()

    const response = await app.request('/session/current-user')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      data: {
        authenticated: false,
        permissions: [],
        user: null
      }
    })
  })

  it('logs in with reference credentials and returns a bearer token', async () => {
    const app = createApiApp()

    const response = await app.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'mira.owner@example.com',
        password: 'reference-admin'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
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
    })
  })

  it('rejects invalid reference login credentials', async () => {
    const app = createApiApp()

    const response = await app.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'mira.owner@example.com',
        password: 'wrong-password'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'invalid_credentials',
        message: 'Email or password is incorrect.'
      }
    })
  })

  it('validates reference login input', async () => {
    const app = createApiApp()

    const response = await app.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'not-an-email',
        password: ''
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'validation_failed',
        fields: {
          email: 'Enter a valid email address.',
          password: 'Password is required.'
        },
        message: 'Request validation failed.'
      }
    })
  })

  it('returns an authenticated current user from the reference session boundary', async () => {
    const app = createApiApp()

    const response = await app.request('/session/current-user', {
      headers: referenceAdminAuthHeaders()
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      data: {
        authenticated: true,
        permissions: ['users:read'],
        user: {
          email: 'mira.owner@example.com',
          id: 'u-1001',
          name: 'Mira Chen',
          role: 'Owner'
        }
      }
    })
  })

  it('requires users:read permission before listing users', async () => {
    const app = createApiApp()

    const response = await app.request('/users')

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'unauthorized',
        message: 'Authentication is required.'
      }
    })
  })

  it('forbids authenticated sessions without users:read permission', async () => {
    const app = createApiApp()

    const response = await app.request('/users', {
      headers: referenceAuditorAuthHeaders()
    })

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'forbidden',
        message: 'Permission is required.'
      }
    })
  })

  it('validates users list query parameters', async () => {
    const app = createApiApp()

    const response = await app.request('/users?page=0&pageSize=500&status=unknown', {
      headers: referenceAdminAuthHeaders()
    })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'validation_failed',
        fields: {
          page: 'Page must be at least 1.',
          pageSize: 'Page size must be between 1 and 100.',
          status: 'Status must be active, review, paused, or all.'
        },
        message: 'Request validation failed.'
      }
    })
  })

  it('lists users through the query boundary', async () => {
    const app = createApiApp()

    const response = await app.request('/users?page=1&pageSize=2&keyword=owner&status=all', {
      headers: referenceAdminAuthHeaders()
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
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
          },
          {
            email: 'priya.owner@example.com',
            id: 'u-1005',
            name: 'Priya Rao',
            notes: 'Secondary owner for regional operations.',
            region: 'Bangalore',
            role: 'Owner',
            status: 'review'
          }
        ],
        page: 1,
        pageSize: 2,
        total: 2
      }
    })
  })
})
