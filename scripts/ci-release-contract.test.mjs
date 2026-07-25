import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

function readRepositoryFile(path) {
  return readFileSync(path, 'utf8')
}

describe('CI release contracts', () => {
  test('requires changed changesets for release-impacting pull requests', () => {
    const packageJson = JSON.parse(readRepositoryFile('package.json'))
    const workflow = readRepositoryFile('.github/workflows/ci.yml')
    const checkoutIndex = workflow.indexOf('fetch-depth: 0')
    const impactIndex = workflow.indexOf('pnpm release:impact --base "${{ github.event.pull_request.base.sha }}"')
    const buildIndex = workflow.indexOf('run: pnpm build')

    expect(packageJson.scripts['release:impact']).toBe('node scripts/release-impact.mjs')
    expect(checkoutIndex).toBeGreaterThan(-1)
    expect(impactIndex).toBeGreaterThan(checkoutIndex)
    expect(buildIndex).toBeGreaterThan(impactIndex)
  })

  test('exercises the CLI contract on both minimum supported Node lines', () => {
    const workflow = readRepositoryFile('.github/workflows/ci.yml')
    const runtimeContractIndex = workflow.indexOf('runtime-contract:')
    const checksIndex = workflow.indexOf('checks:')
    const runtimeContract = workflow.slice(runtimeContractIndex, checksIndex)

    expect(runtimeContractIndex).toBeGreaterThan(-1)
    expect(runtimeContract).toContain('node-version: [20.19.0, 22.12.0]')
    expect(runtimeContract).toContain('node-version: ${{ matrix.node-version }}')
    expect(runtimeContract).toContain('pnpm --filter create-super-admin build')
    expect(runtimeContract).toContain('pnpm --filter create-super-admin test')
    expect(runtimeContract).not.toContain('pnpm validate:starter')
  })

  test('validates packed generated starters before changes merge', () => {
    const workflow = readRepositoryFile('.github/workflows/ci.yml')
    const testIndex = workflow.indexOf('run: pnpm test')
    const starterValidationIndex = workflow.indexOf('run: pnpm validate:starter')
    const docsBuildIndex = workflow.indexOf('run: pnpm docs:build')

    expect(testIndex).toBeGreaterThan(-1)
    expect(starterValidationIndex).toBeGreaterThan(testIndex)
    expect(docsBuildIndex).toBeGreaterThan(starterValidationIndex)
  })

  test('uses the current setup-node major in every delivery workflow', () => {
    for (const path of ['.github/workflows/ci.yml', '.github/workflows/docs-pages.yml', '.github/workflows/publish-next.yml']) {
      const workflow = readRepositoryFile(path)
      const setupNodeUses = workflow.match(/actions\/setup-node@v\d+/g) ?? []

      expect(setupNodeUses.length, path).toBeGreaterThan(0)
      expect(new Set(setupNodeUses), path).toEqual(new Set(['actions/setup-node@v7']))
    }
  })

  test('keeps bilingual release workflow examples on current action majors', () => {
    for (const path of ['docs/guide/releasing.md', 'docs/en/guide/releasing.md']) {
      const guide = readRepositoryFile(path)

      expect(guide, path).toContain('actions/checkout@v7')
      expect(guide, path).toContain('actions/setup-node@v7')
    }
  })

  test('rejects already-published package versions before the publish gate', () => {
    const workflow = readRepositoryFile('.github/workflows/publish-next.yml')
    const preflightIndex = workflow.indexOf('pnpm release assert-unpublished --changed "$PUBLISH_CHANGED_PACKAGES"')
    const installIndex = workflow.indexOf('run: pnpm install --frozen-lockfile')
    const releaseCheckIndex = workflow.indexOf('run: pnpm release check')
    const publishIndex = workflow.indexOf('- name: Publish selected packages')

    expect(preflightIndex).toBeGreaterThan(-1)
    expect(installIndex).toBeGreaterThan(preflightIndex)
    expect(releaseCheckIndex).toBeGreaterThan(installIndex)
    expect(publishIndex).toBeGreaterThan(releaseCheckIndex)
  })
})
