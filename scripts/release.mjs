#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { publishCandidates } from './publish-readiness.mjs'
import { createReleasePlan, readCandidateManifests } from './release-plan.mjs'

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

export function readReleaseVersions(root = repoRoot) {
  return publishCandidates.map((candidate) => {
    const manifest = readJson(resolve(root, candidate.path, 'package.json'))
    return {
      name: candidate.name,
      version: manifest.version
    }
  })
}

export function readReleaseVersion(packageName = publishCandidates[0].name, root = repoRoot) {
  const version = readReleaseVersions(root).find((entry) => entry.name === packageName)

  if (!version) {
    throw new Error(`Unknown publish candidate: ${packageName}.`)
  }

  return version.version
}

function getPackageConfirmName(packageName) {
  return packageName.replace(/^@super-admin-org\//, '').replace(/[^a-zA-Z0-9.-]+/g, '-')
}

export function getExpectedWorkflowConfirm(selectedPackages, channel = 'next') {
  const packageSlug = selectedPackages
    .map((selectedPackage) => `${getPackageConfirmName(selectedPackage.name)}-${selectedPackage.version}`)
    .join('-')

  return `publish-super-admin-${channel}-${packageSlug}`
}

export function validateWorkflowConfirm(confirm, selectedPackages, channel = 'next') {
  const expected = getExpectedWorkflowConfirm(selectedPackages, channel)

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
  await runCommand('node', ['scripts/write-cli-package-version-ranges.mjs'])
  await runCommand('pnpm', ['install', '--lockfile-only'])
}

async function runBootstrapPrepare() {
  await runReleaseCheck()
  await runCommand('node', ['scripts/prepare-npm-bootstrap.mjs'])
}

async function runRegistryCommands(mode, args) {
  const normalizedMode = normalizeRegistryCommandMode(mode)

  if (!registryCommandModes.has(normalizedMode)) {
    throw new Error(`Unknown release command mode: ${mode ?? ''}`)
  }

  await runCommand('node', ['scripts/npm-registry-release-commands.mjs', normalizedMode, ...args])
}

function parseReleaseSelectionArgs(args) {
  const options = {
    changedPackageNames: [],
    channel: 'next',
    packageNames: []
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--channel') {
      options.channel = args[index + 1] ?? ''
      index += 1
      continue
    }

    if (arg.startsWith('--channel=')) {
      options.channel = arg.slice('--channel='.length)
      continue
    }

    if (arg === '--changed') {
      options.changedPackageNames.push(args[index + 1] ?? '')
      index += 1
      continue
    }

    if (arg.startsWith('--changed=')) {
      options.changedPackageNames.push(arg.slice('--changed='.length))
      continue
    }

    if (arg === '--packages') {
      options.packageNames.push(args[index + 1] ?? '')
      index += 1
      continue
    }

    if (arg.startsWith('--packages=')) {
      options.packageNames.push(arg.slice('--packages='.length))
      continue
    }

    throw new Error(`Unknown release selection option: ${arg}`)
  }

  if (!['next', 'latest'].includes(options.channel)) {
    throw new Error(`Unknown release channel: ${options.channel}.`)
  }

  return options
}

function readSelectedReleasePlan(options) {
  if (options.changedPackageNames.length > 0) {
    return createReleasePlan({
      changedPackageNames: options.changedPackageNames,
      manifests: readCandidateManifests()
    })
  }

  if (options.packageNames.length > 0) {
    return createReleasePlan({
      manifests: readCandidateManifests(),
      packageNames: options.packageNames
    })
  }

  throw new Error('Release package selection is required. Pass --changed <packages> or --packages <packages>.')
}

function assertWorkflowConfirm(confirm, args) {
  const options = parseReleaseSelectionArgs(args)
  const failures = validateWorkflowConfirm(confirm, readSelectedReleasePlan(options), options.channel)

  if (failures.length > 0) {
    throw new Error(failures.map((failure) => failure.message).join('\n'))
  }
}

function printReleasePlan(args) {
  const options = parseReleaseSelectionArgs(args)
  const releasePlan = readSelectedReleasePlan(options)

  console.log('Selected release packages:')
  for (const selectedPackage of releasePlan) {
    console.log(`- ${selectedPackage.name}@${selectedPackage.version}`)
  }
  console.log(`Workflow confirmation: ${getExpectedWorkflowConfirm(releasePlan, options.channel)}`)
}

function printUsage() {
  console.log(`Usage:
  pnpm release check
  pnpm release version
  pnpm release bootstrap:prepare
  pnpm release plan [--channel next|latest] --changed <package[,package]>
  pnpm release commands [bootstrap|trust|next|publish-next|latest|promote-latest|all] [--changed <package[,package]>|--packages <package[,package]>]
  pnpm release assert-workflow-confirm <confirmation-text> [--channel next|latest] [--changed <package[,package]>|--packages <package[,package]>]`)
}

async function main() {
  const [command, ...args] = process.argv.slice(2)

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
    const [mode, ...commandArgs] = args
    await runRegistryCommands(mode, commandArgs)
    return
  }

  if (command === 'plan') {
    printReleasePlan(args)
    return
  }

  if (command === 'assert-workflow-confirm') {
    const [confirm, ...selectionArgs] = args
    assertWorkflowConfirm(confirm, selectionArgs)
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
