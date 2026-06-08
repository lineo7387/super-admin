import { describe, expect, test } from 'vitest'
import { validatePrepublishContext } from './prepublish-guard.mjs'

const manifest = {
  name: '@super-admin-org/core',
  version: '0.1.0',
  main: './dist/index.js',
  types: './dist/index.d.ts',
  dependencies: {}
}

function artifactExists(target) {
  return ['dist/index.js', 'dist/index.d.ts'].includes(target)
}

describe('prepublish guard', () => {
  test('blocks normal local publishes for publish candidates', () => {
    expect(
      validatePrepublishContext({
        artifactExists,
        env: {},
        manifest,
        npmConfig: {
          tag: 'next'
        }
      })
    ).toContainEqual({
      id: 'prepublish-github-actions-only',
      message: 'Normal publishes must run from the trusted GitHub Actions publish workflow.'
    })
  })

  test('allows explicit bootstrap publish path', () => {
    expect(
      validatePrepublishContext({
        artifactExists,
        env: {},
        manifest: {
          ...manifest,
          version: '0.0.0-bootstrap.0'
        },
        npmConfig: {
          tag: 'bootstrap'
        }
      })
    ).toEqual([])
  })

  test('allows publish-next workflow context', () => {
    expect(
      validatePrepublishContext({
        artifactExists,
        env: {
          GITHUB_ACTIONS: 'true',
          GITHUB_WORKFLOW_REF: 'lineo7387/super-admin/.github/workflows/publish-next.yml@refs/heads/main'
        },
        manifest,
        npmConfig: {
          provenance: 'true',
          tag: 'next'
        }
      })
    ).toEqual([])
  })

  test('allows publish-next workflow marker from workflow env', () => {
    expect(
      validatePrepublishContext({
        artifactExists,
        env: {
          GITHUB_ACTIONS: 'true',
          SUPER_ADMIN_PUBLISH_WORKFLOW: 'publish-next.yml'
        },
        manifest,
        npmConfig: {
          provenance: 'true',
          tag: 'next'
        }
      })
    ).toEqual([])
  })

  test('requires provenance for normal publish-next releases', () => {
    expect(
      validatePrepublishContext({
        artifactExists,
        env: {
          GITHUB_ACTIONS: 'true',
          SUPER_ADMIN_PUBLISH_WORKFLOW: 'publish-next.yml'
        },
        manifest,
        npmConfig: {
          tag: 'next'
        }
      })
    ).toContainEqual({
      id: 'prepublish-provenance-required',
      message: 'Normal publishes must pass --provenance.'
    })
  })

  test('rejects workspace dependency ranges', () => {
    expect(
      validatePrepublishContext({
        artifactExists,
        env: {},
        manifest: {
          ...manifest,
          dependencies: {
            '@super-admin-org/theme': 'workspace:*'
          },
          version: '0.0.0-bootstrap.0'
        },
        npmConfig: {
          tag: 'bootstrap'
        }
      })
    ).toContainEqual({
      id: 'prepublish-no-workspace-ranges',
      message: '@super-admin-org/core must not publish workspace ranges: @super-admin-org/theme.'
    })
  })

  test('rejects missing publish artifacts', () => {
    expect(
      validatePrepublishContext({
        artifactExists: () => false,
        env: {},
        manifest: {
          ...manifest,
          version: '0.0.0-bootstrap.0'
        },
        npmConfig: {
          tag: 'bootstrap'
        }
      })
    ).toContainEqual({
      id: 'prepublish-artifact-missing',
      message: '@super-admin-org/core is missing publish artifact dist/index.js.'
    })
  })
})
