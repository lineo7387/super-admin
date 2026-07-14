import { describe, expect, it } from 'vitest'
import * as publishReadiness from './publish-readiness.mjs'

const { createPackedManifestFailures, createTarballDependencyMap, rewriteStarterPackageJson } = publishReadiness

const completeCliRuntimeFiles = [
  'dist/cli.js',
  'dist/index.js',
  'dist/index.d.ts',
  'dist/starter-template/admin/components.json',
  'dist/starter-template/admin/src/App.vue',
  'dist/starter-template/admin/src/i18n/locales/en-US.ts',
  'dist/starter-template/admin/src/i18n/locales/zh-CN.ts',
  'dist/starter-template/admin/src/main.ts',
  'dist/starter-template/admin/src/super-admin/starter-quality.test.ts',
  'dist/starter-template/admin/src/super-admin/theme-registry.generated.ts',
  'README.md'
]

const cliManifest = {
  bin: {
    'create-super-admin': './dist/cli.js'
  },
  exports: {
    '.': {
      import: './dist/index.js',
      types: './dist/index.d.ts'
    }
  },
  main: './dist/index.js',
  types: './dist/index.d.ts'
}

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

  it('requires the UI package to expose Vue as a peer runtime', () => {
    const failures = createPackedManifestFailures({
      files: ['dist/index.js', 'dist/index.d.ts', 'README.md'],
      manifest: {
        dependencies: {
          vue: '^3.5.0'
        },
        exports: {
          '.': {
            import: './dist/index.js',
            types: './dist/index.d.ts'
          }
        },
        main: './dist/index.js',
        types: './dist/index.d.ts'
      },
      packageName: '@super-admin-org/ui'
    })

    expect(failures).toEqual([
      expect.objectContaining({
        id: 'packed-ui-vue-peer-runtime'
      })
    ])
  })

  it('requires the packed creator CLI to carry its runtime starter template', () => {
    const failures = createPackedManifestFailures({
      files: [
        'dist/cli.js',
        'dist/index.js',
        'dist/index.d.ts',
        'dist/starter-template/admin/components.json',
        'dist/starter-template/admin/src/App.vue',
        'dist/starter-template/admin/src/api/reference/users-reference.api.ts',
        'README.md'
      ],
      manifest: {
        bin: {
          'create-super-admin': './dist/cli.js'
        },
        exports: {
          '.': {
            import: './dist/index.js',
            types: './dist/index.d.ts'
          }
        },
        main: './dist/index.js',
        types: './dist/index.d.ts'
      },
      packageName: 'create-super-admin'
    })

    expect(failures.map((failure) => failure.id)).toEqual(['packed-cli-runtime-template-present', 'packed-cli-runtime-template-no-reference-api'])
  })

  it('allows the canonical starter quality test in the packed creator CLI', () => {
    const failures = createPackedManifestFailures({
      files: completeCliRuntimeFiles,
      manifest: cliManifest,
      packageName: 'create-super-admin'
    })

    expect(failures).toEqual([])
  })

  it('requires the canonical starter quality test in the packed creator CLI', () => {
    const failures = createPackedManifestFailures({
      files: completeCliRuntimeFiles.filter((file) => !file.endsWith('starter-quality.test.ts')),
      manifest: cliManifest,
      packageName: 'create-super-admin'
    })

    expect(failures).toEqual([
      expect.objectContaining({
        id: 'packed-cli-runtime-template-present',
        message: expect.stringContaining('dist/starter-template/admin/src/super-admin/starter-quality.test.ts')
      })
    ])
  })

  it('rejects non-canonical tests in the packed creator CLI', () => {
    const failures = createPackedManifestFailures({
      files: [...completeCliRuntimeFiles, 'dist/starter-template/admin/src/modules/users/users.test.ts'],
      manifest: cliManifest,
      packageName: 'create-super-admin'
    })

    expect(failures).toEqual([
      expect.objectContaining({
        id: 'packed-package-no-build-artifacts',
        message: expect.stringContaining('users.test.ts')
      })
    ])
  })

  it('defines standard and minimal packed starter validation variants', () => {
    expect(publishReadiness.localStarterValidationVariants).toEqual([
      expect.objectContaining({
        args: ['--theme', 'base'],
        label: 'starter-default',
        quality: 'standard'
      }),
      expect.objectContaining({
        args: ['--themes', 'base,cyberpunk', '--i18n'],
        quality: 'standard'
      }),
      expect.objectContaining({
        args: ['--theme', 'base', '--charts', 'echarts'],
        label: 'starter-echarts',
        quality: 'standard'
      }),
      expect.objectContaining({
        args: ['--theme', 'base', '--minimal'],
        label: 'starter-minimal',
        quality: 'minimal'
      })
    ])
  })

  it('passes the selected quality mode to generated starter validation', () => {
    expect(
      publishReadiness.createStarterValidationOptions({
        charts: 'none',
        i18n: false,
        quality: 'minimal',
        tarballs: [{ manifestPath: '/tmp/core/package.json' }, { manifestPath: '/tmp/cli/package.json' }],
        themes: ['base']
      })
    ).toEqual({
      charts: 'none',
      i18n: false,
      packageManager: 'pnpm',
      packageManifestPaths: ['/tmp/core/package.json', '/tmp/cli/package.json'],
      quality: 'minimal',
      themes: ['base']
    })
  })
})
