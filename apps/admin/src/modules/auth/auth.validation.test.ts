import { describe, expect, it } from 'vitest'
import { validateLoginInput, validateRegisterInput } from './auth.validation'

describe('auth validation', () => {
  it('validates login input', () => {
    expect(
      validateLoginInput({
        email: 'not-an-email',
        password: ''
      })
    ).toEqual({
      email: 'Enter a valid email address.',
      password: 'Password is required.'
    })
  })

  it('accepts valid login input', () => {
    expect(
      validateLoginInput({
        email: 'mira.owner@example.com',
        password: 'reference-admin'
      })
    ).toEqual({})
  })

  it('validates register input as a template-only flow', () => {
    expect(
      validateRegisterInput({
        email: 'bad',
        name: '',
        organization: '',
        password: 'short'
      })
    ).toEqual({
      email: 'Enter a valid email address.',
      name: 'Name is required.',
      organization: 'Workspace name is required.',
      password: 'Use at least 8 characters.'
    })
  })
})
