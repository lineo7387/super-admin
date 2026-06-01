export function referenceAdminAuthHeaders(): HeadersInit {
  return {
    Authorization: 'Bearer reference-admin-token'
  }
}

export function referenceAuditorAuthHeaders(): HeadersInit {
  return {
    Authorization: 'Bearer reference-auditor-token'
  }
}
