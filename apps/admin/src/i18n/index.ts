import { createI18n } from 'vue-i18n'
// @starter-locale-en:start
import enUS from './locales/en-US'
// @starter-locale-en:end
import zhCN from './locales/zh-CN'

export const DEFAULT_LOCALE = 'zh-CN'
// @starter-locale-en:start
export const OPTIONAL_LOCALE = 'en-US'
// @starter-locale-en:end

export const messages = {
  [DEFAULT_LOCALE]: zhCN,
  // @starter-locale-en:start
  [OPTIONAL_LOCALE]: enUS
  // @starter-locale-en:end
} as const

export type Locale = keyof typeof messages
export type LocaleCatalog = Record<string, unknown>
export type MessageValues = Record<string, string | number>
export type MessageTranslator = (key: string, values?: MessageValues) => string

function flattenMessageKeys(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') {
    return [prefix]
  }

  if (typeof value !== 'object' || value === null) {
    return []
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    return flattenMessageKeys(child, nextPrefix)
  })
}

function hasMessageKey(value: unknown, path: string): boolean {
  return path.split('.').every((segment, index, segments) => {
    if (typeof value !== 'object' || value === null || !(segment in value)) {
      return false
    }

    value = (value as Record<string, unknown>)[segment]
    return index < segments.length - 1 || typeof value === 'string'
  })
}

export function resolveLocale(locale: string | undefined): Locale {
  return Object.hasOwn(messages, locale ?? '') ? (locale as Locale) : DEFAULT_LOCALE
}

export function findMissingLocaleKeys(source: LocaleCatalog, target: LocaleCatalog): string[] {
  return flattenMessageKeys(source).filter((key) => !hasMessageKey(target, key))
}

export function createAdminI18n(locale: Locale = DEFAULT_LOCALE) {
  return createI18n({
    fallbackLocale: DEFAULT_LOCALE,
    legacy: false,
    locale,
    messages,
    missing: (_locale, key) => key
  })
}

export const i18n = createAdminI18n()

export function getActiveLocale(adminI18n: ReturnType<typeof createAdminI18n> = i18n): Locale {
  const locale = adminI18n.global.locale
  return resolveLocale(typeof locale === 'string' ? locale : locale.value)
}

export function setActiveLocale(locale: Locale, adminI18n: ReturnType<typeof createAdminI18n> = i18n): void {
  adminI18n.global.locale.value = locale
}

export function createMessageTranslator(locale: Locale = DEFAULT_LOCALE): MessageTranslator {
  const localI18n = createAdminI18n(locale)
  return (key, values) => localI18n.global.t(key, values ?? {})
}

export const translateAdminMessage: MessageTranslator = (key, values) => i18n.global.t(key, values ?? {})
