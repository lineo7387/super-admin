import { describe, expect, it } from 'vitest'
import {
  createAdminI18n,
  createMessageTranslator,
  DEFAULT_LOCALE,
  findMissingLocaleKeys,
  getActiveLocale,
  messages
} from './index'
import { translateNavItemLabel, translateRouteDescription, translateRouteTitle } from './navigation'
import { examplesManifest } from '@/modules/examples/examples.manifest'

describe('admin i18n foundation', () => {
  it('uses zh-CN as the default locale', () => {
    const i18n = createAdminI18n()

    expect(DEFAULT_LOCALE).toBe('zh-CN')
    expect(getActiveLocale(i18n)).toBe('zh-CN')
    expect(i18n.global.t('shell.account.signOut')).toBe('退出登录')
    expect(i18n.global.t('shell.assistant.providerUnavailableMessage')).toBe('未配置 AI 提供方。')
    expect(i18n.global.t('validation.requiredLabel')).toBe('必填')
  })

  it('keeps en-US messages available for migrated keys', () => {
    const t = createMessageTranslator('en-US')

    expect(t('shell.account.signOut')).toBe('Sign out')
    expect(t('shell.assistant.providerUnavailableMessage')).toBe('No AI provider is configured.')
    expect(t('auth.login.submit')).toBe('Sign in')
    expect(t('validation.requiredLabel')).toBe('Required')
  })

  it('returns the key for missing messages predictably', () => {
    const i18n = createAdminI18n()

    expect(i18n.global.t('missing.example.key')).toBe('missing.example.key')
  })

  it('keeps migrated locale catalogs in parity', () => {
    expect(findMissingLocaleKeys(messages['zh-CN'], messages['en-US'])).toEqual([])
    expect(findMissingLocaleKeys(messages['en-US'], messages['zh-CN'])).toEqual([])
  })

  it('localizes examples navigation and workspace titles', () => {
    const zhT = createMessageTranslator('zh-CN')
    const enT = createMessageTranslator('en-US')
    const rootLabel = translateNavItemLabel(zhT, examplesManifest.nav)
    const navLabels = examplesManifest.nav.children?.map((item) => translateNavItemLabel(zhT, item)) ?? []
    const usersNav = examplesManifest.nav.children?.find((item) => item.label === 'Users')
    const usersChildLabels = usersNav?.children?.map((item) => translateNavItemLabel(zhT, item)) ?? []

    expect(rootLabel).toBe('示例')
    expect(navLabels).toEqual(['模板指南', '仪表盘', '工作台', '用户', '权限'])
    expect(usersChildLabels).toEqual(['全部用户', '待审核', '邀请', '动态'])
    expect(translateRouteTitle(zhT, '/examples/template-guide', 'Template Guide')).toBe('模板指南')
    expect(translateRouteTitle(zhT, '/examples/dashboard', 'Operations Dashboard')).toBe('仪表盘')
    expect(translateRouteTitle(zhT, '/examples/workbench', 'Operations Workbench')).toBe('工作台')
    expect(translateRouteTitle(zhT, '/examples/access', 'Access Control')).toBe('权限')
    expect(translateRouteDescription(zhT, '/examples/dashboard', 'Live control surface for revenue, risk, jobs, and audit signals.')).toContain('前端示例')
    expect(translateRouteTitle(enT, '/examples/template-guide', 'Template Guide')).toBe('Template Guide')
    expect(translateRouteTitle(enT, '/examples/dashboard', 'Operations Dashboard')).toBe('Dashboard')
    expect(translateRouteDescription(enT, '/examples/dashboard', 'Live control surface for revenue, risk, jobs, and audit signals.')).toContain('frontend example')
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
