import { describe, expect, test } from 'vitest'
import { getExpectedWorkflowConfirm, normalizeRegistryCommandMode, validateWorkflowConfirm } from './release.mjs'

describe('release command helpers', () => {
  test('builds workflow confirmation text from the current release version', () => {
    expect(getExpectedWorkflowConfirm('0.1.1')).toBe('publish-super-admin-next-0.1.1')
  })

  test('validates exact workflow confirmation text', () => {
    expect(validateWorkflowConfirm('publish-super-admin-next-0.1.1', '0.1.1')).toEqual([])
    expect(validateWorkflowConfirm('publish-super-admin-next-0.1.0', '0.1.1')).toEqual([
      {
        id: 'workflow-confirm-mismatch',
        message: 'Expected confirmation text "publish-super-admin-next-0.1.1".'
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
