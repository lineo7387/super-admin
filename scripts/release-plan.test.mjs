import { describe, expect, it } from 'vitest'
import { createDependencyAwareReleasePlan, createInternalDependencyGraph } from './release-plan.mjs'

const candidates = [
  { name: '@super-admin-org/core', path: 'packages/core', scoped: true },
  { name: '@super-admin-org/theme', path: 'packages/theme', scoped: true },
  { name: '@super-admin-org/theme-base', path: 'packages/theme-base', scoped: true },
  { name: '@super-admin-org/theme-crypto', path: 'packages/theme-crypto', scoped: true },
  { name: '@super-admin-org/ui', path: 'packages/ui', scoped: true },
  { name: 'create-super-admin', path: 'packages/cli', scoped: false }
]

const manifests = {
  '@super-admin-org/core': {
    name: '@super-admin-org/core',
    version: '0.1.3'
  },
  '@super-admin-org/theme': {
    dependencies: {
      '@super-admin-org/core': '^0.1.3'
    },
    name: '@super-admin-org/theme',
    version: '0.1.3'
  },
  '@super-admin-org/theme-base': {
    dependencies: {
      '@super-admin-org/core': '^0.1.3'
    },
    name: '@super-admin-org/theme-base',
    version: '0.1.3'
  },
  '@super-admin-org/theme-crypto': {
    dependencies: {
      '@super-admin-org/core': '^0.1.3'
    },
    name: '@super-admin-org/theme-crypto',
    version: '0.1.3'
  },
  '@super-admin-org/ui': {
    name: '@super-admin-org/ui',
    version: '0.1.2'
  },
  'create-super-admin': {
    name: 'create-super-admin',
    version: '0.1.4'
  }
}

describe('dependency-aware release planning', () => {
  it('builds the internal dependency graph from publish candidate manifests', () => {
    expect(createInternalDependencyGraph({ candidates, manifests })).toEqual({
      '@super-admin-org/core': [],
      '@super-admin-org/theme': ['@super-admin-org/core'],
      '@super-admin-org/theme-base': ['@super-admin-org/core'],
      '@super-admin-org/theme-crypto': ['@super-admin-org/core'],
      '@super-admin-org/ui': [],
      'create-super-admin': []
    })
  })

  it('selects only the creator CLI for CLI-only releases', () => {
    const plan = createDependencyAwareReleasePlan({
      candidates,
      changedPackageNames: ['create-super-admin'],
      manifests
    })

    expect(plan.map((candidate) => candidate.name)).toEqual(['create-super-admin'])
  })

  it('selects only an independently changed theme profile', () => {
    const plan = createDependencyAwareReleasePlan({
      candidates,
      changedPackageNames: ['@super-admin-org/theme-base'],
      manifests
    })

    expect(plan.map((candidate) => candidate.name)).toEqual(['@super-admin-org/theme-base'])
  })

  it('expands core releases to internal dependents without unrelated packages', () => {
    const plan = createDependencyAwareReleasePlan({
      candidates,
      changedPackageNames: ['@super-admin-org/core'],
      manifests
    })

    expect(plan.map((candidate) => candidate.name)).toEqual([
      '@super-admin-org/core',
      '@super-admin-org/theme',
      '@super-admin-org/theme-base',
      '@super-admin-org/theme-crypto'
    ])
  })

  it('rejects packages outside the explicit publish candidate whitelist', () => {
    expect(() =>
      createDependencyAwareReleasePlan({
        candidates,
        changedPackageNames: ['@super-admin/admin'],
        manifests
      })
    ).toThrow(/Unknown publish candidate/)
  })
})
