import { describe, expect, it } from 'vitest'
import type { ModuleManifest } from '@super-admin-org/core'
import { createAppModuleRegistry } from './app-module-registry'
import { defaultAuthenticatedPath, moduleCompatibilityRedirects } from './module-registry'

function createManifest(id: string, order: number, routePath: string): ModuleManifest {
  return {
    id,
    name: id,
    nav: {
      label: id,
      order,
      path: routePath
    },
    routes: [
      {
        component: {},
        meta: {
          keepAlive: {
            enabled: true
          },
          title: id
        },
        name: id,
        path: routePath
      }
    ]
  }
}

describe('app module registry', () => {
  it('preserves the default Examples entry and its compatibility redirects', () => {
    expect({
      defaultAuthenticatedPath,
      moduleCompatibilityRedirects
    }).toMatchObject({
      defaultAuthenticatedPath: '/examples/dashboard',
      moduleCompatibilityRedirects: expect.arrayContaining([
        {
          path: '/dashboard',
          redirect: '/examples/dashboard'
        },
        {
          path: '/users',
          redirect: '/examples/users/all'
        }
      ])
    })
  })

  it('derives the authenticated entry from the first ordered registration', () => {
    const secondary = createManifest('secondary', 20, '/secondary')
    const primary = createManifest('primary', 10, '/primary')
    const registry = createAppModuleRegistry(
      [
        {
          manifest: secondary
        },
        {
          defaultPath: '/primary',
          manifest: primary,
          redirects: [
            {
              path: '/legacy-primary',
              redirect: '/primary'
            }
          ]
        }
      ],
      {
        emptyPath: '/workspace'
      }
    )

    expect(registry.manifests.map((manifest) => manifest.id)).toEqual(['primary', 'secondary'])
    expect(registry.defaultAuthenticatedPath).toBe('/primary')
    expect(registry.redirects).toEqual([
      {
        path: '/legacy-primary',
        redirect: '/primary'
      }
    ])
  })

  it('uses the explicit neutral route when no modules are registered', () => {
    expect(
      createAppModuleRegistry([], {
        emptyPath: '/workspace'
      })
    ).toEqual({
      defaultAuthenticatedPath: '/workspace',
      manifests: [],
      redirects: []
    })
  })

  it('rejects entry paths and redirect targets that are not owned by the module', () => {
    const manifest = createManifest('users', 10, '/users')

    expect(() =>
      createAppModuleRegistry(
        [
          {
            defaultPath: '/missing',
            manifest
          }
        ],
        {
          emptyPath: '/workspace'
        }
      )
    ).toThrow('Module "users" default path "/missing" must match one of its routes.')

    expect(() =>
      createAppModuleRegistry(
        [
          {
            manifest,
            redirects: [
              {
                path: '/legacy-users',
                redirect: '/missing'
              }
            ]
          }
        ],
        {
          emptyPath: '/workspace'
        }
      )
    ).toThrow('Module "users" redirect target "/missing" must match one of its routes.')
  })

  it('rejects compatibility paths that collide with another redirect or registered route', () => {
    const users = createManifest('users', 10, '/users')
    const access = createManifest('access', 20, '/access')

    expect(() =>
      createAppModuleRegistry(
        [
          {
            manifest: users,
            redirects: [
              {
                path: '/legacy',
                redirect: '/users'
              }
            ]
          },
          {
            manifest: access,
            redirects: [
              {
                path: '/legacy',
                redirect: '/access'
              }
            ]
          }
        ],
        {
          emptyPath: '/workspace'
        }
      )
    ).toThrow('Duplicate app module redirect path "/legacy".')

    expect(() =>
      createAppModuleRegistry(
        [
          {
            manifest: users,
            redirects: [
              {
                path: '/access',
                redirect: '/users'
              }
            ]
          },
          {
            manifest: access
          }
        ],
        {
          emptyPath: '/workspace'
        }
      )
    ).toThrow('App module redirect path "/access" conflicts with a registered module route.')
  })

  it('normalizes trailing slashes when validating entries and redirect collisions', () => {
    const users = createManifest('users', 10, '/users')
    const access = createManifest('access', 20, '/access')

    expect(
      createAppModuleRegistry(
        [
          {
            defaultPath: '/users/',
            manifest: users
          }
        ],
        {
          emptyPath: '/workspace'
        }
      ).defaultAuthenticatedPath
    ).toBe('/users/')

    expect(() =>
      createAppModuleRegistry(
        [
          {
            manifest: users,
            redirects: [
              {
                path: '/legacy/',
                redirect: '/users'
              }
            ]
          },
          {
            manifest: access,
            redirects: [
              {
                path: '/legacy',
                redirect: '/access'
              }
            ]
          }
        ],
        {
          emptyPath: '/workspace'
        }
      )
    ).toThrow('Duplicate app module redirect path "/legacy".')

    expect(() =>
      createAppModuleRegistry(
        [
          {
            manifest: users,
            redirects: [
              {
                path: '/access/',
                redirect: '/users'
              }
            ]
          },
          {
            manifest: access
          }
        ],
        {
          emptyPath: '/workspace'
        }
      )
    ).toThrow('App module redirect path "/access/" conflicts with a registered module route.')
  })
})
