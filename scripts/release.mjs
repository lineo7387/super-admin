#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { publishCandidates } from './publish-readiness.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const registryCommandModes = new Set(['all', 'bootstrap', 'trust', 'publish-next', 'promote-latest'])

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function runCommand(command, args, cwd = repoRoot) {
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

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}.`))
    })
  })
}

export function readReleaseVersion(root = repoRoot) {
  const versions = publishCandidates.map((candidate) => {
    const manifest = readJson(resolve(root, candidate.path, 'package.json'))
    return {
      name: candidate.name,
      version: manifest.version
    }
  })
  const [first] = versions
  const mismatches = versions.filter((entry) => entry.version !== first.version)

  if (mismatches.length > 0) {
    throw new Error(`Publish candidates must use one lockstep version: ${versions.map((entry) => `${entry.name}@${entry.version}`).join(', ')}.`)
  }

  return first.version
}

export function getExpectedWorkflowConfirm(version) {
  return `publish-super-admin-next-${version}`
}

export function validateWorkflowConfirm(confirm, version) {
  const expected = getExpectedWorkflowConfirm(version)

  if (confirm === expected) {
    return []
  }

  return [
    {
      id: 'workflow-confirm-mismatch',
      message: `Expected confirmation text "${expected}".`
    }
  ]
}

export function normalizeRegistryCommandMode(mode) {
  if (mode === undefined) {
    return 'all'
  }

  if (mode === 'next') {
    return 'publish-next'
  }

  if (mode === 'latest') {
    return 'promote-latest'
  }

  return mode
}

async function runReleaseCheck() {
  await runCommand('pnpm', ['build'])
  await runCommand('pnpm', ['lint'])
  await runCommand('pnpm', ['typecheck'])
  await runCommand('pnpm', ['test'])
  await runCommand('pnpm', ['validate:publish', '--skip-build'])
}

async function runReleaseVersion() {
  await runCommand('pnpm', ['changeset', 'version'])
  await runCommand('pnpm', ['install', '--lockfile-only'])
}

async function runBootstrapPrepare() {
  await runReleaseCheck()
  await runCommand('node', ['scripts/prepare-npm-bootstrap.mjs'])
}

async function runRegistryCommands(mode) {
  const normalizedMode = normalizeRegistryCommandMode(mode)

  if (!registryCommandModes.has(normalizedMode)) {
    throw new Error(`Unknown release command mode: ${mode ?? ''}`)
  }

  await runCommand('node', ['scripts/npm-registry-release-commands.mjs', normalizedMode])
}

function assertWorkflowConfirm(confirm) {
  const failures = validateWorkflowConfirm(confirm, readReleaseVersion())

  if (failures.length > 0) {
    throw new Error(failures.map((failure) => failure.message).join('\n'))
  }
}

function printUsage() {
  console.log(`Usage:
  pnpm release check
  pnpm release version
  pnpm release bootstrap:prepare
  pnpm release commands [bootstrap|trust|next|publish-next|latest|promote-latest|all]
  pnpm release assert-workflow-confirm <confirmation-text>`)
}

async function main() {
  const [command, value] = process.argv.slice(2)

  if (command === 'check') {
    await runReleaseCheck()
    return
  }

  if (command === 'version') {
    await runReleaseVersion()
    return
  }

  if (command === 'bootstrap:prepare') {
    await runBootstrapPrepare()
    return
  }

  if (command === 'commands') {
    await runRegistryCommands(value)
    return
  }

  if (command === 'assert-workflow-confirm') {
    assertWorkflowConfirm(value)
    return
  }

  printUsage()
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
