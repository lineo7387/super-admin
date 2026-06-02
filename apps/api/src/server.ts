import { serve } from '@hono/node-server'
import { createApiApp } from './app'
import { readApiRuntimeEnv } from './lib/env'

const env = readApiRuntimeEnv()
const app = createApiApp({
  allowedOrigins: env.allowedOrigins
})

serve({
  fetch: app.fetch,
  port: env.port
})

console.log(`Super Admin reference API listening on http://localhost:${env.port}`)
