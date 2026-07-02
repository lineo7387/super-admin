import { flattenModuleNav, type ModuleNavItem } from '@super-admin-org/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePreferencesStore } from '@/stores/preferences.store'
import { registeredModules } from '@/modules/module-registry'
import { translateNavItemLabel } from '@/i18n/navigation'

export type CommandPaletteGroup = 'navigation' | 'actions'

export type CommandPaletteItem = {
  id: string
  label: string
  group: CommandPaletteGroup
  hint?: string
  perform: () => void
}

type ColorMode = 'light' | 'dark' | 'system'
type Locale = 'zh-CN' | 'en-US'

const LOCALE_I18N_KEY: Record<Locale, string> = {
  'zh-CN': 'zhCN',
  'en-US': 'enUS'
}

export function useCommandPaletteItems() {
  const router = useRouter()
  const preferences = usePreferencesStore()
  const { t } = useI18n()

  const navigationItems = computed<CommandPaletteItem[]>(() => {
    const items: CommandPaletteItem[] = []

    for (const manifest of registeredModules) {
      const flat = flattenModuleNav(manifest.nav as ModuleNavItem)
      for (const entry of flat) {
        const path = entry.item.path
        const parentLabels = entry.parents.map((p) => translateNavItemLabel(t, p))
        const label = [...parentLabels, translateNavItemLabel(t, entry.item)].join(' / ')

        items.push({
          id: `nav:${path}`,
          label,
          group: 'navigation',
          hint: path,
          perform: () => {
            router.push(path)
          }
        })
      }
    }

    return items
  })

  const actionItems = computed<CommandPaletteItem[]>(() => {
    const items: CommandPaletteItem[] = []

    items.push({
      id: 'action:open-control-center',
      label: t('shell.commandPalette.actions.openControlCenter'),
      group: 'actions',
      perform: () => preferences.openControlCenter()
    })

    items.push({
      id: 'action:open-ai-assistant',
      label: t('shell.commandPalette.actions.openAiAssistant'),
      group: 'actions',
      perform: () => preferences.openAiAssistant()
    })

    items.push({
      id: 'action:open-stage-overview',
      label: t('shell.commandPalette.actions.openStageOverview'),
      group: 'actions',
      perform: () => preferences.openStageOverview()
    })

    const colorModes: ColorMode[] = ['light', 'dark', 'system']
    for (const mode of colorModes) {
      items.push({
        id: `action:color-mode:${mode}`,
        label: t('shell.commandPalette.actions.setColorMode', { mode: t(`shell.commandPalette.modes.${mode}`) }),
        group: 'actions',
        perform: () => preferences.setColorMode(mode)
      })
    }

    const locales: Locale[] = ['zh-CN', 'en-US']
    for (const locale of locales) {
      items.push({
        id: `action:locale:${locale}`,
        label: t('shell.commandPalette.actions.setLocale', { locale: t(`shell.commandPalette.locales.${LOCALE_I18N_KEY[locale]}`) }),
        group: 'actions',
        perform: () => preferences.setLocale(locale)
      })
    }

    return items
  })

  const items = computed<CommandPaletteItem[]>(() => [...navigationItems.value, ...actionItems.value])

  return { items }
}

export function filterCommandItems(items: CommandPaletteItem[], query: string): CommandPaletteItem[] {
  const keyword = query.trim().toLowerCase()

  if (!keyword) {
    return items
  }

  return items.filter((item) => item.label.toLowerCase().includes(keyword))
}
