export type AuthRecipeProps = {
  eyebrow: string
  title: string
  description: string
}

export const authMetrics = [
  { labelKey: 'auth.layout.metrics.locale', valueKey: 'auth.layout.metrics.localeValue' },
  { labelKey: 'auth.layout.metrics.data', valueKey: 'auth.layout.metrics.dataValue' },
  { labelKey: 'auth.layout.metrics.backend', valueKey: 'auth.layout.metrics.backendValue' }
] as const
