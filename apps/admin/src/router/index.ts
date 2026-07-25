import { createRouter, createWebHistory } from 'vue-router'
import { defaultAuthenticatedPath } from '@/modules/module-registry'
import { useAuthSessionStore } from '@/stores/auth-session.store'
import { resolveAuthRedirect } from './auth-guard'
import { authRoutes } from './auth-routes'
import { moduleRoutes } from './routes'
import { systemRoutes } from './system-routes'

export const router = createRouter({
  history: createWebHistory(),
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
