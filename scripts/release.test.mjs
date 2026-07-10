import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  getExpectedWorkflowConfirm,
  normalizeRegistryCommandMode,
  readNpmPackageMetadata,
  validateReleaseVersionsUnpublished,
  validateWorkflowConfirm
} from './release.mjs'

describe('release command helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('builds workflow confirmation text from selected package versions', () => {
    expect(
      getExpectedWorkflowConfirm([
        {
          name: 'create-super-admin',
          version: '0.1.3'
        }
      ])
    ).toBe('publish-super-admin-next-create-super-admin-0.1.3')
  })

  test('builds latest workflow confirmation text from selected package versions', () => {
    expect(
      getExpectedWorkflowConfirm(
        [
          {
            name: '@super-admin-org/theme-base',
            version: '0.1.4'
          }
        ],
        'latest'
      )
    ).toBe('publish-super-admin-latest-theme-base-0.1.4')
  })

  test('validates exact workflow confirmation text', () => {
    const selectedPackages = [
      {
        name: 'create-super-admin',
        version: '0.1.3'
      }
    ]

    expect(validateWorkflowConfirm('publish-super-admin-next-create-super-admin-0.1.3', selectedPackages)).toEqual([])
    expect(validateWorkflowConfirm('publish-super-admin-next-create-super-admin-0.1.2', selectedPackages)).toEqual([
      {
        id: 'workflow-confirm-mismatch',
        message: 'Expected confirmation text "publish-super-admin-next-create-super-admin-0.1.3".'
      }
    ])
  })

  test('normalizes registry command aliases', () => {
    expect(normalizeRegistryCommandMode(undefined)).toBe('all')
    expect(normalizeRegistryCommandMode('bootstrap')).toBe('bootstrap')
    expect(normalizeRegistryCommandMode('trust')).toBe('trust')
    expect(normalizeRegistryCommandMode('next')).toBe('publish-next')
    expect(normalizeRegistryCommandMode('publish-next')).toBe('publish-next')
    expect(normalizeRegistryCommandMode('latest')).toBe('promote-latest')
    expect(normalizeRegistryCommandMode('promote-latest')).toBe('promote-latest')
  })

  test('rejects selected package versions that already exist on npm', async () => {
    const failures = await validateReleaseVersionsUnpublished(
      [
        {
          name: 'create-super-admin',
          version: '0.1.7'
        }
      ],
      async () => ({
        versions: {
          '0.1.7': {}
        }
      })
    )

    expect(failures).toEqual([
      {
        id: 'release-version-already-published',
        message: 'create-super-admin@0.1.7 already exists on npm. Apply pending changesets before publishing.'
      }
    ])
  })

  test('allows selected package versions that are not published yet', async () => {
    await expect(
      validateReleaseVersionsUnpublished(
        [
          {
            name: '@super-admin-org/ui',
            version: '0.1.6'
          }
        ],
        async () => ({
          versions: {
            '0.1.5': {}
          }
        })
      )
    ).resolves.toEqual([])
  })

  test('fails closed when npm metadata has no valid versions map', async () => {
    await expect(
      validateReleaseVersionsUnpublished(
        [
          {
            name: 'create-super-admin',
            version: '0.1.8'
          }
        ],
        async () => ({})
      )
    ).rejects.toThrow('Invalid npm registry metadata for create-super-admin: expected an object-valued versions field.')
  })

  test('treats a missing npm package as an unpublished version', async () => {
    await expect(
      validateReleaseVersionsUnpublished(
        [
          {
            name: 'create-super-admin-next-package',
            version: '0.1.0'
          }
        ],
        async () => null
      )
    ).resolves.toEqual([])
  })

  test('rejects npm registry errors other than missing packages', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 503
    }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(readNpmPackageMetadata('create-super-admin')).rejects.toThrow('Unable to check npm registry metadata for create-super-admin: HTTP 503.')
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal)
  })

  test('reports every selected package version collision', async () => {
    const selectedPackages = [
      { name: 'create-super-admin', version: '0.1.7' },
      { name: '@super-admin-org/ui', version: '0.1.5' }
    ]

    const failures = await validateReleaseVersionsUnpublished(selectedPackages, async () => ({
      versions: {
        '0.1.5': {},
        '0.1.7': {}
      }
    }))

    expect(failures.map((failure) => failure.message)).toEqual([
      'create-super-admin@0.1.7 already exists on npm. Apply pending changesets before publishing.',
      '@super-admin-org/ui@0.1.5 already exists on npm. Apply pending changesets before publishing.'
    ])
  })
})
