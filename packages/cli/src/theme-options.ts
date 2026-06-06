export const starterThemeIds = ['base', 'crypto', 'cyberpunk', 'industrial', 'newsprint'] as const
export const starterPackageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const

export type StarterThemeId = (typeof starterThemeIds)[number]
export type StarterPackageManager = (typeof starterPackageManagers)[number]
export type StarterLocaleId = 'zh-CN' | 'en-US'

export type ThemeDefinition = {
  id: StarterThemeId
  packageName: string
  profileExport: string
}

export const themeDefinitions: Record<StarterThemeId, ThemeDefinition> = {
  base: {
    id: 'base',
    packageName: '@super-admin/theme-base',
    profileExport: 'baseProfile'
  },
  crypto: {
    id: 'crypto',
    packageName: '@super-admin/theme-crypto',
    profileExport: 'cryptoProfile'
  },
  cyberpunk: {
    id: 'cyberpunk',
    packageName: '@super-admin/theme-cyberpunk',
    profileExport: 'cyberpunkProfile'
  },
  industrial: {
    id: 'industrial',
    packageName: '@super-admin/theme-industrial',
    profileExport: 'industrialProfile'
  },
  newsprint: {
    id: 'newsprint',
    packageName: '@super-admin/theme-newsprint',
    profileExport: 'newsprintProfile'
  }
}

export function isStarterThemeId(value: string): value is StarterThemeId {
  return starterThemeIds.includes(value as StarterThemeId)
}

export function isStarterPackageManager(value: string): value is StarterPackageManager {
  return starterPackageManagers.includes(value as StarterPackageManager)
}
