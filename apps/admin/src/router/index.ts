import { createRouter, createWebHistory } from 'vue-router'
import { moduleRoutes } from './routes'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    ...moduleRoutes
  ]
})
