import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { apiSuccess } from '../lib/http'
import { requirePermission } from '../lib/permissions'
import { validationErrorBody } from '../lib/validation'
import { listUsers } from '../services/users'
import type { ApiEnv, UserStatusFilter } from '../types'

const userStatuses = ['all', 'active', 'review', 'paused'] as const

const usersListQuerySchema = z.object({
  keyword: z.string().trim().optional(),
  page: z.coerce.number().int().min(1, 'Page must be at least 1.').default(1),
  pageSize: z.coerce.number().int().min(1, 'Page size must be between 1 and 100.').max(100, 'Page size must be between 1 and 100.').default(20),
  status: z
    .string()
    .default('all')
    .refine((value) => userStatuses.includes(value as UserStatusFilter), {
      message: 'Status must be active, review, paused, or all.'
    })
    .transform((value) => value as UserStatusFilter)
})

export const usersRoutes = new Hono<ApiEnv>().get(
  '/',
  requirePermission('users:read'),
  zValidator('query', usersListQuerySchema, (result, context) => {
    if (!result.success) {
      return context.json(validationErrorBody(result.error), 400)
    }
  }),
  async (context) => {
    const params = context.req.valid('query')

    return context.json(apiSuccess(await listUsers(params)))
  }
)
