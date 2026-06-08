#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { publishCandidates } from './publish-readiness.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publishCandidateNames = new Set(publishCandidates.map((candidate) => candidate.name))
const dependencyGroupNames = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
const expectedWorkflowPath = '.github/workflows/publish-next.yml'

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function createFailure(id, message) {
  return {
    id,
    message
  }
}

function normalizeTarget(target) {
  return target.replace(/^\.\//, '')
}

function collectExportTargets(value) {
  if (!value) {
    return []
  }

  if (typeof value === 'string') {
    return value.startsWith('./') ? [normalizeTarget(value)] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectExportTargets)
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap(collectExportTargets)
  }

  return []
}

function getManifestTargets(manifest) {
  return [
    manifest.main,
    manifest.module,
    manifest.types,
    ...collectExportTargets(manifest.exports)
  ]
    .filter((target) => typeof target === 'string')
    .map(normalizeTarget)
    .filter((target, index, targets) => targets.indexOf(target) === index)
}

function getWorkspaceRangeNames(manifest) {
  return dependencyGroupNames.flatMap((groupName) =>
    Object.entries(manifest[groupName] ?? {})
      .filter(([, version]) => String(version).startsWith('workspace:'))
      .map(([name]) => name)
  )
}

function isBootstrapPublish(manifest, npmConfig) {
  return manifest.version === '0.0.0-bootstrap.0' && npmConfig.tag === 'bootstrap'
}

function isPublishNextWorkflow(env, npmConfig) {
  const isExpectedWorkflow =
    env.SUPER_ADMIN_PUBLISH_WORKFLOW === 'publish-next.yml' ||
    (typeof env.GITHUB_WORKFLOW_REF === 'string' && env.GITHUB_WORKFLOW_REF.includes(expectedWorkflowPath))

  return (
    env.GITHUB_ACTIONS === 'true' &&
    isExpectedWorkflow &&
    npmConfig.tag === 'next'
  )
}

export function validatePrepublishContext({ artifactExists, env = {}, manifest, npmConfig = {} }) {
  const failures = []

  if (!publishCandidateNames.has(manifest.name)) {
    return failures
  }

  const workspaceRangeNames = getWorkspaceRangeNames(manifest)
  if (workspaceRangeNames.length > 0) {
    failures.push(
      createFailure(
        'prepublish-no-workspace-ranges',
        `${manifest.name} must not publish workspace ranges: ${workspaceRangeNames.join(', ')}.`
      )
    )
  }

  for (const target of getManifestTargets(manifest)) {
    if (!artifactExists(target)) {
      failures.push(createFailure('prepublish-artifact-missing', `${manifest.name} is missing publish artifact ${target}.`))
    }
  }

  if (isBootstrapPublish(manifest, npmConfig)) {
    return failures
  }

  const isNormalPublishNext = isPublishNextWorkflow(env, npmConfig)

  if (!isNormalPublishNext) {
    failures.push(
      createFailure(
        'prepublish-github-actions-only',
        'Normal publishes must run from the trusted GitHub Actions publish workflow.'
      )
    )
  } else if (npmConfig.provenance !== 'true') {
    failures.push(createFailure('prepublish-provenance-required', 'Normal publishes must pass --provenance.'))
  }

  return failures
}

function getNpmConfigFromEnv(env) {
  return {
    provenance: env.npm_config_provenance,
    tag: env.npm_config_tag
  }
}

function main() {
  const packageDir = resolve(process.cwd(), process.argv[2] ?? '.')
  const manifest = readJson(resolve(packageDir, 'package.json'))
  const failures = validatePrepublishContext({
    artifactExists: (target) => existsSync(resolve(packageDir, target)),
    env: process.env,
    manifest,
    npmConfig: getNpmConfigFromEnv(process.env)
  })

  if (failures.length === 0) {
    return
  }

  for (const failure of failures) {
    console.error(`${failure.id}: ${failure.message}`)
  }
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
