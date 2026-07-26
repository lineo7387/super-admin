import { readFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { normalizeQualityMode, validateGeneratedStarterStatic } from './starter-validation-static.mjs'

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
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

function getPackageManagerCommand(packageManager, script, extraArgs = []) {
  if (script === 'install') {
    return {
      args: ['install'],
      command: packageManager
    }
  }

  const passthroughArgs = packageManager === 'npm' ? ['--', ...extraArgs] : extraArgs

  return {
    args: ['run', script, ...passthroughArgs],
    command: packageManager
  }
}

async function runCommand({ args, command, cwd, label }) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit'
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolveRun()
        return
      }

      reject(new Error(`${label} failed with exit code ${code}.`))
    })
  })
}

async function waitForHttp(url, timeoutMs = 20_000) {
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
      // Keep polling until the generated app becomes reachable or times out.
    }

    await new Promise((resolveWait) => {
      setTimeout(resolveWait, 250)
    })
  }

  throw new Error(`Generated starter did not become reachable at ${url} within ${timeoutMs}ms.`)
}

function killProcessTree(child, signal) {
  if (!child.pid) {
    return
  }

  try {
    if (process.platform === 'win32') {
      child.kill(signal)
      return
    }

    process.kill(-child.pid, signal)
  } catch (error) {
    if (error?.code !== 'ESRCH') {
      throw error
    }
  }
}

async function stopStartupProcess(child, timeoutMs = 5_000) {
  if (child.exitCode !== null || child.signalCode !== null) {
    child.stdout.destroy()
    child.stderr.destroy()
    return
  }

  const closed = new Promise((resolveClose) => {
    child.once('close', resolveClose)
  })
  let forceKillTimer
  const forceKillDelay = new Promise((resolveDelay) => {
    forceKillTimer = setTimeout(() => {
      killProcessTree(child, 'SIGKILL')
      resolveDelay()
    }, timeoutMs)

    forceKillTimer.unref?.()
  })

  killProcessTree(child, 'SIGTERM')
  await Promise.race([closed, forceKillDelay])
  clearTimeout(forceKillTimer)
  child.stdout.destroy()
  child.stderr.destroy()
}

async function runStartupSmoke(projectDir, packageManager) {
  const port = await getFreePort()
  const { args, command } = getPackageManagerCommand(packageManager, 'dev', ['--host', '127.0.0.1', '--port', String(port), '--strictPort'])
  const child = spawn(command, args, {
    cwd: projectDir,
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe']
  })
  const logs = []

  child.stdout.on('data', (chunk) => {
    logs.push(chunk.toString())
  })
  child.stderr.on('data', (chunk) => {
    logs.push(chunk.toString())
  })

  try {
    await waitForHttp(`http://127.0.0.1:${port}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`${message}\n${logs.join('')}`, { cause: error })
  } finally {
    await stopStartupProcess(child)
  }
}

function detectPackageManager(packageJson, explicitPackageManager) {
  if (explicitPackageManager) {
    return explicitPackageManager
  }

  const packageManager = typeof packageJson.packageManager === 'string' ? packageJson.packageManager.split('@')[0] : ''

  if (['pnpm', 'npm', 'yarn', 'bun'].includes(packageManager)) {
    return packageManager
  }

  return 'pnpm'
}

export async function validateGeneratedStarter(projectDir, options = {}) {
  const root = resolve(projectDir)
  const failures = await validateGeneratedStarterStatic(root, options)

  if (failures.length > 0) {
    return failures
  }

  if (options.staticOnly === true) {
    return []
  }

  const packageJson = await readJson(resolve(root, 'package.json'))
  const packageManager = detectPackageManager(packageJson, options.packageManager)

  const quality = normalizeQualityMode(options.quality)
  const scripts = quality === 'standard' ? ['install', 'lint', 'test', 'typecheck', 'build'] : ['install', 'typecheck', 'build']

  for (const script of scripts) {
    const { args, command } = getPackageManagerCommand(packageManager, script)
    await runCommand({
      args,
      command,
      cwd: root,
      label: `generated starter ${script}`
    })
  }

  await runStartupSmoke(root, packageManager)

  return []
}
