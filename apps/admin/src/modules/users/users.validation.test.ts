import { describe, expect, it } from 'vitest'
import { createMessageTranslator } from '@/i18n'
import { validateUserInput } from './users.validation'

describe('users validation', () => {
  it('validates user form input with zh-CN messages by default', () => {
    expect(
      validateUserInput({
        email: 'bad',
        name: '',
        notes: '',
        region: '',
        role: '',
        status: ''
      })
    ).toEqual({
      email: '请输入有效的邮箱地址。',
      name: '请输入姓名。',
      role: '请选择角色。',
      status: '请选择状态。'
    })
  })

  it('can validate user form input with en-US messages', () => {
    expect(
      validateUserInput(
        {
          email: 'bad',
          name: '',
          notes: '',
          region: '',
          role: '',
          status: ''
        },
        createMessageTranslator('en-US')
      )
    ).toEqual({
      email: 'Enter a valid email address.',
      name: 'Name is required.',
      role: 'Role is required.',
      status: 'Status is required.'
    })
  })
})
