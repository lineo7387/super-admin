import type { ModuleManifest } from '@super-admin/core'
import UsersPage from './UsersPage.vue'

export const usersManifest: ModuleManifest = {
  id: 'users',
  name: 'Users',
  nav: {
    label: 'Users',
    path: '/users',
    icon: 'users',
    order: 30
  },
  routes: [
    {
      path: '/users',
      name: 'users',
      component: UsersPage,
      meta: {
        title: 'Users',
        description: 'Demo user administration with local filter state preserved by workspace tabs.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    }
  ],
  permissions: [
    {
      action: 'users:manage',
      description: 'View and update demo user records.'
    }
  ]
}
