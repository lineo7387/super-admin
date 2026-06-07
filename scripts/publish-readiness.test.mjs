import { describe, expect, it } from 'vitest'
import { createPackedManifestFailures, createTarballDependencyMap, rewriteStarterPackageJson } from './publish-readiness.mjs'

describe('publish readiness helpers', () => {
  it('rewrites generated starter package dependencies to local tarballs', () => {
    const tarballs = createTarballDependencyMap('/tmp/starter', [
      {
        name: '@super-admin-org/core',
        tarballPath: '/tmp/artifacts/super-admin-org-core-0.1.0.tgz'
      },
      {
        name: '@super-admin-org/theme-base',
        tarballPath: '/tmp/artifacts/super-admin-org-theme-base-0.1.0.tgz'
      }
    ])

    const packageJson = rewriteStarterPackageJson(
      {
        dependencies: {
          '@super-admin-org/core': '^0.1.0',
          '@super-admin-org/theme-base': '^0.1.0',
          vue: '^3.5.0'
        }
      },
      tarballs
    )

    expect(packageJson.dependencies).toEqual({
      '@super-admin-org/core': 'file:../artifacts/super-admin-org-core-0.1.0.tgz',
      '@super-admin-org/theme-base': 'file:../artifacts/super-admin-org-theme-base-0.1.0.tgz',
      vue: '^3.5.0'
    })
  })

  it('rejects packed manifests with workspace ranges or missing export files', () => {
    const failures = createPackedManifestFailures({
      files: ['dist/index.js', 'dist/index.d.ts', 'README.md', 'tsconfig.tsbuildinfo'],
      manifest: {
        dependencies: {
          '@super-admin-org/core': 'workspace:*'
        },
        exports: {
          '.': {
            import: './dist/missing.js',
            types: './dist/index.d.ts'
          }
        },
        main: './dist/index.js',
        types: './dist/index.d.ts'
      },
      packageName: '@super-admin-org/theme'
    })

    expect(failures.map((failure) => failure.id)).toEqual([
      'packed-package-no-workspace-ranges',
      'packed-package-export-target-exists',
      'packed-package-no-build-artifacts'
    ])
  })
})
