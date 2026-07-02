import { describe, expect, it } from 'vitest'
import type { ModuleManifest } from './module'
import { findActiveModule, findModuleRoute, flattenModuleNav, getVisibleModuleNavTree, isModuleNavItemActive } from './module'

const usersManifest: ModuleManifest = {
  id: 'users',
  name: 'Users',
  nav: {
    label: 'Users',
    path: '/users',
    icon: 'users',
    order: 30,
    children: [
      {
        label: 'People',
        path: '/users/people',
        children: [
          { label: 'All Users', path: '/users/people/all' },
          {
            label: 'Pending Review',
            path: '/users/people/pending',
            children: [{ label: 'Escalated', path: '/users/people/pending/escalated' }]
          }
        ]
      },
      { label: 'Invites', path: '/users/invites' }
    ]
  },
  routes: [],
  permissions: []
}

const accessManifest: ModuleManifest = {
  id: 'access',
  name: 'Access',
  nav: {
    label: 'Access',
    path: '/access',
    icon: 'access',
    order: 40
  },
  routes: [],
  permissions: []
}

const examplesManifest: ModuleManifest = {
  id: 'examples',
  name: 'Examples',
  nav: {
    label: 'Examples',
    path: '/examples/dashboard',
    icon: 'examples',
    order: 10,
    children: [
      { label: 'Dashboard', path: '/examples/dashboard' },
      { label: 'Workbench', path: '/examples/workbench' },
      {
        label: 'Users',
        path: '/examples/users/all',
        children: [
          { label: 'All Users', path: '/examples/users/all' },
          { label: 'Pending Review', path: '/examples/users/pending-review' }
        ]
      },
      { label: 'Access', path: '/examples/access' }
    ]
  },
  routes: [
    {
      path: '/examples/dashboard',
      name: 'examples-dashboard',
      component: {},
      meta: { title: 'Dashboard', keepAlive: { enabled: true } }
    },
    {
      path: '/examples/users/all',
      name: 'examples-users-all',
      component: {},
      meta: { title: 'All Users', keepAlive: { enabled: true } }
    }
  ]
}

const uiKitManifest: ModuleManifest = {
  id: 'ui-kit',
  name: 'UI Kit',
  nav: {
    label: 'UI Kit',
    path: '/ui-kit/foundations',
    icon: 'ui-kit',
    order: 20,
    children: [
      { label: 'Foundations', path: '/ui-kit/foundations' },
      { label: 'Forms', path: '/ui-kit/forms' }
    ]
  },
  routes: [
    {
      path: '/ui-kit/foundations',
      name: 'ui-kit-foundations',
      component: {},
      meta: { title: 'Foundations', keepAlive: { enabled: true } }
    }
  ]
}

describe('module navigation helpers', () => {
  it('finds the active module from child routes outside the parent default path', () => {
    const manifest: ModuleManifest = {
      id: 'users',
      name: 'Users',
      nav: {
        label: 'Users',
        path: '/users/all',
        children: [
          { label: 'All Users', path: '/users/all' },
          { label: 'Invites', path: '/users/invites' }
        ]
      },
      routes: [
        {
          path: '/users/all',
          name: 'users-all',
          component: {},
          meta: { title: 'All Users', keepAlive: { enabled: true } }
        },
        {
          path: '/users/invites',
          name: 'users-invites',
          component: {},
          meta: { title: 'Invites', keepAlive: { enabled: true } }
        }
      ]
    }

    expect(findActiveModule([manifest], '/users/invites')?.id).toBe('users')
    expect(findModuleRoute(manifest, '/users/invites?tab=open')?.name).toBe('users-invites')
  })

  it('finds the active module using the most specific matching path', () => {
    expect(findActiveModule([accessManifest, usersManifest], '/users/people/pending')?.id).toBe('users')
    expect(findActiveModule([usersManifest, accessManifest], '/access/policies')?.id).toBe('access')
  })

  it('treats parent nav items as active when a descendant path matches', () => {
    const people = usersManifest.nav.children?.[0]

    expect(people).toBeDefined()
    expect(isModuleNavItemActive(people, '/users/people/pending')).toBe(true)
    expect(isModuleNavItemActive(people, '/users/invites')).toBe(false)
  })

  it('limits the visible tree depth while preserving deeper source config', () => {
    const visible = getVisibleModuleNavTree(usersManifest.nav, 3)
    const pending = visible.children?.[0]?.children?.[1]

    expect(pending?.label).toBe('Pending Review')
    expect(pending?.children).toEqual([])
    expect(usersManifest.nav.children?.[0]?.children?.[1]?.children?.[0]?.label).toBe('Escalated')
  })

  it('flattens navigation items with level metadata', () => {
    expect(flattenModuleNav(usersManifest.nav, 3).map((item) => `${item.level}:${item.item.label}`)).toEqual([
      '1:Users',
      '2:People',
      '3:All Users',
      '3:Pending Review',
      '2:Invites'
    ])
  })

  it('treats template showcase groups as real first-level modules', () => {
    expect(findActiveModule([examplesManifest, uiKitManifest], '/examples/users/pending-review')?.id).toBe('examples')
    expect(findActiveModule([examplesManifest, uiKitManifest], '/ui-kit/forms')?.id).toBe('ui-kit')
    expect(findModuleRoute(examplesManifest, '/examples/users/all?density=compact')?.name).toBe('examples-users-all')
  })

  it('keeps example domain child routes nested under the Examples tree', () => {
    const users = examplesManifest.nav.children?.find((item) => item.label === 'Users')

    expect(users).toBeDefined()
    expect(isModuleNavItemActive(examplesManifest.nav, '/examples/users/all')).toBe(true)
    expect(isModuleNavItemActive(users, '/examples/users/pending-review')).toBe(true)
    expect(flattenModuleNav(examplesManifest.nav, 3).map((entry) => `${entry.level}:${entry.item.label}`)).toEqual([
      '1:Examples',
      '2:Dashboard',
      '2:Workbench',
      '2:Users',
      '3:All Users',
      '3:Pending Review',
      '2:Access'
    ])
  })
})
