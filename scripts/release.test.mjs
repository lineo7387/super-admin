import { describe, expect, test } from 'vitest'
import { getExpectedWorkflowConfirm, normalizeRegistryCommandMode, validateWorkflowConfirm } from './release.mjs'

describe('release command helpers', () => {
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
})
