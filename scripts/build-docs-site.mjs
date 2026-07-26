#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function runCommand(command, args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        ...options.env
      },
      stdio: 'inherit'
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolveRun()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}.`))
    })
  })
}

export function createPublicDemoBuildEnv(env = process.env) {
  return {
    ...env,
    SUPER_ADMIN_PUBLIC_BASE: '/super-admin/demo/',
    SUPER_ADMIN_PUBLIC_OUT_DIR: '../../docs/.vitepress/dist/demo',
    VITE_SUPER_ADMIN_ROUTER_MODE: 'hash'
  }
}

export async function buildDocsSite() {
  await runCommand('pnpm', ['exec', 'vitepress', 'build', 'docs'])
  await runCommand('pnpm', ['--filter', '@super-admin/admin^...', 'build'])
  await runCommand('pnpm', ['--filter', '@super-admin/admin', 'build'], {
    env: createPublicDemoBuildEnv()
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildDocsSite().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
