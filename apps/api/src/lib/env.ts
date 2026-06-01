export type ApiRuntimeEnv = {
  port: number
  nodeEnv: string
}

export function readApiRuntimeEnv(env: NodeJS.ProcessEnv = process.env): ApiRuntimeEnv {
  const rawPort = env.PORT
  const parsedPort = rawPort ? Number.parseInt(rawPort, 10) : 8787

  return {
    nodeEnv: env.NODE_ENV ?? 'development',
    port: Number.isFinite(parsedPort) ? parsedPort : 8787
  }
}
