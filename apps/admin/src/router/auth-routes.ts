import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    name: 'auth-login',
    component: () => import('@/modules/auth/LoginPage.vue'),
    meta: {
      authLayout: true,
      workspaceTitle: '登录'
    }
  },
  {
    path: '/auth/register',
    name: 'auth-register',
    component: () => import('@/modules/auth/RegisterPage.vue'),
    meta: {
      authLayout: true,
      workspaceTitle: '创建账户'
    }
  }
]
