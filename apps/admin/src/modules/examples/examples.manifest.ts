import type { ModuleManifest } from '@super-admin-org/core'
import AccessPage from '../access/AccessPage.vue'
import DashboardPage from '../dashboard/DashboardPage.vue'
import TemplateGuidePage from './TemplateGuidePage.vue'
import UsersActivityPage from '../users/UsersActivityPage.vue'
import UsersAllPage from '../users/UsersAllPage.vue'
import UsersInvitesPage from '../users/UsersInvitesPage.vue'
import UsersPendingReviewPage from '../users/UsersPendingReviewPage.vue'
import WorkbenchPage from '../workbench/WorkbenchPage.vue'

export const examplesManifest: ModuleManifest = {
  id: 'examples',
  name: 'Examples',
  nav: {
    label: 'Examples',
    path: '/examples/template-guide',
    icon: 'examples',
    order: 10,
    children: [
      {
        label: 'Template Guide',
        path: '/examples/template-guide'
      },
      {
        label: 'Dashboard',
        path: '/examples/dashboard'
      },
      {
        label: 'Charts',
        path: '/examples/charts',
        icon: 'charts'
      },
      {
        label: 'Workbench',
        path: '/examples/workbench'
      },
      {
        label: 'Users',
        path: '/examples/users/all',
        children: [
          {
            label: 'All Users',
            path: '/examples/users/all'
          },
          {
            label: 'Pending Review',
            path: '/examples/users/pending-review'
          },
          {
            label: 'Invites',
            path: '/examples/users/invites'
          },
          {
            label: 'Activity',
            path: '/examples/users/activity'
          }
        ]
      },
      {
        label: 'Access',
        path: '/examples/access'
      }
    ]
  },
  routes: [
    {
      path: '/examples/template-guide',
      name: 'examples-template-guide',
      component: TemplateGuidePage,
      meta: {
        title: 'Template Guide',
        description: 'Frontend-first map for mock data, API adapters, queries, and module reshaping.',
        regions: ['summary', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/dashboard',
      name: 'examples-dashboard',
      component: DashboardPage,
      meta: {
        title: 'Operations Dashboard',
        description: 'Live control surface for revenue, risk, jobs, and audit signals.',
        regions: ['summary', 'primary', 'activity', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/charts',
      name: 'examples-charts',
      component: () => import('../charts/ChartsPage.vue'),
      meta: {
        title: 'Charts',
        description: 'Theme-adapted ECharts examples that users can keep, override, or remove.',
        regions: ['summary', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/workbench',
      name: 'examples-workbench',
      component: WorkbenchPage,
      meta: {
        title: 'Operations Workbench',
        description: 'Queue-oriented workspace for scheduled jobs and operator handoffs.',
        regions: ['tools', 'primary', 'activity'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/users/all',
      name: 'examples-users-all',
      component: UsersAllPage,
      meta: {
        title: 'All Users',
        description: 'Demo user administration with table primitives, drawer forms, and mock API scenarios.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/users/pending-review',
      name: 'examples-users-pending-review',
      component: UsersPendingReviewPage,
      meta: {
        title: 'Pending Review',
        description: 'Lightweight review list showing a Users child route.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/users/invites',
      name: 'examples-users-invites',
      component: UsersInvitesPage,
      meta: {
        title: 'User Invites',
        description: 'Secondary Users route for invite workflow scaffolding.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/users/activity',
      name: 'examples-users-activity',
      component: UsersActivityPage,
      meta: {
        title: 'User Activity',
        description: 'Secondary Users route for module activity previews.',
        regions: ['tools', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/examples/access',
      name: 'examples-access',
      component: AccessPage,
      meta: {
        title: 'Access Control',
        description: 'Frontend-level permission metadata for demo navigation and actions.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    }
  ],
  permissions: [
    {
      action: 'examples:view',
      description: 'View copyable template examples.'
    }
  ]
}
