import { describe, expect, it } from 'vitest'
import { createCursorListResult, createMutationFailure, createMutationSuccess, createPageListResult, normalizeAdapterError } from './api-contracts'

describe('api contract helpers', () => {
  it('creates page list results without coupling callers to a transport', () => {
    const result = createPageListResult([{ id: 'user-1' }], 12, { page: 2, pageSize: 10 })

    expect(result).toEqual({
      items: [{ id: 'user-1' }],
      total: 12,
      page: 2,
      pageSize: 10
    })
  })

  it('creates cursor list results only when a cursor is present', () => {
    expect(createCursorListResult(['job-1'], { hasMore: true, nextCursor: 'cursor-2' })).toEqual({
      items: ['job-1'],
      hasMore: true,
      nextCursor: 'cursor-2'
    })

    expect(createCursorListResult(['job-1'], { hasMore: true, nextCursor: '' })).toEqual({
      items: ['job-1'],
      hasMore: true,
      nextCursor: ''
    })

    expect(createCursorListResult(['job-1'], { hasMore: false })).toEqual({
      items: ['job-1'],
      hasMore: false
    })
  })

  it('creates mutation success and failure results', () => {
    expect(createMutationSuccess({ id: 'user-1' }, 'Saved')).toEqual({
      ok: true,
      message: 'Saved',
      data: { id: 'user-1' }
    })

    expect(createMutationFailure('Check the form', { email: 'Email is required' })).toEqual({
      ok: false,
      message: 'Check the form',
      fieldErrors: { email: 'Email is required' }
    })
  })

  it('normalizes unknown adapter errors into a small payload', () => {
    expect(normalizeAdapterError(new Error('Unable to load users'))).toEqual({
      code: 'unknown',
      message: 'Unable to load users'
    })

    expect(normalizeAdapterError('offline', 'Request could not complete')).toEqual({
      code: 'unknown',
      message: 'Request could not complete'
    })
  })
})
