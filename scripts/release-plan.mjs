import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { publishCandidates } from './publish-readiness.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dependencyGroupNames = ['dependencies', 'optionalDependencies', 'peerDependencies']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function getManifest(manifests, packageName) {
  if (manifests instanceof Map) {
    return manifests.get(packageName)
  }

  return manifests[packageName]
}

function assertKnownPackageNames(packageNames, candidateNames) {
  const unknownNames = packageNames.filter((packageName) => !candidateNames.has(packageName))

  if (unknownNames.length > 0) {
    throw new Error(`Unknown publish candidate(s): ${unknownNames.join(', ')}.`)
  }
}

function sortedByCandidateOrder(packageNames, candidates) {
  const selected = new Set(packageNames)
  return candidates.filter((candidate) => selected.has(candidate.name)).map((candidate) => candidate.name)
}

function withManifestVersions(packageNames, candidates, manifests) {
  const byName = new Map(candidates.map((candidate) => [candidate.name, candidate]))

  return packageNames.map((packageName) => {
    const candidate = byName.get(packageName)
    const manifest = getManifest(manifests, packageName)

    if (!candidate || !manifest) {
      throw new Error(`Missing publish candidate manifest for ${packageName}.`)
    }

    return {
      ...candidate,
      version: manifest.version
    }
  })
}

export function parsePackageList(value) {
  if (Array.isArray(value)) {
    return value.flatMap(parsePackageList)
  }

  return String(value ?? '')
    .split(/[,\s]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function readCandidateManifests(root = repoRoot, candidates = publishCandidates) {
  return Object.fromEntries(
    candidates.map((candidate) => {
      const manifest = readJson(resolve(root, candidate.path, 'package.json'))

      if (manifest.name !== candidate.name) {
        throw new Error(`Publish candidate ${candidate.name} points at manifest ${manifest.name}.`)
      }

      return [candidate.name, manifest]
    })
  )
}

export function createInternalDependencyGraph({ candidates = publishCandidates, manifests = readCandidateManifests() } = {}) {
  const candidateNames = new Set(candidates.map((candidate) => candidate.name))

  return Object.fromEntries(
    candidates.map((candidate) => {
      const manifest = getManifest(manifests, candidate.name)

      if (!manifest) {
        throw new Error(`Missing publish candidate manifest for ${candidate.name}.`)
      }

      const internalDependencies = dependencyGroupNames.flatMap((groupName) =>
        Object.keys(manifest[groupName] ?? {}).filter((dependencyName) => candidateNames.has(dependencyName))
      )

      return [candidate.name, internalDependencies]
    })
  )
}

export function createDependencyAwareReleasePlan({
  candidates = publishCandidates,
  changedPackageNames,
  manifests = readCandidateManifests()
}) {
  const normalizedChangedNames = parsePackageList(changedPackageNames)
  const candidateNames = new Set(candidates.map((candidate) => candidate.name))

  if (normalizedChangedNames.length === 0) {
    throw new Error('At least one changed publish candidate is required.')
  }

  assertKnownPackageNames(normalizedChangedNames, candidateNames)

  const graph = createInternalDependencyGraph({ candidates, manifests })
  const selected = new Set(normalizedChangedNames)
  let addedPackage = true

  while (addedPackage) {
    addedPackage = false

    for (const [packageName, dependencyNames] of Object.entries(graph)) {
      if (selected.has(packageName)) {
        continue
      }

      if (dependencyNames.some((dependencyName) => selected.has(dependencyName))) {
        selected.add(packageName)
        addedPackage = true
      }
    }
  }

  return withManifestVersions(sortedByCandidateOrder([...selected], candidates), candidates, manifests)
}

export function createExactReleasePlan({
  candidates = publishCandidates,
  manifests = readCandidateManifests(),
  packageNames
}) {
  const normalizedPackageNames = parsePackageList(packageNames)
  const candidateNames = new Set(candidates.map((candidate) => candidate.name))

  if (normalizedPackageNames.length === 0) {
    throw new Error('At least one publish candidate is required.')
  }

  assertKnownPackageNames(normalizedPackageNames, candidateNames)

  return withManifestVersions(sortedByCandidateOrder(normalizedPackageNames, candidates), candidates, manifests)
}

export function createReleasePlan({
  candidates = publishCandidates,
  changedPackageNames,
  manifests = readCandidateManifests(),
  packageNames
} = {}) {
  const hasChangedPackages = parsePackageList(changedPackageNames).length > 0
  const hasExactPackages = parsePackageList(packageNames).length > 0

  if (hasChangedPackages && hasExactPackages) {
    throw new Error('Use either --changed or --packages, not both.')
  }

  if (hasExactPackages) {
    return createExactReleasePlan({ candidates, manifests, packageNames })
  }

  return createDependencyAwareReleasePlan({ candidates, changedPackageNames, manifests })
}

export function getSuperAdminDependencyVersionRanges({
  candidates = publishCandidates,
  manifests = readCandidateManifests()
} = {}) {
  return Object.fromEntries(
    candidates
      .filter((candidate) => candidate.name.startsWith('@super-admin-org/'))
      .map((candidate) => {
        const manifest = getManifest(manifests, candidate.name)

        if (!manifest) {
          throw new Error(`Missing publish candidate manifest for ${candidate.name}.`)
        }

        return [candidate.name, `^${manifest.version}`]
      })
  )
}
