import { Hono } from 'hono'
import { apiSuccess } from '../lib/http'
import type { ApiEnv } from '../types'

export const healthRoutes = new Hono<ApiEnv>().get('/', (context) => {
  return context.json(
    apiSuccess({
      service: 'super-admin-api',
      status: 'ok'
    })
  )
})
