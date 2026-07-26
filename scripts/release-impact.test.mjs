import { describe, expect, test } from 'vitest'
import {
  getChangedFilePaths,
  getReleaseImpactDetails,
  getReleaseImpactPackageNames,
  parseChangesetPackageNames,
  parseGitNameStatus,
  validateReleaseImpactChangesets
} from './release-impact.mjs'

describe('release impact changeset guard', () => {
  test('maps publishable package and canonical starter changes to release packages', () => {
    expect(
      getReleaseImpactPackageNames([
        'apps/admin/package.json',
        'apps/admin/src/api/reference/users.api.ts',
        'apps/admin/src/modules/users/UsersPage.test.ts',
        'apps/admin/src/modules/users/UsersPage.vue',
        'apps/admin/src/super-admin/starter-quality.test.ts',
        'packages/core/src/index.test.ts',
        'packages/core/src/index.ts',
        'packages/ui/README.md',
        'scripts/build-cli-template.mjs'
      ])
    ).toEqual(['@super-admin-org/core', '@super-admin-org/ui', 'create-super-admin'])
  })

  test('retains the exact trigger paths for every impacted package', () => {
    expect(getReleaseImpactDetails(['packages/ui/src/button.ts', 'apps/admin/src/App.vue', 'docs/guide/intro.md'])).toEqual([
      {
        packageName: '@super-admin-org/ui',
        triggerPaths: ['packages/ui/src/button.ts']
      },
      {
        packageName: 'create-super-admin',
        triggerPaths: ['apps/admin/src/App.vue']
      }
    ])
  })

  test('treats publishable package manifests as release impact but ignores generated release artifacts', () => {
    expect(
      getReleaseImpactPackageNames([
        'packages/theme/package.json',
        'packages/theme/CHANGELOG.md',
        'packages/theme/dist/index.js',
        'packages/theme/coverage/coverage.json'
      ])
    ).toEqual(['@super-admin-org/theme'])
  })

  test('maps the shared package builder to every package that consumes it', () => {
    expect(getReleaseImpactPackageNames(['scripts/build-publish-package.mjs'])).toEqual([
      '@super-admin-org/core',
      '@super-admin-org/theme',
      '@super-admin-org/theme-base',
      '@super-admin-org/theme-crypto',
      '@super-admin-org/theme-cyberpunk',
      '@super-admin-org/theme-industrial',
      '@super-admin-org/theme-newsprint',
      '@super-admin-org/ui'
    ])
  })

  test('excludes test-only config and directories while preserving the starter quality contract', () => {
    expect(
      getReleaseImpactPackageNames([
        'packages/cli/vitest.config.ts',
        'packages/core/tests/manifest.fixture.ts',
        'packages/theme/__tests__/profile.fixture.ts',
        'packages/ui/__snapshots__/button.fixture.ts',
        'apps/admin/src/modules/users/__tests__/users.fixture.ts'
      ])
    ).toEqual([])
    expect(getReleaseImpactPackageNames(['apps/admin/src/super-admin/starter-quality.test.ts'])).toEqual(['create-super-admin'])
  })

  test('parses package names from standard Changesets frontmatter', () => {
    expect(
      parseChangesetPackageNames(`---
"create-super-admin": patch
'@super-admin-org/core': minor
---

Describe the release.
`)
    ).toEqual(['create-super-admin', '@super-admin-org/core'])
  })

  test('parses changed, deleted, and renamed files from git name-status output', () => {
    expect(
      parseGitNameStatus(`M\tpackages/core/src/index.ts
D\t.changeset/removed.md
R100\tpackages/ui/src/old.ts\tpackages/ui/src/new.ts
`)
    ).toEqual([
      { path: 'packages/core/src/index.ts', status: 'M' },
      { path: '.changeset/removed.md', status: 'D' },
      { path: 'packages/ui/src/new.ts', previousPath: 'packages/ui/src/old.ts', status: 'R' }
    ])
  })

  test('keeps both sides of renames so moving runtime code out of a package remains release impact', () => {
    const changedEntries = parseGitNameStatus('R100\tpackages/core/src/legacy.ts\tdocs/legacy.ts')

    expect(getReleaseImpactPackageNames(getChangedFilePaths(changedEntries))).toEqual(['@super-admin-org/core'])
  })

  test('reports every impacted package without a changed changeset', () => {
    const failures = validateReleaseImpactChangesets({
      changedChangesetContents: [
        `---
"@super-admin-org/core": patch
---
`
      ],
      changedFiles: ['packages/core/src/index.ts', 'packages/ui/src/button.ts', 'apps/admin/src/App.vue']
    })

    expect(failures).toHaveLength(1)
    expect(failures[0]).toEqual(
      expect.objectContaining({
        id: 'release-impact-missing-changeset',
        missingImpacts: [
          {
            packageName: '@super-admin-org/ui',
            triggerPaths: ['packages/ui/src/button.ts']
          },
          {
            packageName: 'create-super-admin',
            triggerPaths: ['apps/admin/src/App.vue']
          }
        ],
        suggestion: expect.stringContaining('pnpm changeset')
      })
    )
    expect(failures[0].suggestion).toContain('"@super-admin-org/ui": patch')
    expect(failures[0].suggestion).toContain('"create-super-admin": patch')
    expect(failures[0].message).toContain('@super-admin-org/ui <- packages/ui/src/button.ts')
    expect(failures[0].message).toContain('create-super-admin <- apps/admin/src/App.vue')
  })

  test('passes when changed changesets cover all release impact', () => {
    expect(
      validateReleaseImpactChangesets({
        changedChangesetContents: [
          `---
"@super-admin-org/ui": patch
"create-super-admin": patch
---
`
        ],
        changedFiles: ['packages/ui/src/button.ts', 'apps/admin/components.json']
      })
    ).toEqual([])
  })
})
