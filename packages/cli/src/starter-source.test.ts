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
import type { NormalizedStarterGenerationInput } from './parse-args.js'

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = resolve(packageDirectory, '../..')

function createInput(): NormalizedStarterGenerationInput {
  return {
    charts: { provider: 'none' },
    examples: { included: true },
    i18n: { default: 'zh-CN', installed: ['zh-CN'], switcher: false },
    packageManager: 'pnpm',
    packageName: 'starter-policy-test',
    projectName: 'starter-policy-test',
    quality: 'standard',
    targetDirectory: '/tmp/starter-policy-test',
    themes: { default: 'base', installed: ['base'] }
  }
}

describe('starter source derivation policy', () => {
  it('keeps generator-owned templates limited to files without app-source equivalents', async () => {
    const templatesSource = await readFile(resolve(packageDirectory, 'src/templates.ts'), 'utf8')
    const sourceFile = ts.createSourceFile('templates.ts', templatesSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    const exportedValues = sourceFile.statements
      .filter((statement): statement is ts.ExportDeclaration => ts.isExportDeclaration(statement) && !statement.isTypeOnly)
      .flatMap((statement) =>
        statement.exportClause && ts.isNamedExports(statement.exportClause)
          ? statement.exportClause.elements.filter((element) => !element.isTypeOnly).map((element) => element.name.text)
          : []
      )
      .sort()

    expect(exportedValues).toEqual([...GENERATOR_OWNED_TEMPLATE_EXPORTS].sort())
    expect(
      sourceFile.statements.filter(
        (statement) =>
          ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement) || ts.isVariableStatement(statement) || ts.isTypeAliasDeclaration(statement)
      )
    ).toHaveLength(0)

    const templateModules = {
      'template-ai-context.ts': ['createAgentsMd', 'createAiContextFiles', 'createClaudeMd'],
      'template-app-config.ts': ['createIndexHtml', 'createSuperAdminConfig', 'createTsconfig', 'createViteConfig'],
      'template-package.ts': ['createEslintConfig', 'createPackageJson', 'createVitestConfig'],
      'template-public-docs.ts': ['createReadme']
    }
    for (const [fileName, expectedExports] of Object.entries(templateModules)) {
      const moduleSource = await readFile(resolve(packageDirectory, `src/${fileName}`), 'utf8')
      const moduleFile = ts.createSourceFile(fileName, moduleSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
      const moduleExports = moduleFile.statements
        .filter(
          (statement) =>
            ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) === true
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

      expect(moduleExports).toEqual(expectedExports.sort())
    }
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

  it('excludes unselected locale catalogs and the complete Examples slice', async () => {
    const input = createInput()
    input.examples.included = false
    input.i18n = {
      default: 'en-US',
      installed: ['en-US'],
      switcher: false
    }

    expect(resolveStarterSourceAction('i18n/locales/zh-CN.ts', input).kind).toBe('exclude')
    expect(resolveStarterSourceAction('i18n/locales/en-US.ts', input).kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/examples/examples.registration.ts', input).kind).toBe('exclude')
    expect(resolveStarterSourceAction('modules/users/UsersAllPage.vue', input).kind).toBe('exclude')
    expect(resolveStarterSourceAction('api/mock/users.mock.ts', input).kind).toBe('exclude')
    expect(resolveStarterSourceAction('modules/ui-kit/UiKitPage.vue', input).kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/module-registry.ts', input).kind).toBe('transform')
  })

  it('derives the auth recipe registry and recipe files from installed themes', async () => {
    const input = createInput()
    const sourceRoot = resolve(repositoryRoot, 'apps/admin/src')
    const registrySource = await readFile(resolve(sourceRoot, 'modules/auth/components/auth-recipe-registry.generated.ts'), 'utf8')
    const baseRegistry = transformStarterSourceText('modules/auth/components/auth-recipe-registry.generated.ts', registrySource, input)

    expect(baseRegistry).toContain("import BaseAuthRecipe from './recipes/BaseAuthRecipe.vue'")
    expect(baseRegistry).toContain("profileId: 'base'")
    expect(baseRegistry).toContain('NeutralAuthRecipe')
    expect(baseRegistry).not.toContain('CryptoAuthRecipe')
    expect(baseRegistry).not.toContain('CyberpunkAuthRecipe')
    expect(baseRegistry).not.toContain('@starter-auth-recipe')
    expect(resolveStarterSourceAction('modules/auth/components/recipes/BaseAuthRecipe.vue', input).kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/auth/components/recipes/NeutralAuthRecipe.vue', input).kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/auth/components/recipes/CryptoAuthRecipe.vue', input).kind).toBe('exclude')

    input.themes = { default: 'base', installed: ['base', 'cyberpunk'] }
    const multiRegistry = transformStarterSourceText('modules/auth/components/auth-recipe-registry.generated.ts', registrySource, input)

    expect(multiRegistry).toContain('BaseAuthRecipe')
    expect(multiRegistry).toContain('CyberpunkAuthRecipe')
    expect(multiRegistry).not.toContain('CryptoAuthRecipe')
    expect(resolveStarterSourceAction('modules/auth/components/recipes/CyberpunkAuthRecipe.vue', input).kind).toBe('copy')
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
        'modules/auth/components/auth-recipe-registry.generated.ts',
        'i18n/index.ts',
        'router/index.ts',
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
    const invariantExcludedPaths = ['api/reference/auth-reference.api.ts', 'modules/users/users.validation.test.ts', 'cache.tsbuildinfo']

    for (const path of invariantExcludedPaths) {
      expect(resolveRuntimeTemplateAction(path).kind).toBe('exclude')
      expect(resolveStarterSourceAction(path, input).kind).toBe('exclude')
    }

    expect(resolveRuntimeTemplateAction('modules/users/UsersAllPage.vue').kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/users/UsersAllPage.vue', input).kind).toBe('copy')
    expect(resolveRuntimeTemplateAction('modules/access/access.manifest.ts').kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/access/access.manifest.ts', input).kind).toBe('copy')
  })

  it('keeps variant-only exclusions out of the runtime snapshot policy', () => {
    const input = createInput()

    expect(resolveRuntimeTemplateAction('i18n/locales/en-US.ts').kind).toBe('copy')
    expect(resolveStarterSourceAction('i18n/locales/en-US.ts', input).kind).toBe('exclude')
    expect(resolveRuntimeTemplateAction('modules/charts/ChartsPage.vue').kind).toBe('copy')
    expect(resolveStarterSourceAction('modules/charts/ChartsPage.vue', input).kind).toBe('exclude')
  })
})
