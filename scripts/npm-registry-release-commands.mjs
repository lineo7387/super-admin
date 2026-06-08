#!/usr/bin/env node
import { publishCandidates } from './publish-readiness.mjs'
import { readReleaseVersion } from './release.mjs'

const workflowFile = 'publish-next.yml'
const repository = 'lineo7387/super-admin'
const releaseVersion = readReleaseVersion()

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

function printPublishNextCommands() {
  printHeader('GitHub Actions publish-next workflow commands')
  for (const candidate of publishCandidates) {
    console.log(`npm publish ${localPublishSpec(candidate.path)} --tag next --provenance${scopedAccessArgs(candidate)}`)
  }
}

function printPromoteLatestCommands() {
  printHeader('Promote verified next release to latest')
  for (const candidate of publishCandidates) {
    console.log(`npm dist-tag add ${candidate.name}@${releaseVersion} latest`)
  }
}

const mode = process.argv[2] ?? 'all'

if (mode === 'bootstrap' || mode === 'all') {
  printBootstrapCommands()
}

if (mode === 'trust' || mode === 'all') {
  printTrustCommands()
}

if (mode === 'publish-next' || mode === 'all') {
  printPublishNextCommands()
}

if (mode === 'promote-latest' || mode === 'all') {
  printPromoteLatestCommands()
}

if (!['bootstrap', 'trust', 'publish-next', 'promote-latest', 'all'].includes(mode)) {
  console.error(`Unknown mode: ${mode}`)
  process.exitCode = 1
}
