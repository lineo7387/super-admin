export const starterThemeIds = ['base', 'crypto', 'cyberpunk', 'industrial', 'newsprint'] as const
export const starterPackageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const
export const starterChartProviders = ['none', 'echarts'] as const

export type StarterThemeId = (typeof starterThemeIds)[number]
export type StarterPackageManager = (typeof starterPackageManagers)[number]
export type StarterChartProvider = (typeof starterChartProviders)[number]
export type StarterLocaleId = 'zh-CN' | 'en-US'

export type ThemeDefinition = {
  authRecipeComponent: string
  id: StarterThemeId
  packageName: string
  profileExport: string
}

export const themeDefinitions: Record<StarterThemeId, ThemeDefinition> = {
  base: {
    authRecipeComponent: 'BaseAuthRecipe',
    id: 'base',
    packageName: '@super-admin-org/theme-base',
    profileExport: 'baseProfile'
  },
  crypto: {
    authRecipeComponent: 'CryptoAuthRecipe',
    id: 'crypto',
    packageName: '@super-admin-org/theme-crypto',
    profileExport: 'cryptoProfile'
  },
  cyberpunk: {
    authRecipeComponent: 'CyberpunkAuthRecipe',
    id: 'cyberpunk',
    packageName: '@super-admin-org/theme-cyberpunk',
    profileExport: 'cyberpunkProfile'
  },
  industrial: {
    authRecipeComponent: 'IndustrialAuthRecipe',
    id: 'industrial',
    packageName: '@super-admin-org/theme-industrial',
    profileExport: 'industrialProfile'
  },
  newsprint: {
    authRecipeComponent: 'NewsprintAuthRecipe',
    id: 'newsprint',
    packageName: '@super-admin-org/theme-newsprint',
    profileExport: 'newsprintProfile'
  }
}

export function isStarterThemeId(value: string): value is StarterThemeId {
  return starterThemeIds.includes(value as StarterThemeId)
}

export function isStarterPackageManager(value: string): value is StarterPackageManager {
  return starterPackageManagers.includes(value as StarterPackageManager)
}

export function isStarterChartProvider(value: string): value is StarterChartProvider {
  return starterChartProviders.includes(value as StarterChartProvider)
}
