export type MockUser = {
  userId: string
  displayName: string
  emailAddress: string
  roleName: 'Owner' | 'Operator' | 'Auditor' | 'Analyst'
  state: 'active' | 'review' | 'paused'
  regionName: string
  profileNotes?: string
}

export const mockUsers: MockUser[] = [
  {
    userId: 'u-1001',
    displayName: 'Mira Chen',
    emailAddress: 'mira.owner@example.com',
    roleName: 'Owner',
    state: 'active',
    regionName: 'Singapore',
    profileNotes: 'Owns workspace policy and billing approvals.'
  },
  {
    userId: 'u-1002',
    displayName: 'Jon Bell',
    emailAddress: 'jon.operator@example.com',
    roleName: 'Operator',
    state: 'review',
    regionName: 'New York',
    profileNotes: 'Pending expanded access review.'
  },
  {
    userId: 'u-1003',
    displayName: 'Ana Torres',
    emailAddress: 'ana.auditor@example.com',
    roleName: 'Auditor',
    state: 'active',
    regionName: 'Madrid',
    profileNotes: 'Reviews monthly access exports.'
  },
  {
    userId: 'u-1004',
    displayName: 'Kai Martin',
    emailAddress: 'kai.analyst@example.com',
    roleName: 'Analyst',
    state: 'paused',
    regionName: 'Berlin',
    profileNotes: 'Paused while contract renewal is reviewed.'
  },
  {
    userId: 'u-1005',
    displayName: 'Priya Rao',
    emailAddress: 'priya.owner@example.com',
    roleName: 'Owner',
    state: 'review',
    regionName: 'Bangalore',
    profileNotes: 'Secondary owner for regional operations.'
  },
  {
    userId: 'u-1006',
    displayName: 'Luca Moretti',
    emailAddress: 'luca.operator@example.com',
    roleName: 'Operator',
    state: 'active',
    regionName: 'Milan',
    profileNotes: 'Coordinates daily workspace handoffs.'
  }
]
