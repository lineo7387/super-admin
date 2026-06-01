import { serve } from '@hono/node-server'
import { app } from './app'
import { readApiRuntimeEnv } from './lib/env'

const env = readApiRuntimeEnv()

serve({
  fetch: app.fetch,
  port: env.port
})

console.log(`Super Admin reference API listening on http://localhost:${env.port}`)
