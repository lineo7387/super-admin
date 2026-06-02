import { ApiError } from '../lib/errors'
import { createReferenceSessionResult } from '../lib/session'
import type { LoginResult } from '../types'

const referenceCredentials: Record<string, { password: string; token: string }> = {
  'mira.owner@example.com': {
    password: 'reference-admin',
    token: 'reference-admin-token'
  },
  'ana.auditor@example.com': {
    password: 'reference-auditor',
    token: 'reference-auditor-token'
  }
}

export async function loginWithReferenceCredentials(email: string, password: string): Promise<LoginResult> {
  const credentials = referenceCredentials[email.toLowerCase()]

  if (!credentials || credentials.password !== password) {
    throw new ApiError(401, 'invalid_credentials', 'Email or password is incorrect.')
  }

  const result = await createReferenceSessionResult(credentials.token)

  if (!result) {
    throw new ApiError(401, 'invalid_credentials', 'Email or password is incorrect.')
  }

  return result
}
