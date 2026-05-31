export type MockAccessRole = {
  roleId: string
  displayName: string
  moduleScope: string
  accessLevel: string
  tone: 'neutral' | 'success' | 'warning' | 'danger'
  permissionCodes: string[]
}

export const accessRoles: MockAccessRole[] = [
  {
    roleId: 'owner',
    displayName: 'Owner',
    moduleScope: 'All modules',
    accessLevel: 'Full',
    tone: 'success',
    permissionCodes: ['dashboard:view', 'workbench:run', 'users:manage', 'access:review']
  },
  {
    roleId: 'operator',
    displayName: 'Operator',
    moduleScope: 'Workbench, Users',
    accessLevel: 'Scoped',
    tone: 'warning',
    permissionCodes: ['workbench:run', 'users:review']
  },
  {
    roleId: 'auditor',
    displayName: 'Auditor',
    moduleScope: 'Dashboard, Access',
    accessLevel: 'Read only',
    tone: 'neutral',
    permissionCodes: ['dashboard:view', 'access:review']
  }
]

export const accessIntegrationNote =
  'Use this as a copyable access example. If your roles or screens differ, reshape the page, types, permission checks, and API adapter together.'
