import { describe, expect, it } from 'vitest'
import type { ModuleManifest } from './module'
import { composeModuleManifest, createModuleRegistry, mountModuleManifest } from './module'

function createManifest(overrides: Partial<ModuleManifest> = {}): ModuleManifest {
  return {
    id: 'users',
    name: 'Users',
    nav: {
      label: 'Users',
      path: '/users/all',
      icon: 'users',
      order: 30,
      children: [
        { label: 'All Users', path: '/users/all' },
        { label: 'Pending Review', path: '/users/pending-review' }
      ]
    },
    routes: [
      {
        path: '/users/all',
        name: 'users-all',
        component: {},
        meta: { title: 'All Users', regions: ['primary'], keepAlive: { enabled: true } }
      },
      {
        path: '/users/pending-review',
        name: 'users-pending-review',
        component: {},
        meta: { title: 'Pending Review', keepAlive: { enabled: false, reason: 'review queue' } }
      }
    ],
    permissions: [{ action: 'users:manage', description: 'Manage users.' }],
    ...overrides
  }
}

describe('module manifest composition', () => {
  it('mounts routes and nested navigation immutably under a path and route-name namespace', () => {
    const source = createManifest()
    const snapshot = structuredClone(source)

    const mounted = mountModuleManifest(source, {
      pathPrefix: '/examples/',
      routeNamePrefix: 'examples'
    })

    expect(mounted).not.toBe(source)
    expect(mounted.nav).not.toBe(source.nav)
    expect(mounted.routes[0]).not.toBe(source.routes[0])
    expect(mounted.nav.path).toBe('/examples/users/all')
    expect(mounted.nav.children?.map((item) => item.path)).toEqual(['/examples/users/all', '/examples/users/pending-review'])
    expect(mounted.routes.map((route) => [route.path, route.name])).toEqual([
      ['/examples/users/all', 'examples-users-all'],
      ['/examples/users/pending-review', 'examples-users-pending-review']
    ])
    expect(source).toEqual(snapshot)
  })

  it('composes ordered feature manifests into one navigation group without redefining their routes', () => {
    const dashboard = mountModuleManifest(
      createManifest({
        id: 'dashboard',
        name: 'Dashboard',
        nav: { label: 'Dashboard', path: '/dashboard', order: 10 },
        routes: [
          {
            path: '/dashboard',
            name: 'dashboard',
            component: {},
            meta: { title: 'Dashboard', keepAlive: { enabled: true } }
          }
        ],
        permissions: [{ action: 'dashboard:view', description: 'View dashboard.' }]
      }),
      { pathPrefix: '/examples', routeNamePrefix: 'examples' }
    )
    const users = mountModuleManifest(createManifest(), { pathPrefix: '/examples', routeNamePrefix: 'examples' })

    const group = composeModuleManifest({
      id: 'examples',
      name: 'Examples',
      nav: { label: 'Examples', path: '/examples/dashboard', icon: 'examples', order: 10 },
      modules: [users, dashboard],
      permissions: [{ action: 'examples:view', description: 'View examples.' }]
    })

    expect(group.nav.children?.map((item) => item.label)).toEqual(['Dashboard', 'Users'])
    expect(group.routes.map((route) => route.name)).toEqual(['examples-dashboard', 'examples-users-all', 'examples-users-pending-review'])
    expect(group.permissions?.map((permission) => permission.action)).toEqual(['examples:view', 'dashboard:view', 'users:manage'])
  })

  it.each([
    ['module id', createManifest(), createManifest({ name: 'Other users' }), 'Duplicate module id "users"'],
    [
      'module nav path',
      createManifest(),
      createManifest({ id: 'review', nav: { label: 'Review', path: '/users/all' }, routes: [] }),
      'Duplicate module nav path "/users/all"'
    ],
    [
      'route path',
      createManifest(),
      createManifest({
        id: 'review',
        nav: { label: 'Review', path: '/review' },
        routes: [
          {
            path: '/users/all/',
            name: 'review-all',
            component: {},
            meta: { title: 'Review', keepAlive: { enabled: true } }
          }
        ]
      }),
      'Duplicate module route path "/users/all"'
    ],
    [
      'route name',
      createManifest(),
      createManifest({
        id: 'review',
        nav: { label: 'Review', path: '/review' },
        routes: [
          {
            path: '/review',
            name: 'users-all',
            component: {},
            meta: { title: 'Review', keepAlive: { enabled: true } }
          }
        ]
      }),
      'Duplicate module route name "users-all"'
    ]
  ])('rejects a duplicate %s while constructing a registry', (_label, first, second, message) => {
    expect(() => createModuleRegistry([first, second])).toThrow(message)
  })
})
