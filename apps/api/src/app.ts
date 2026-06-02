import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ApiError, internalServerError, notFoundError, toApiErrorBody } from './lib/errors'
import { sessionMiddleware } from './lib/session'
import { authRoutes } from './routes/auth'
import { healthRoutes } from './routes/health'
import { sessionRoutes } from './routes/session'
import { usersRoutes } from './routes/users'
import type { ApiEnv } from './types'

export function createApiApp(): Hono<ApiEnv> {
  const app = new Hono<ApiEnv>()

  app.use(
    '*',
    cors({
      allowHeaders: ['Authorization', 'Content-Type'],
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
    })
  )
  app.use('*', sessionMiddleware)
  app.route('/auth', authRoutes)
  app.route('/health', healthRoutes)
  app.route('/session', sessionRoutes)
  app.route('/users', usersRoutes)

  app.notFound((context) => context.json(notFoundError(), 404))
  app.onError((error, context) => {
    if (error instanceof ApiError) {
      return context.json(toApiErrorBody(error), error.status)
    }

    console.error(error)
    return context.json(internalServerError(), 500)
  })

  return app
}

export const app = createApiApp()

export type ApiApp = typeof app
