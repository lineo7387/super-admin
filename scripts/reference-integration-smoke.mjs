import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ARTIFACT_DIR = resolve(ROOT_DIR, 'output/playwright/reference-smoke')

function sleep(ms) {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms)
  })
}

function assertSmoke(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export function createSmokeConfig({ apiPort, adminPort, headed = false } = {}) {
  const resolvedApiPort = apiPort ?? 8787
  const resolvedAdminPort = adminPort ?? 5173

  return {
    adminPort: resolvedAdminPort,
    adminUrl: `http://127.0.0.1:${resolvedAdminPort}`,
    apiPort: resolvedApiPort,
    apiUrl: `http://127.0.0.1:${resolvedApiPort}`,
    headed
  }
}

export function buildAdminEnv({ apiUrl }, env = process.env) {
  const baseEnv = { ...env }
  delete baseEnv.VITE_SUPER_ADMIN_REFERENCE_TOKEN

  return {
    ...baseEnv,
    VITE_SUPER_ADMIN_API_BASE_URL: apiUrl,
    VITE_SUPER_ADMIN_USERS_API: 'reference'
  }
}

export function findRequest(requests, { baseUrl, method, path }) {
  return requests.find((request) => {
    const url = new URL(request.url)

    return request.method === method && request.url.startsWith(baseUrl) && url.pathname === path
  })
}

export function getReferenceSmokeResult({ apiUrl, authToken, finalUrl, requests, usersTotal }) {
  const authLoginRequest = findRequest(requests, {
    baseUrl: apiUrl,
    method: 'POST',
    path: '/auth/login'
  })
  const usersRequest = findRequest(requests, {
    baseUrl: apiUrl,
    method: 'GET',
    path: '/users'
  })

  return {
    authLoginPosted: Boolean(authLoginRequest),
    logoutReturnedToLogin: finalUrl.includes('/auth/login'),
    usersRenderedFromReferenceApi: usersTotal > 0,
    usersRequestedWithLoginToken: usersRequest?.headers.authorization === `Bearer ${authToken}`
  }
}

async function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()

    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()

      server.close(() => {
        if (typeof address === 'object' && address !== null) {
          resolvePort(address.port)
          return
        }

        reject(new Error('Unable to allocate a local port.'))
      })
    })
  })
}

async function createRuntimeConfig(env = process.env) {
  const apiPort = env.REFERENCE_SMOKE_API_PORT ? Number.parseInt(env.REFERENCE_SMOKE_API_PORT, 10) : await getFreePort()
  const adminPort = env.REFERENCE_SMOKE_ADMIN_PORT ? Number.parseInt(env.REFERENCE_SMOKE_ADMIN_PORT, 10) : await getFreePort()

  return createSmokeConfig({
    adminPort,
    apiPort,
    headed: env.REFERENCE_SMOKE_HEADED === '1'
  })
}

function workspaceBin(workspace, binName) {
  return resolve(ROOT_DIR, workspace, 'node_modules/.bin', binName)
}

function startProcess({ args, command, cwd, env, label }) {
  const child = spawn(command, args, {
    cwd,
    env,
    stdio: ['ignore', 'pipe', 'pipe']
  })
  const logs = []

  child.stdout.on('data', (chunk) => {
    logs.push(`[${label}] ${chunk.toString()}`)
  })
  child.stderr.on('data', (chunk) => {
    logs.push(`[${label}] ${chunk.toString()}`)
  })

  return {
    child,
    label,
    logs
  }
}

function stopProcess(processHandle) {
  const { child } = processHandle

  if (child.exitCode !== null) {
    return
  }

  try {
    if (process.platform !== 'win32' && child.pid) {
      process.kill(-child.pid, 'SIGTERM')
      return
    }
  } catch {
    // Fall back to killing the direct child process below.
  }

  child.kill('SIGTERM')
}

async function waitForHttp(url, { label, timeoutMs = 20_000 } = {}) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(1_000)
      })

      if (response.ok) {
        return
      }
    } catch {
      // Retry until the process finishes booting or the timeout expires.
    }

    await sleep(250)
  }

  throw new Error(`${label ?? url} did not become ready within ${timeoutMs}ms.`)
}

async function importPlaywright() {
  try {
    return await import('playwright')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Playwright is required for the reference smoke. Install dependencies with pnpm install. ${message}`, { cause: error })
  }
}

async function saveJsonArtifact(name, value) {
  await mkdir(ARTIFACT_DIR, { recursive: true })
  await writeFile(resolve(ARTIFACT_DIR, name), `${JSON.stringify(value, null, 2)}\n`)
}

async function runBrowserFlow(config) {
  const { chromium } = await importPlaywright()
  let browser

  try {
    browser = await chromium.launch({ headless: !config.headed })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Unable to launch Chromium. Run "pnpm exec playwright install chromium" and retry. ${message}`, { cause: error })
  }

  const requests = []
  const consoleMessages = []

  try {
    const page = await browser.newPage()
    page.on('console', (message) => {
      consoleMessages.push({
        text: message.text(),
        type: message.type()
      })
    })
    page.on('pageerror', (error) => {
      consoleMessages.push({
        text: error.message,
        type: 'pageerror'
      })
    })
    page.on('request', (request) => {
      if (!request.url().startsWith(config.apiUrl)) {
        return
      }

      requests.push({
        headers: request.headers(),
        method: request.method(),
        url: request.url()
      })
    })

    await page.goto(`${config.adminUrl}/examples/users/all`, { waitUntil: 'domcontentloaded' })
    await page.waitForURL('**/auth/login**')
    assertSmoke(page.url().includes('redirect=/examples/users/all'), 'Logged-out users route did not preserve the redirect query.')

    const authResponsePromise = page.waitForResponse((response) => response.url() === `${config.apiUrl}/auth/login` && response.request().method() === 'POST')
    const usersResponsePromise = page
      .waitForResponse((response) => response.url().startsWith(`${config.apiUrl}/users`) && response.request().method() === 'GET')
      .then((response) => ({ response }))
      .catch((error) => ({ error }))

    await page.getByRole('button', { name: /^(登录|Sign in)$/ }).click()
    const authResponse = await authResponsePromise
    const authPayload = await authResponse.json()
    const authToken = authPayload.data.token

    assertSmoke(typeof authToken === 'string' && authToken.length > 0, 'Reference login did not return a bearer token.')

    await page.waitForURL('**/examples/users/all')
    const usersResponseResult = await usersResponsePromise

    if (usersResponseResult.error) {
      await saveJsonArtifact('reference-smoke-timeout-diagnostics.json', {
        consoleMessages,
        currentUrl: page.url(),
        error: usersResponseResult.error.message,
        requests
      })
      throw usersResponseResult.error
    }

    const usersResponse = usersResponseResult.response
    const usersPayload = await usersResponse.json()

    assertSmoke(usersResponse.status() === 200, `Reference users request returned status ${usersResponse.status()}.`)

    await page.getByRole('table').getByText('Mira Chen').waitFor({ state: 'visible' })

    await page.screenshot({
      fullPage: true,
      path: resolve(ARTIFACT_DIR, 'users-reference-success.png')
    })

    await page.getByRole('button', { name: 'MC' }).click()
    await page.getByRole('menuitem', { name: /^(退出登录|Sign out)$/ }).click()
    await page.waitForURL('**/auth/login**')

    const finalUrl = page.url()
    const result = getReferenceSmokeResult({
      apiUrl: config.apiUrl,
      authToken,
      finalUrl,
      requests,
      usersTotal: usersPayload.data.total
    })

    assertSmoke(result.authLoginPosted, 'Browser did not POST to the reference /auth/login endpoint.')
    assertSmoke(result.usersRequestedWithLoginToken, 'Users request did not use the runtime login token.')
    assertSmoke(result.usersRenderedFromReferenceApi, 'Users page did not render reference API data.')
    assertSmoke(result.logoutReturnedToLogin, 'Logout did not return to the login route.')

    await saveJsonArtifact('reference-smoke-result.json', {
      ...result,
      adminUrl: config.adminUrl,
      apiUrl: config.apiUrl
    })

    return result
  } catch (error) {
    await mkdir(ARTIFACT_DIR, { recursive: true })
    await saveJsonArtifact('reference-smoke-failure.json', {
      error: error instanceof Error ? error.message : String(error),
      consoleMessages,
      requests
    })
    throw error
  } finally {
    await browser.close()
  }
}

export async function runReferenceSmoke(env = process.env) {
  const config = await createRuntimeConfig(env)
  const apiProcess = startProcess({
    args: ['src/server.ts'],
    command: workspaceBin('apps/api', 'tsx'),
    cwd: resolve(ROOT_DIR, 'apps/api'),
    env: {
      ...env,
      PORT: String(config.apiPort),
      SUPER_ADMIN_API_ALLOWED_ORIGINS: config.adminUrl
    },
    label: 'api'
  })
  const adminProcess = startProcess({
    args: ['--host', '127.0.0.1', '--port', String(config.adminPort), '--strictPort'],
    command: workspaceBin('apps/admin', 'vite'),
    cwd: resolve(ROOT_DIR, 'apps/admin'),
    env: buildAdminEnv({ apiUrl: config.apiUrl }, env),
    label: 'admin'
  })

  try {
    await waitForHttp(`${config.apiUrl}/health`, { label: 'reference API' })
    await waitForHttp(config.adminUrl, { label: 'admin app' })

    return await runBrowserFlow(config)
  } finally {
    await saveJsonArtifact('reference-smoke-service-logs.json', {
      admin: adminProcess.logs,
      api: apiProcess.logs
    })
    stopProcess(adminProcess)
    stopProcess(apiProcess)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runReferenceSmoke()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2))
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    })
}
