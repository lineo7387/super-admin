declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SUPER_ADMIN_API_BASE_URL?: string
  readonly VITE_SUPER_ADMIN_REFERENCE_TOKEN?: string
  readonly VITE_SUPER_ADMIN_USERS_API?: 'mock' | 'reference'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import type { PageShellMeta } from '@super-admin/core'

declare module 'vue-router' {
  interface RouteMeta extends Partial<PageShellMeta> {
    workspaceTitle?: string
  }
}
