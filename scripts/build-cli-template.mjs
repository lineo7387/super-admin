#!/usr/bin/env node
import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceAppDir = resolve(repoRoot, 'apps/admin')
const sourceSrcDir = resolve(sourceAppDir, 'src')
const templateRoot = resolve(repoRoot, 'packages/cli/dist/starter-template/admin')

const UNREGISTERED_STANDALONE_MANIFESTS = new Set([
  'modules/access/access.manifest.ts',
  'modules/dashboard/dashboard.manifest.ts',
  'modules/users/users.manifest.ts',
  'modules/workbench/workbench.manifest.ts'
])

function toPosixPath(path) {
  return path.split(sep).join('/')
}

function shouldCopySourcePath(sourcePath) {
  const relativePath = toPosixPath(relative(sourceSrcDir, sourcePath))

  if (!relativePath) {
    return true
  }

  if (UNREGISTERED_STANDALONE_MANIFESTS.has(relativePath)) {
    return false
  }

  if (relativePath === 'api/reference' || relativePath.startsWith('api/reference/')) {
    return false
  }

  if (/\.(test|spec)\.(ts|tsx|js|mjs)$/.test(relativePath)) {
    return false
  }

  if (relativePath.endsWith('.tsbuildinfo')) {
    return false
  }

  return true
}

await rm(templateRoot, { force: true, recursive: true })
await mkdir(templateRoot, { recursive: true })
await cp(resolve(sourceAppDir, 'components.json'), resolve(templateRoot, 'components.json'))
await cp(sourceSrcDir, resolve(templateRoot, 'src'), {
  filter: shouldCopySourcePath,
  recursive: true
})
