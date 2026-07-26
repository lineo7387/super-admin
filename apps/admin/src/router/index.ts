// @starter-router-hash-import:start
import { createWebHashHistory } from 'vue-router'
// @starter-router-hash-import:end
import { createRouter, createWebHistory } from 'vue-router'
import { defaultAuthenticatedPath } from '@/modules/module-registry'
import { useAuthSessionStore } from '@/stores/auth-session.store'
import { resolveAuthRedirect } from './auth-guard'
import { authRoutes } from './auth-routes'
import { moduleRoutes } from './routes'
import { systemRoutes } from './system-routes'

// @starter-router-history:start
const history =
  import.meta.env.VITE_SUPER_ADMIN_ROUTER_MODE === 'hash' ? createWebHashHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL)
// @starter-router-history:end

export const router = createRouter({
  history,
  routes: [
    {
      path: '/',
      redirect: defaultAuthenticatedPath
    },
    ...authRoutes,
    ...systemRoutes,
    ...moduleRoutes
  ]
})

router.beforeEach((to) => {
  const session = useAuthSessionStore()

  return resolveAuthRedirect(to, session.isAuthenticated, defaultAuthenticatedPath) ?? undefined
})
