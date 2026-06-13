#!/usr/bin/env node
import { publishCandidates } from './publish-readiness.mjs'
import { createReleasePlan, readCandidateManifests } from './release-plan.mjs'

const workflowFile = 'publish-next.yml'
const repository = 'lineo7387/super-admin'
const registryCommandModes = new Set(['bootstrap', 'trust', 'publish-next', 'promote-latest', 'all'])

function scopedAccessArgs(candidate) {
  return candidate.scoped ? ' --access public' : ''
}

function bootstrapTarballPath(candidate) {
  const filename = `${candidate.name.replace(/^@/, '').replaceAll('/', '-')}-0.0.0-bootstrap.0.tgz`
  return localPublishSpec(`output/npm-bootstrap/tarballs/${filename}`)
}

function localPublishSpec(path) {
  return path.startsWith('.') || path.startsWith('/') ? path : `./${path}`
}

function printHeader(title) {
  console.log(`\n# ${title}`)
  console.log('# Registry-mutating: do not run until the user explicitly approves this phase.\n')
}

function parseArgs(argv) {
  const [mode = 'all', ...args] = argv
  const options = {
    changedPackageNames: [],
    json: false,
    mode,
    packageNames: []
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

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

    if (arg === '--json') {
      options.json = true
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return options
}

function createSelectedReleasePlan(options) {
  return createReleasePlan({
    changedPackageNames: options.changedPackageNames,
    manifests: readCandidateManifests(),
    packageNames: options.packageNames
  })
}

function toCommandPlanEntry(candidate) {
  return {
    accessArgs: scopedAccessArgs(candidate).trim(),
    localSpec: localPublishSpec(candidate.path),
    name: candidate.name,
    path: candidate.path,
    scoped: candidate.scoped,
    version: candidate.version
  }
}

function printBootstrapCommands() {
  printHeader('Bootstrap package-name creation')
  console.log('pnpm build')
  console.log('node scripts/prepare-npm-bootstrap.mjs')
  for (const candidate of publishCandidates) {
    console.log(`npm publish ${bootstrapTarballPath(candidate)} --tag bootstrap${scopedAccessArgs(candidate)}`)
  }
}

function printTrustCommands() {
  printHeader('Trusted Publishing setup')
  console.log('npm install -g npm@^11.10.0')
  for (const candidate of publishCandidates) {
    console.log(`npm trust github ${candidate.name} --repo ${repository} --file ${workflowFile} --allow-publish -y`)
  }
}

function printPublishNextCommands(releasePlan) {
  printHeader('GitHub Actions publish-next workflow commands')
  for (const candidate of releasePlan) {
    console.log(`npm publish ${localPublishSpec(candidate.path)} --tag next --provenance${scopedAccessArgs(candidate)}`)
  }
}

function printPromoteLatestCommands(releasePlan) {
  printHeader('Promote verified next release to latest')
  for (const candidate of releasePlan) {
    console.log(`npm dist-tag add ${candidate.name}@${candidate.version} latest`)
  }
}

try {
  const options = parseArgs(process.argv.slice(2))
  const mode = options.mode

  if (!registryCommandModes.has(mode)) {
    throw new Error(`Unknown mode: ${mode}`)
  }

  const needsSelectedReleasePlan = mode === 'publish-next' || mode === 'promote-latest' || mode === 'all'
  const releasePlan = needsSelectedReleasePlan ? createSelectedReleasePlan(options) : []

  if (options.json) {
    console.log(JSON.stringify(releasePlan.map(toCommandPlanEntry)))
    process.exit(0)
  }

  if (mode === 'bootstrap' || mode === 'all') {
    printBootstrapCommands()
  }

  if (mode === 'trust' || mode === 'all') {
    printTrustCommands()
  }

  if (mode === 'publish-next' || mode === 'all') {
    printPublishNextCommands(releasePlan)
  }

  if (mode === 'promote-latest' || mode === 'all') {
    printPromoteLatestCommands(releasePlan)
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
