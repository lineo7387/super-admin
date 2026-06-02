import type { UserRole } from '@/modules/users/users.types'

export type ReferenceLoginInput = {
  email: string
  password: string
}

export type ReferenceAuthApiConfig = {
  baseUrl: string
}

export type ReferenceSessionPayload = {
  permissions: string[]
  token: string
  tokenType: 'Bearer'
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
}

type ReferenceLoginResponse = {
  data: ReferenceSessionPayload
}

type ReferenceApiErrorResponse = {
  error?: {
    message?: string
  }
}

async function readReferenceError(response: Response): Promise<string> {
  const fallbackMessage = `Reference login request failed with status ${response.status}.`

  try {
    const body = (await response.json()) as ReferenceApiErrorResponse

    return body.error?.message ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}

export async function loginReferenceSession(input: ReferenceLoginInput, config: ReferenceAuthApiConfig): Promise<ReferenceSessionPayload> {
  const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/auth/login`, {
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })

  if (!response.ok) {
    throw new Error(await readReferenceError(response))
  }

  const body = (await response.json()) as ReferenceLoginResponse

  return body.data
}
