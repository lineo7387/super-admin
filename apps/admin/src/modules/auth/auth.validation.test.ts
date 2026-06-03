import { describe, expect, it } from 'vitest'
import { createMessageTranslator } from '@/i18n'
import { validateLoginInput, validateRegisterInput } from './auth.validation'

describe('auth validation', () => {
  it('validates login input with zh-CN messages by default', () => {
    expect(
      validateLoginInput({
        email: 'not-an-email',
        password: ''
      })
    ).toEqual({
      email: '请输入有效的邮箱地址。',
      password: '请输入密码。'
    })
  })

  it('can validate login input with en-US messages', () => {
    expect(
      validateLoginInput(
        {
          email: 'not-an-email',
          password: ''
        },
        createMessageTranslator('en-US')
      )
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
      email: '请输入有效的邮箱地址。',
      name: '请输入姓名。',
      organization: '请输入工作区名称。',
      password: '密码至少需要 8 个字符。'
    })
  })
})
