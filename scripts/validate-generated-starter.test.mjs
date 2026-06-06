import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { validateGeneratedStarterStatic } from './validate-generated-starter.mjs'

async function writeText(root, filePath, content) {
  const target = join(root, filePath)
  await mkdir(join(target, '..'), { recursive: true })
  await writeFile(target, content)
}

async function createStarterFixture(overrides = {}) {
  const root = await mkdtemp(join(tmpdir(), 'super-admin-generated-starter-'))
  const packageJson = {
    name: 'generated-admin',
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vue-tsc --noEmit && vite build',
      typecheck: 'vue-tsc --noEmit',
      preview: 'vite preview'
    },
    dependencies: {
      '@super-admin/core': '^0.0.0',
      '@super-admin/theme': '^0.0.0',
      '@super-admin/theme-base': '^0.0.0',
      '@super-admin/ui': '^0.0.0',
      '@tanstack/vue-query': '^5.0.0',
      'lucide-vue-next': '^0.555.0',
      pinia: '^3.0.0',
      vue: '^3.5.0',
      'vue-i18n': '^11.4.4',
      'vue-router': '^4.5.0',
      ...overrides.dependencies
    },
    devDependencies: {
      '@tailwindcss/vite': '^4.0.0',
      '@vitejs/plugin-vue': '^6.0.0',
      '@vue/tsconfig': '^0.8.0',
      tailwindcss: '^4.0.0',
      typescript: '^5.0.0',
      vite: '^7.0.0',
      'vue-tsc': '^3.0.0',
      ...overrides.devDependencies
    }
  }

  if (overrides.scripts) {
    packageJson.scripts = {
      ...packageJson.scripts,
      ...overrides.scripts
    }
  }

  await writeText(root, 'package.json', `${JSON.stringify(packageJson, null, 2)}\n`)
  await writeText(
    root,
    'tsconfig.json',
    overrides.tsconfig ??
      JSON.stringify(
        {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              '@/*': ['src/*']
            },
            strict: true
          },
          include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.d.ts']
        },
        null,
        2
      )
  )
  await writeText(
    root,
    'vite.config.ts',
    "import vue from '@vitejs/plugin-vue'\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({ plugins: [vue()] })\n"
  )
  await writeText(root, 'index.html', '<!doctype html><html lang="zh-CN"><body><div id="app"></div></body></html>\n')
  await writeText(root, 'src/styles/main.css', overrides.mainCss ?? '@import "tailwindcss";\n')
  await writeText(
    root,
    'src/env.d.ts',
    overrides.envDts ??
      "declare module '*.vue' {\n  import type { DefineComponent } from 'vue'\n  const component: DefineComponent<object, object, unknown>\n  export default component\n}\n"
  )
  await writeText(
    root,
    'src/super-admin/theme-registry.generated.ts',
    overrides.themeRegistry ??
      "import type { DesignProfile, DesignProfileId } from '@super-admin/core'\nimport { baseProfile } from '@super-admin/theme-base'\n\nexport const builtInDesignProfiles = [baseProfile] as const\n\nexport function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {\n  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile\n}\n"
  )
  await writeText(root, 'src/i18n/locales/zh-CN.ts', 'export default {}\n')
  await writeText(root, 'src/shell/preferences/GlobalPreferences.vue', overrides.preferences ?? '<template><div /></template>\n')
  await writeText(root, 'src/api/mock/users.mock.ts', 'export const mockUsers = []\n')
  await writeText(root, 'src/api/users.api.ts', "import { mockUsers } from './mock/users.mock'\nexport async function listUsers() { return mockUsers }\n")
  await writeText(root, 'src/modules/users/users.queries.ts', "import { listUsers } from '@/api/users.api'\nexport function useUsersQuery() { return listUsers() }\n")
  await writeText(root, 'src/modules/users/UsersAllPage.vue', overrides.usersPage ?? '<script setup lang="ts">\nimport { useUsersQuery } from "./users.queries"\nuseUsersQuery()\n</script>\n')

  for (const [filePath, content] of Object.entries(overrides.files ?? {})) {
    await writeText(root, filePath, content)
  }

  return root
}

function failureIds(failures) {
  return failures.map((failure) => failure.id)
}

describe('generated starter validator', () => {
  it('accepts a default single-theme generated starter fixture', async () => {
    const root = await createStarterFixture()

    await expect(validateGeneratedStarterStatic(root, { themes: ['base'] })).resolves.toEqual([])
  })

  it('rejects workspace dependency specifiers and monorepo path leaks', async () => {
    const root = await createStarterFixture({
      dependencies: {
        '@super-admin/core': 'workspace:*'
      },
      mainCss: '@import "tailwindcss";\n@source "../../../../packages/ui/src";\n',
      tsconfig: JSON.stringify({
        compilerOptions: {
          paths: {
            '@/*': ['src/*'],
            '@super-admin/core': ['../../packages/core/src/index.ts']
          }
        }
      })
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toEqual(
      expect.arrayContaining(['package-no-workspace-ranges', 'tsconfig-no-package-path-aliases', 'source-no-monorepo-package-paths'])
    )
  })

  it('rejects reference backend code and maintainer tooling in default output', async () => {
    const root = await createStarterFixture({
      envDts: 'interface ImportMetaEnv { readonly VITE_SUPER_ADMIN_REFERENCE_TOKEN?: string }\n',
      scripts: {
        docs: 'vitepress dev docs',
        lint: 'vue-tsc --noEmit',
        test: 'vitest run'
      },
      devDependencies: {
        '@playwright/test': '^1.60.0',
        vitepress: '^1.6.4',
        vitest: '^4.0.0'
      },
      files: {
        'docs/index.md': '# Docs\n',
        'src/api/reference/users-reference.api.ts': 'export const referenceUsers = []\n',
        'src/modules/users/users.validation.test.ts': 'import { expect, it } from "vitest"\n'
      }
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toEqual(
      expect.arrayContaining([
        'package-default-scripts-only',
        'source-no-reference-env',
        'source-no-reference-api',
        'source-no-generated-tests',
        'package-no-maintainer-tooling-dependencies',
        'root-no-docs-site'
      ])
    )
  })

  it('rejects workspace ranges in packed package manifests passed to validation', async () => {
    const root = await createStarterFixture()
    const packedManifestPath = join(root, 'packed-theme-package.json')
    await writeFile(
      packedManifestPath,
      JSON.stringify(
        {
          name: '@super-admin/theme-base',
          version: '0.0.0',
          dependencies: {
            '@super-admin/core': 'workspace:*'
          }
        },
        null,
        2
      )
    )

    const failures = await validateGeneratedStarterStatic(root, {
      packageManifestPaths: [packedManifestPath],
      themes: ['base']
    })

    expect(failureIds(failures)).toContain('packed-package-no-workspace-ranges')
  })

  it('validates selected theme package and registry boundaries', async () => {
    const invalidDefault = await createStarterFixture({
      dependencies: {
        '@super-admin/theme-cyberpunk': '^0.0.0'
      },
      themeRegistry:
        "import { baseProfile } from '@super-admin/theme-base'\nimport { cyberpunkProfile } from '@super-admin/theme-cyberpunk'\nexport const builtInDesignProfiles = [baseProfile, cyberpunkProfile] as const\n"
    })
    const validMultiTheme = await createStarterFixture({
      dependencies: {
        '@super-admin/theme-cyberpunk': '^0.0.0'
      },
      themeRegistry:
        "import { baseProfile } from '@super-admin/theme-base'\nimport { cyberpunkProfile } from '@super-admin/theme-cyberpunk'\nexport const builtInDesignProfiles = [baseProfile, cyberpunkProfile] as const\n"
    })

    expect(failureIds(await validateGeneratedStarterStatic(invalidDefault, { themes: ['base'] }))).toEqual(
      expect.arrayContaining(['theme-packages-match-selection', 'theme-registry-imports-match-selection'])
    )
    await expect(validateGeneratedStarterStatic(validMultiTheme, { themes: ['base', 'cyberpunk'] })).resolves.toEqual([])
  })

  it('rejects direct transport calls from generated module pages', async () => {
    const root = await createStarterFixture({
      usersPage: '<script setup lang="ts">\nconst response = await fetch("/api/users")\n</script>\n'
    })

    const failures = await validateGeneratedStarterStatic(root, { themes: ['base'] })

    expect(failureIds(failures)).toContain('module-pages-no-direct-transport')
  })
})
