import { describe, expect, it } from 'vitest'
import type { ModuleManifest } from './module'
import {
  findActiveModule,
  findModuleRoute,
  flattenModuleNav,
  getVisibleModuleNavTree,
  isModuleNavItemActive
} from './module'

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
})
