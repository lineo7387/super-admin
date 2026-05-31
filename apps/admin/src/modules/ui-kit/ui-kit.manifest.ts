import type { ModuleManifest } from '@super-admin/core'
import UiKitActionsPage from './UiKitActionsPage.vue'
import UiKitFeedbackPage from './UiKitFeedbackPage.vue'
import UiKitFormsPage from './UiKitFormsPage.vue'
import UiKitFoundationsPage from './UiKitFoundationsPage.vue'
import UiKitInputsPage from './UiKitInputsPage.vue'
import UiKitOverlaysPage from './UiKitOverlaysPage.vue'
import UiKitTablesPage from './UiKitTablesPage.vue'

export const uiKitManifest: ModuleManifest = {
  id: 'ui-kit',
  name: 'UI Kit',
  nav: {
    label: 'UI Kit',
    path: '/ui-kit/foundations',
    icon: 'ui-kit',
    order: 20,
    children: [
      {
        label: 'Foundations',
        path: '/ui-kit/foundations'
      },
      {
        label: 'Actions',
        path: '/ui-kit/actions'
      },
      {
        label: 'Inputs',
        path: '/ui-kit/inputs'
      },
      {
        label: 'Forms',
        path: '/ui-kit/forms'
      },
      {
        label: 'Tables',
        path: '/ui-kit/tables'
      },
      {
        label: 'Overlays',
        path: '/ui-kit/overlays'
      },
      {
        label: 'Feedback',
        path: '/ui-kit/feedback'
      }
    ]
  },
  routes: [
    {
      path: '/ui-kit/foundations',
      name: 'ui-kit-foundations',
      component: UiKitFoundationsPage,
      meta: {
        title: 'Foundations',
        description: 'Theme tokens, typography, radius, and status language.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/ui-kit/actions',
      name: 'ui-kit-actions',
      component: UiKitActionsPage,
      meta: {
        title: 'Actions',
        description: 'Buttons and command controls.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/ui-kit/inputs',
      name: 'ui-kit-inputs',
      component: UiKitInputsPage,
      meta: {
        title: 'Inputs',
        description: 'Text fields, selects, textareas, and switches.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/ui-kit/forms',
      name: 'ui-kit-forms',
      component: UiKitFormsPage,
      meta: {
        title: 'Forms',
        description: 'Form field layout and footer actions.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/ui-kit/tables',
      name: 'ui-kit-tables',
      component: UiKitTablesPage,
      meta: {
        title: 'Tables',
        description: 'Table frames, toolbars, states, and pagination.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/ui-kit/overlays',
      name: 'ui-kit-overlays',
      component: UiKitOverlaysPage,
      meta: {
        title: 'Overlays',
        description: 'Drawer carriers for focused workflows.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
    {
      path: '/ui-kit/feedback',
      name: 'ui-kit-feedback',
      component: UiKitFeedbackPage,
      meta: {
        title: 'Feedback',
        description: 'Empty, error, and status feedback primitives.',
        regions: ['primary', 'context'],
        keepAlive: { enabled: true }
      }
    }
  ],
  permissions: [
    {
      action: 'ui-kit:view',
      description: 'View reusable UI primitive demonstrations.'
    }
  ]
}
