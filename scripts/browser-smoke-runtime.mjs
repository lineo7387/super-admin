import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { resolve } from 'node:path'

function sleep(ms) {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms)
  })
}

export function assertSmoke(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export async function getFreePort() {
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

export function workspaceBin(repoRoot, workspace, binName) {
  return resolve(repoRoot, workspace, 'node_modules/.bin', binName)
}

export function startProcess({ args, command, cwd, env, label }) {
  const child = spawn(command, args, {
    cwd,
    detached: process.platform !== 'win32',
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

export async function stopProcess(processHandle, timeoutMs = 5_000) {
  const { child } = processHandle

  if (child.exitCode !== null) {
    return
  }

  await new Promise((resolveStop) => {
    const timeout = setTimeout(() => {
      try {
        if (process.platform !== 'win32' && child.pid) {
          process.kill(-child.pid, 'SIGKILL')
        } else {
          child.kill('SIGKILL')
        }
      } catch {
        // The process may have exited between the timeout and the signal.
      }
    }, timeoutMs)

    child.once('exit', () => {
      clearTimeout(timeout)
      resolveStop()
    })

    try {
      if (process.platform !== 'win32' && child.pid) {
        process.kill(-child.pid, 'SIGTERM')
      } else {
        child.kill('SIGTERM')
      }
    } catch {
      clearTimeout(timeout)
      resolveStop()
    }
  })
}

export async function waitForHttp(url, { label, timeoutMs = 20_000 } = {}) {
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

export async function loadPlaywright(smokeName) {
  try {
    return await import('playwright')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Playwright is required for ${smokeName}. Install dependencies with pnpm install. ${message}`, { cause: error })
  }
}

export async function saveJsonArtifact(artifactDir, name, value) {
  await mkdir(artifactDir, { recursive: true })
  await writeFile(resolve(artifactDir, name), `${JSON.stringify(value, null, 2)}\n`)
}
