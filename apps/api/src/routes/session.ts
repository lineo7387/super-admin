import { Hono } from 'hono'
import { apiSuccess } from '../lib/http'
import type { ApiEnv } from '../types'

export const sessionRoutes = new Hono<ApiEnv>().get('/current-user', (context) => {
  return context.json(apiSuccess(context.var.session))
})
