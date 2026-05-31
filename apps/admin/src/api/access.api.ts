import { accessIntegrationNote, accessRoles } from '@/api/mock/access.mock'
import type { MockAccessRole } from '@/api/mock/access.mock'
import type { AccessMatrixParams, AccessMatrixResult, AccessRole } from '@/modules/access/access.types'

function normalizeRole(role: MockAccessRole): AccessRole {
  return {
    id: role.roleId,
    name: role.displayName,
    scope: role.moduleScope,
    level: role.accessLevel,
    tone: role.tone,
    permissions: role.permissionCodes
  }
}

export async function getAccessMatrix(params: AccessMatrixParams = {}): Promise<AccessMatrixResult> {
  if (params.scenario === 'error') {
    throw new Error('Unable to load access matrix')
  }

  return {
    roles: params.scenario === 'empty' ? [] : accessRoles.map(normalizeRole),
    providerRequirement: 'none',
    integrationNote: accessIntegrationNote
  }
}
