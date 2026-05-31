import type { UserRecord } from './users.types'

export const mockUsers: UserRecord[] = [
  {
    id: 'u-1001',
    name: 'Mira Chen',
    email: 'mira.owner@example.com',
    role: 'Owner',
    status: 'active',
    region: 'Singapore',
    notes: 'Owns workspace policy and billing approvals.'
  },
  {
    id: 'u-1002',
    name: 'Jon Bell',
    email: 'jon.operator@example.com',
    role: 'Operator',
    status: 'review',
    region: 'New York',
    notes: 'Pending expanded access review.'
  },
  {
    id: 'u-1003',
    name: 'Ana Torres',
    email: 'ana.auditor@example.com',
    role: 'Auditor',
    status: 'active',
    region: 'Madrid',
    notes: 'Reviews monthly access exports.'
  },
  {
    id: 'u-1004',
    name: 'Kai Martin',
    email: 'kai.analyst@example.com',
    role: 'Analyst',
    status: 'paused',
    region: 'Berlin',
    notes: 'Paused while contract renewal is reviewed.'
  },
  {
    id: 'u-1005',
    name: 'Priya Rao',
    email: 'priya.owner@example.com',
    role: 'Owner',
    status: 'review',
    region: 'Bangalore',
    notes: 'Secondary owner for regional operations.'
  },
  {
    id: 'u-1006',
    name: 'Luca Moretti',
    email: 'luca.operator@example.com',
    role: 'Operator',
    status: 'active',
    region: 'Milan',
    notes: 'Coordinates daily workspace handoffs.'
  }
]
