export type ApiRuntimeEnv = {
  allowedOrigins: string[]
  port: number
  nodeEnv: string
}

function parseAllowedOrigins(value: string | undefined): string[] {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
}

export function readApiRuntimeEnv(env: NodeJS.ProcessEnv = process.env): ApiRuntimeEnv {
  const rawPort = env.PORT
  const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : 8787

  return {
    allowedOrigins: parseAllowedOrigins(env.SUPER_ADMIN_API_ALLOWED_ORIGINS),
    nodeEnv: env.NODE_ENV ?? 'development',
    port: Number.isFinite(parsedPort) ? parsedPort : 8787
  }
}
