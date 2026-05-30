declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, unknown>
  export default component
}

import type { PageShellMeta } from '@super-admin/core'

declare module 'vue-router' {
  interface RouteMeta extends Partial<PageShellMeta> {
    workspaceTitle?: string
  }
}
