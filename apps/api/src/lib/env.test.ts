import { describe, expect, it } from 'vitest'
import { readApiRuntimeEnv } from './env'

describe('api runtime env', () => {
  it('parses local allowed origins for maintainer reference smoke checks', () => {
    expect(
      readApiRuntimeEnv({
        PORT: '19001',
        SUPER_ADMIN_API_ALLOWED_ORIGINS: 'http://127.0.0.1:19002,http://localhost:19002'
      })
    ).toEqual({
      allowedOrigins: ['http://127.0.0.1:19002', 'http://localhost:19002'],
      nodeEnv: 'development',
      port: 19001
    })
  })
})
