import { describe, expect, it } from 'vitest'
import {
  createAdminI18n,
  createMessageTranslator,
  DEFAULT_LOCALE,
  findMissingLocaleKeys,
  getActiveLocale,
  messages
} from './index'

describe('admin i18n foundation', () => {
  it('uses zh-CN as the default locale', () => {
    const i18n = createAdminI18n()

    expect(DEFAULT_LOCALE).toBe('zh-CN')
    expect(getActiveLocale(i18n)).toBe('zh-CN')
    expect(i18n.global.t('shell.account.signOut')).toBe('退出登录')
  })

  it('keeps en-US messages available for migrated keys', () => {
    const t = createMessageTranslator('en-US')

    expect(t('shell.account.signOut')).toBe('Sign out')
    expect(t('auth.login.submit')).toBe('Sign in')
  })

  it('returns the key for missing messages predictably', () => {
    const i18n = createAdminI18n()

    expect(i18n.global.t('missing.example.key')).toBe('missing.example.key')
  })

  it('keeps migrated locale catalogs in parity', () => {
    expect(findMissingLocaleKeys(messages['zh-CN'], messages['en-US'])).toEqual([])
    expect(findMissingLocaleKeys(messages['en-US'], messages['zh-CN'])).toEqual([])
  })

  it('uses generic open-source template copy on auth surfaces', () => {
    const t = createMessageTranslator('zh-CN')
    const authCopy = [
      t('auth.login.eyebrow'),
      t('auth.login.title'),
      t('auth.login.description'),
      t('auth.login.intro'),
      t('auth.register.description'),
      t('auth.layout.brand'),
      t('auth.layout.metrics.backend')
    ].join(' ')

    expect(authCopy).toContain('开源后台模板')
    expect(authCopy).toContain('Super Admin')
    expect(authCopy).not.toMatch(/Hono|参考认证|参考访问|控制界面|控制闸口|指挥访问|保险库|Vault|Command|reference access/i)
  })
})
