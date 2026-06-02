import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { apiSuccess } from '../lib/http'
import { validationErrorBody } from '../lib/validation'
import { loginWithReferenceCredentials } from '../services/auth'
import type { ApiEnv } from '../types'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.')
})

export const authRoutes = new Hono<ApiEnv>().post(
  '/login',
  zValidator('json', loginSchema, (result, context) => {
    if (!result.success) {
      return context.json(validationErrorBody(result.error), 400)
    }
  }),
  async (context) => {
    const input = context.req.valid('json')

    return context.json(apiSuccess(await loginWithReferenceCredentials(input.email, input.password)))
  }
)
