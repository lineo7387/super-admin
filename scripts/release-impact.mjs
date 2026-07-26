#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { publishCandidates } from './publish-readiness.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const canonicalStarterQualityTest = 'apps/admin/src/super-admin/starter-quality.test.ts'
const cliBuildImpactPaths = new Set(['scripts/build-cli-template.mjs', 'scripts/write-cli-package-version-ranges.mjs'])
const sharedBuildImpactPackageNames = new Map([
  [
    'scripts/build-publish-package.mjs',
    new Set([
      '@super-admin-org/core',
      '@super-admin-org/theme',
      '@super-admin-org/theme-base',
      '@super-admin-org/theme-crypto',
      '@super-admin-org/theme-cyberpunk',
      '@super-admin-org/theme-industrial',
      '@super-admin-org/theme-newsprint',
      '@super-admin-org/ui'
    ])
  ]
])
const testOnlyDirectoryNames = new Set(['__fixtures__', '__snapshots__', '__tests__', 'test', 'tests'])

function normalizeRepositoryPath(filePath) {
  return String(filePath).replaceAll('\\', '/').replace(/^\.\//, '')
}

function isTestOnlyPath(filePath) {
  const normalizedPath = normalizeRepositoryPath(filePath)
  const pathSegments = normalizedPath.split('/')
  const fileName = pathSegments.at(-1) ?? ''

  return (
    pathSegments.some((segment) => testOnlyDirectoryNames.has(segment)) ||
    /\.(test|spec)\.[cm]?[jt]sx?$/.test(fileName) ||
    /^(jest\.config|playwright\.config|vitest\.(config|workspace))\.[cm]?[jt]sx?$/.test(fileName)
  )
}

function isPublishCandidateImpact(filePath, candidatePath) {
  if (!filePath.startsWith(`${candidatePath}/`)) {
    return false
  }

  const relativePath = filePath.slice(candidatePath.length + 1)
  return (
    relativePath !== 'CHANGELOG.md' &&
    !relativePath.startsWith('coverage/') &&
    !relativePath.startsWith('dist/') &&
    !relativePath.endsWith('.tsbuildinfo') &&
    !isTestOnlyPath(relativePath)
  )
}

function isCanonicalStarterImpact(filePath) {
  if (filePath === 'apps/admin/components.json' || filePath === canonicalStarterQualityTest) {
    return true
  }

  if (!filePath.startsWith('apps/admin/src/')) {
    return false
  }

  const relativePath = filePath.slice('apps/admin/src/'.length)
  return !relativePath.startsWith('api/reference/') && !isTestOnlyPath(relativePath)
}

export function getReleaseImpactDetails(changedFiles, candidates = publishCandidates) {
  const normalizedFiles = [...new Set(changedFiles.map(normalizeRepositoryPath))]

  return candidates.flatMap((candidate) => {
    const triggerPaths = normalizedFiles.filter(
      (filePath) =>
        sharedBuildImpactPackageNames.get(filePath)?.has(candidate.name) ||
        isPublishCandidateImpact(filePath, candidate.path) ||
        (candidate.name === 'create-super-admin' && (isCanonicalStarterImpact(filePath) || cliBuildImpactPaths.has(filePath)))
    )

    return triggerPaths.length > 0
      ? [
          {
            packageName: candidate.name,
            triggerPaths
          }
        ]
      : []
  })
}

export function getReleaseImpactPackageNames(changedFiles, candidates = publishCandidates) {
  return getReleaseImpactDetails(changedFiles, candidates).map(({ packageName }) => packageName)
}

export function parseChangesetPackageNames(contents) {
  const frontmatter = String(contents).match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/)?.[1]

  if (!frontmatter) {
    return []
  }

  return frontmatter
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*["']?([^"']+?)["']?\s*:\s*(?:patch|minor|major)\s*$/)?.[1]?.trim())
    .filter(Boolean)
}

export function parseGitNameStatus(output) {
  return String(output)
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [rawStatus, ...paths] = line.split('\t')
      const status = rawStatus.slice(0, 1)
      const normalizedPaths = paths.map(normalizeRepositoryPath)
      const path = normalizedPaths.at(-1)

      return status === 'R' || status === 'C' ? { path, previousPath: normalizedPaths.at(0), status } : { path, status }
    })
}

export function getChangedFilePaths(changedEntries) {
  return changedEntries.flatMap(({ path, previousPath }) => (previousPath && previousPath !== path ? [previousPath, path] : [path]))
}

export function createChangesetSuggestion(impacts) {
  const frontmatter = impacts.map(({ packageName }) => `"${packageName}": patch`).join('\n')

  return `Run \`pnpm changeset\` and use this patch-level starting point:
---
${frontmatter}
---

Describe the user-visible change and adjust bump levels when the API impact requires minor or major.`
}

export function validateReleaseImpactChangesets({ changedChangesetContents = [], changedFiles = [] }) {
  const impacts = getReleaseImpactDetails(changedFiles)
  const coveredPackageNames = new Set(changedChangesetContents.flatMap(parseChangesetPackageNames))
  const missingImpacts = impacts.filter(({ packageName }) => !coveredPackageNames.has(packageName))

  if (missingImpacts.length === 0) {
    return []
  }

  const missingPackageNames = missingImpacts.map(({ packageName }) => packageName)
  const triggerSummary = missingImpacts.map(({ packageName, triggerPaths }) => `${packageName} <- ${triggerPaths.join(', ')}`).join('\n- ')
  const suggestion = createChangesetSuggestion(missingImpacts)

  return [
    {
      id: 'release-impact-missing-changeset',
      message: `Release-impacting changes require changed Changesets for: ${missingPackageNames.join(', ')}.\nTriggered by:\n- ${triggerSummary}\n${suggestion}`,
      missingImpacts,
      suggestion
    }
  ]
}

function readChangedChangesets(base, changedEntries) {
  return changedEntries
    .filter(({ path }) => /^\.changeset\/(?!README\.md$).+\.md$/.test(path))
    .map(({ path, status }) => {
      if (status === 'D') {
        return execFileSync('git', ['show', `${base}:${path}`], { cwd: repoRoot, encoding: 'utf8' })
      }

      return readFileSync(resolve(repoRoot, path), 'utf8')
    })
}

function main() {
  const baseFlagIndex = process.argv.indexOf('--base')
  const base = (baseFlagIndex === -1 ? process.env.GITHUB_BASE_SHA : process.argv[baseFlagIndex + 1])?.trim()

  if (!base) {
    throw new Error('A comparison base is required. Pass --base <git-ref> or set GITHUB_BASE_SHA.')
  }

  const diffOutput = execFileSync('git', ['diff', '--name-status', '--find-renames', `${base}...HEAD`], {
    cwd: repoRoot,
    encoding: 'utf8'
  })
  const changedEntries = parseGitNameStatus(diffOutput)
  const changedFiles = getChangedFilePaths(changedEntries)
  const changedChangesetContents = readChangedChangesets(base, changedEntries)
  const failures = validateReleaseImpactChangesets({ changedChangesetContents, changedFiles })

  if (failures.length === 0) {
    const impactedPackageNames = getReleaseImpactPackageNames(changedFiles)
    console.log(
      impactedPackageNames.length === 0
        ? 'Release impact check passed: no publishable package impact.'
        : `Release impact check passed: ${impactedPackageNames.join(', ')}.`
    )
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
