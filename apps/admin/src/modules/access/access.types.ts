export type AccessPreviewScenario = 'normal' | 'empty' | 'error'

export type AccessProviderRequirement = 'none'

export type AccessRoleTone = 'neutral' | 'success' | 'warning' | 'danger'

export type AccessRole = {
  id: string
  name: string
  scope: string
  level: string
  tone: AccessRoleTone
  permissions: string[]
}

export type AccessMatrixParams = {
  scenario?: AccessPreviewScenario
}

export type AccessMatrixResult = {
  roles: AccessRole[]
  providerRequirement: AccessProviderRequirement
  integrationNote: string
}
