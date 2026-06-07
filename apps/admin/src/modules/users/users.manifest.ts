import type { ModuleManifest } from '@super-admin-org/core'
import UsersActivityPage from './UsersActivityPage.vue'
import UsersAllPage from './UsersAllPage.vue'
import UsersInvitesPage from './UsersInvitesPage.vue'
import UsersPendingReviewPage from './UsersPendingReviewPage.vue'

export const usersManifest: ModuleManifest = {
  id: 'users',
  name: 'Users',
  nav: {
    label: 'Users',
    path: '/users/all',
    icon: 'users',
    order: 30,
    children: [
      {
        label: 'All Users',
        path: '/users/all'
      },
      {
        label: 'Pending Review',
        path: '/users/pending-review'
      },
      {
        label: 'Invites',
        path: '/users/invites'
      },
      {
        label: 'Activity',
        path: '/users/activity'
      }
    ]
  },
  routes: [
    {
      path: '/users/all',
      name: 'users-all',
      component: UsersAllPage,
      meta: {
        title: 'All Users',
        description: 'Demo user administration with table primitives, drawer forms, and mock API scenarios.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/users/pending-review',
      name: 'users-pending-review',
      component: UsersPendingReviewPage,
      meta: {
        title: 'Pending Review',
        description: 'Lightweight review list showing a Users child route.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/users/invites',
      name: 'users-invites',
      component: UsersInvitesPage,
      meta: {
        title: 'User Invites',
        description: 'Secondary Users route for invite workflow scaffolding.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/users/activity',
      name: 'users-activity',
      component: UsersActivityPage,
      meta: {
        title: 'User Activity',
        description: 'Secondary Users route for module activity previews.',
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
