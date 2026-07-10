import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

function readRepositoryFile(path) {
  return readFileSync(path, 'utf8')
}

describe('CI release contracts', () => {
  test('validates packed generated starters before changes merge', () => {
    const workflow = readRepositoryFile('.github/workflows/ci.yml')
    const testIndex = workflow.indexOf('run: pnpm test')
    const starterValidationIndex = workflow.indexOf('run: pnpm validate:starter')
    const docsBuildIndex = workflow.indexOf('run: pnpm docs:build')

    expect(testIndex).toBeGreaterThan(-1)
    expect(starterValidationIndex).toBeGreaterThan(testIndex)
    expect(docsBuildIndex).toBeGreaterThan(starterValidationIndex)
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
