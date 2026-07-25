import type { AppModuleRegistration } from '../app-module-registry'
import { examplesManifest } from './examples.manifest'

export const examplesRegistration: AppModuleRegistration = {
  defaultPath: '/examples/dashboard',
  manifest: examplesManifest,
  redirects: [
    {
      path: '/dashboard',
      redirect: '/examples/dashboard'
    },
    {
      path: '/workbench',
      redirect: '/examples/workbench'
    },
    {
      path: '/access',
      redirect: '/examples/access'
    },
    {
      path: '/users',
      redirect: '/examples/users/all'
    },
    {
      path: '/users/all',
      redirect: '/examples/users/all'
    },
    {
      path: '/users/pending-review',
      redirect: '/examples/users/pending-review'
    },
    {
      path: '/users/invites',
      redirect: '/examples/users/invites'
    },
    {
      path: '/users/activity',
      redirect: '/examples/users/activity'
    }
  ]
}
