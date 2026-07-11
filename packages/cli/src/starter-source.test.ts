import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import {
  APP_SOURCE_TRANSFORM_PATHS,
  GENERATOR_OWNED_OUTPUT_PATHS,
  GENERATOR_OWNED_TEMPLATE_EXPORTS,
  materializeRuntimeTemplate,
  resolveRuntimeTemplateAction,
  resolveStarterRootAction,
  resolveStarterSourceAction,
  transformStarterSourceText
} from './starter-source.js'
import type { StarterGenerationInput } from './parse-args.js'

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = resolve(packageDirectory, '../..')

function createInput(): StarterGenerationInput {
  return {
    charts: { provider: 'none' },
    i18n: { default: 'zh-CN', installed: ['zh-CN'], switcher: false },
    packageManager: 'pnpm',
    packageName: 'starter-policy-test',
    projectName: 'starter-policy-test',
    targetDirectory: '/tmp/starter-policy-test',
    themes: { default: 'base', installed: ['base'] }
  }
}

describe('starter source derivation policy', () => {
  it('keeps generator-owned templates limited to files without app-source equivalents', async () => {
    const templatesSource = await readFile(resolve(packageDirectory, 'src/templates.ts'), 'utf8')
    const sourceFile = ts.createSourceFile('templates.ts', templatesSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    const exportedValues = sourceFile.statements
      .filter(
        (statement) => ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) === true
      )
      .flatMap((statement) => {
        if (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement) || ts.isEnumDeclaration(statement)) {
          return statement.name ? [statement.name.text] : []
        }

        if (ts.isVariableStatement(statement)) {
          return statement.declarationList.declarations.flatMap((declaration) => (ts.isIdentifier(declaration.name) ? [declaration.name.text] : []))
        }

        return []
      })
      .sort()

    expect(exportedValues).toEqual([...GENERATOR_OWNED_TEMPLATE_EXPORTS].sort())
    expect(GENERATOR_OWNED_TEMPLATE_EXPORTS).not.toContain('createPreferencesStore')
    expect(GENERATOR_OWNED_TEMPLATE_EXPORTS).not.toContain('createGlobalPreferences')
    expect(GENERATOR_OWNED_TEMPLATE_EXPORTS).not.toContain('createLoginPage')
    expect(GENERATOR_OWNED_OUTPUT_PATHS.every((filePath) => !filePath.startsWith('src/'))).toBe(true)
    for (const filePath of GENERATOR_OWNED_OUTPUT_PATHS) {
      expect(resolveStarterRootAction(filePath).kind).toBe('generate')
    }
    expect(resolveStarterRootAction('src/stores/preferences.store.ts').kind).toBe('exclude')

    const starterSource = await readFile(resolve(packageDirectory, 'src/starter-source.ts'), 'utf8')
    expect(starterSource).not.toContain("from './templates.js'")
  })

  it('derives reference-free default app files from the canonical admin source', async () => {
    const input = createInput()
    const sourceRoot = resolve(repositoryRoot, 'apps/admin/src')
    const readTransformed = async (relativePath: string): Promise<string> => {
      const source = await readFile(resolve(sourceRoot, relativePath), 'utf8')
      return transformStarterSourceText(relativePath, source, input)
    }

    const env = await readTransformed('env.d.ts')
    const usersApi = await readTransformed('api/users.api.ts')
    const login = await readTransformed('modules/auth/LoginPage.vue')
    const preferences = await readTransformed('stores/preferences.store.ts')
    const globalPreferences = await readTransformed('shell/preferences/GlobalPreferences.vue')

    expect(env).toContain('VITE_SUPER_ADMIN_ASSISTANT_ENDPOINT')
    expect(env).not.toContain('VITE_SUPER_ADMIN_REFERENCE_TOKEN')
    expect(usersApi).not.toContain('@/api/reference/')
    expect(login).not.toContain('@/api/reference/')
    expect(login).toContain('createTemplateAuthSession()')
    expect(preferences).toContain("import superAdminConfig from '../../super-admin.config'")
    expect(preferences).toContain('resolveLocale')
    expect(globalPreferences).not.toContain('v-for="profile in builtInDesignProfiles"')
    expect(globalPreferences).not.toContain('v-for="localeOption in localeOptions"')
    expect(globalPreferences).toContain("t('shell.preferences.aiProvider')")
  })

  it('keeps selected theme and locale variants source-derived', async () => {
    const input = createInput()
    input.themes = { default: 'cyberpunk', installed: ['base', 'cyberpunk'] }
    input.i18n = { default: 'zh-CN', installed: ['zh-CN', 'en-US'], switcher: true }
    const sourceRoot = resolve(repositoryRoot, 'apps/admin/src')

    const themeRegistry = transformStarterSourceText(
      'super-admin/theme-registry.generated.ts',
      await readFile(resolve(sourceRoot, 'super-admin/theme-registry.generated.ts'), 'utf8'),
      input
    )
    const i18n = transformStarterSourceText('i18n/index.ts', await readFile(resolve(sourceRoot, 'i18n/index.ts'), 'utf8'), input)
    const globalPreferences = transformStarterSourceText(
      'shell/preferences/GlobalPreferences.vue',
      await readFile(resolve(sourceRoot, 'shell/preferences/GlobalPreferences.vue'), 'utf8'),
      input
    )

    expect(themeRegistry).toContain("from '@super-admin-org/theme-base'")
    expect(themeRegistry).toContain("from '@super-admin-org/theme-cyberpunk'")
    expect(themeRegistry).not.toContain("from '@super-admin-org/theme-crypto'")
    expect(themeRegistry).toContain('?? cyberpunkProfile')
    expect(i18n).toContain("import enUS from './locales/en-US'")
    expect(globalPreferences).toContain('v-for="profile in builtInDesignProfiles"')
    expect(globalPreferences).toContain('v-for="localeOption in localeOptions"')
  })

  it('materializes the runtime snapshot through the shared invariant policy', async () => {
    const targetDirectory = await mkdtemp(resolve(tmpdir(), 'super-admin-runtime-template-'))

    try {
      await materializeRuntimeTemplate(resolve(repositoryRoot, 'apps/admin'), targetDirectory)

      expect(await readdir(targetDirectory)).toEqual(expect.arrayContaining(['components.json', 'src']))
      await expect(readFile(resolve(targetDirectory, 'src/modules/users/UsersAllPage.vue'), 'utf8')).resolves.toContain('<template>')
      await expect(readFile(resolve(targetDirectory, 'src/api/reference/auth-reference.api.ts'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(readFile(resolve(targetDirectory, 'src/modules/users/users.validation.test.ts'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
    } finally {
      await rm(targetDirectory, { force: true, recursive: true })
    }
  })

  it('declares every intentional app-source transform in one inventory', () => {
    expect(APP_SOURCE_TRANSFORM_PATHS).toEqual(
      expect.arrayContaining([
        'env.d.ts',
        'api/users.api.ts',
        'modules/auth/LoginPage.vue',
        'modules/auth/auth-session.ts',
        'i18n/index.ts',
        'shell/preferences/GlobalPreferences.vue',
        'super-admin/theme-registry.generated.ts'
      ])
    )

    for (const path of APP_SOURCE_TRANSFORM_PATHS) {
      expect(resolveStarterSourceAction(path, createInput()).kind).toBe('transform')
    }

    expect(resolveStarterSourceAction('stores/preferences.store.ts', createInput()).kind).toBe('copy')
  })

  it('uses the same invariant exclusions for runtime snapshots and starter generation', () => {
    const input = createInput()
    const invariantExcludedPaths = [
      'api/reference/auth-reference.api.ts',
      'modules/users/users.validation.test.ts',
      'modules/access/access.manifest.ts',
      'cache.tsbuildinfo'
    ]

    for (const path of invariantExcludedPaths) {
      expect(resolveRuntimeTemplateAction(path).kind).toBe('exclude')
      expect(resolveStarterSourceAction(path, input).kind).toBe('exclude')
    }

    expect(resolveRuntimeTemplateAction('modules/users/UsersAllPage.vue').kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/users/UsersAllPage.vue', input).kind).toBe('copy')
  })

  it('keeps variant-only exclusions out of the runtime snapshot policy', () => {
    const input = createInput()

    expect(resolveRuntimeTemplateAction('i18n/locales/en-US.ts').kind).toBe('copy')
    expect(resolveStarterSourceAction('i18n/locales/en-US.ts', input).kind).toBe('exclude')
    expect(resolveRuntimeTemplateAction('modules/charts/ChartsPage.vue').kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/charts/ChartsPage.vue', input).kind).toBe('exclude')
  })
})
