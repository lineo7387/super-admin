import { cp, mkdir, readFile, readdir, rename, rm, rmdir, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Dirent } from 'node:fs'
import type { StarterGenerationInput } from './parse-args.js'
import {
  createAuthSession,
  createAuthSessionStore,
  createAuthTypes,
  createEnvDts,
  createGlobalPreferences,
  createI18nIndex,
  createIndexHtml,
  createLoginPage,
  createPackageJson,
  createPreferencesStore,
  createReadme,
  createSuperAdminConfig,
  createThemeRegistry,
  createTsconfig,
  createUsersApi,
  createViteConfig
} from './templates.js'

export type GenerateStarterOptions = {
  sourceRoot?: string
}

export type GenerateStarterResult = {
  targetDirectory: string
}

type TransformContext = {
  input: StarterGenerationInput
}

const UNREGISTERED_STANDALONE_MANIFESTS = new Set([
  'modules/access/access.manifest.ts',
  'modules/dashboard/dashboard.manifest.ts',
  'modules/users/users.manifest.ts',
  'modules/workbench/workbench.manifest.ts'
])

function getDefaultSourceAppDir(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), 'starter-template/admin')
}

function toPosixPath(path: string): string {
  return path.split(sep).join('/')
}

async function directoryEntries(path: string): Promise<Dirent[] | null> {
  try {
    return await readdir(path, { withFileTypes: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null
    }

    throw error
  }
}

async function ensureTargetIsWritable(targetDirectory: string): Promise<void> {
  const entries = await directoryEntries(targetDirectory)

  if (!entries) {
    return
  }

  if (entries.length > 0) {
    throw new Error(`Target directory is not empty: ${targetDirectory}`)
  }
}

async function writeText(root: string, filePath: string, content: string): Promise<void> {
  const target = resolve(root, filePath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

function shouldSkipSourceFile(relativePath: string, context: TransformContext): boolean {
  if (UNREGISTERED_STANDALONE_MANIFESTS.has(relativePath)) {
    return true
  }

  if (relativePath.startsWith('api/reference/')) {
    return true
  }

  if (/\.(test|spec)\.(ts|tsx|js|mjs)$/.test(relativePath)) {
    return true
  }

  if (relativePath.endsWith('.tsbuildinfo')) {
    return true
  }

  if (!context.input.i18n.switcher && relativePath === 'i18n/locales/en-US.ts') {
    return true
  }

  if (context.input.charts.provider === 'none' && (relativePath.startsWith('modules/charts/') || relativePath.startsWith('shared/charts/'))) {
    return true
  }

  return false
}

function removeOptionalChartsExample(text: string): string {
  return text
    .replace(`      {
        label: 'Charts',
        path: '/examples/charts',
        icon: 'charts'
      },
`, '')
    .replace(`    {
      path: '/examples/charts',
      name: 'examples-charts',
      component: () => import('../charts/ChartsPage.vue'),
      meta: {
        title: 'Charts',
        description: 'Theme-adapted ECharts examples that users can keep, override, or remove.',
        regions: ['summary', 'primary', 'context'],
        keepAlive: { enabled: true }
      }
    },
`, '')
}

function transformSourceText(relativePath: string, text: string, context: TransformContext): string {
  if (relativePath === 'env.d.ts') {
    return createEnvDts()
  }

  if (relativePath === 'api/users.api.ts') {
    return createUsersApi()
  }

  if (relativePath === 'modules/auth/LoginPage.vue') {
    return createLoginPage()
  }

  if (relativePath === 'modules/auth/auth-session.ts') {
    return createAuthSession()
  }

  if (relativePath === 'modules/auth/auth.types.ts') {
    return createAuthTypes()
  }

  if (relativePath === 'stores/auth-session.store.ts') {
    return createAuthSessionStore()
  }

  if (relativePath === 'stores/preferences.store.ts') {
    return createPreferencesStore()
  }

  if (relativePath === 'i18n/index.ts') {
    return createI18nIndex(context.input.i18n.installed)
  }

  if (relativePath === 'shell/preferences/GlobalPreferences.vue') {
    return createGlobalPreferences({
      includeLocaleSwitcher: context.input.i18n.switcher,
      includeThemeSwitcher: context.input.themes.installed.length > 1
    })
  }

  if (relativePath === 'super-admin/theme-registry.generated.ts') {
    return createThemeRegistry(context.input.themes.installed, context.input.themes.default)
  }

  if (relativePath === 'modules/examples/examples.manifest.ts' && context.input.charts.provider === 'none') {
    return removeOptionalChartsExample(text)
  }

  if (relativePath === 'styles/main.css') {
    return text.replace('@source "../../../../packages/ui/src";', '@source "../../node_modules/@super-admin-org/ui/dist";')
  }

  return text
}

async function copySourceDirectory(sourceDir: string, targetDir: string, context: TransformContext, currentDir = sourceDir): Promise<void> {
  const entries = await readdir(currentDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = resolve(currentDir, entry.name)
    const relativePath = toPosixPath(relative(sourceDir, sourcePath))

    if (entry.isDirectory()) {
      if (shouldSkipSourceFile(`${relativePath}/`, context)) {
        continue
      }

      await copySourceDirectory(sourceDir, targetDir, context, sourcePath)
      continue
    }

    if (!entry.isFile() || shouldSkipSourceFile(relativePath, context)) {
      continue
    }

    const targetPath = resolve(targetDir, relativePath)
    await mkdir(dirname(targetPath), { recursive: true })
    const text = await readFile(sourcePath, 'utf8')
    await writeFile(targetPath, transformSourceText(relativePath, text, context))
  }
}

async function writeGeneratedRootFiles(outputRoot: string, input: StarterGenerationInput, sourceAppDir: string): Promise<void> {
  await cp(resolve(sourceAppDir, 'components.json'), resolve(outputRoot, 'components.json'))
  await writeText(outputRoot, 'index.html', createIndexHtml(input.projectName))
  await writeText(outputRoot, 'package.json', createPackageJson(input))
  await writeText(outputRoot, 'README.md', createReadme(input.projectName, input.packageManager))
  await writeText(outputRoot, 'super-admin.config.ts', createSuperAdminConfig(input))
  await writeText(outputRoot, 'tsconfig.json', createTsconfig())
  await writeText(outputRoot, 'vite.config.ts', createViteConfig())
}

async function materializeOutput(tempDirectory: string, targetDirectory: string): Promise<void> {
  const targetEntries = await directoryEntries(targetDirectory)

  if (targetEntries && targetEntries.length === 0) {
    await rmdir(targetDirectory)
  }

  await rename(tempDirectory, targetDirectory)
}

export async function generateStarter(
  input: StarterGenerationInput,
  options: GenerateStarterOptions = {}
): Promise<GenerateStarterResult> {
  const sourceAppDir = options.sourceRoot ? resolve(options.sourceRoot, 'apps/admin') : getDefaultSourceAppDir()
  const targetDirectory = input.targetDirectory
  const tempDirectory = resolve(dirname(targetDirectory), `.${input.projectName}.tmp-${Date.now()}-${process.pid}`)
  const context: TransformContext = {
    input
  }

  await ensureTargetIsWritable(targetDirectory)
  await rm(tempDirectory, { force: true, recursive: true })
  await mkdir(tempDirectory, { recursive: true })

  try {
    await writeGeneratedRootFiles(tempDirectory, input, sourceAppDir)
    await copySourceDirectory(resolve(sourceAppDir, 'src'), resolve(tempDirectory, 'src'), context)
    await materializeOutput(tempDirectory, targetDirectory)
  } catch (error) {
    await rm(tempDirectory, { force: true, recursive: true })
    throw error
  }

  return {
    targetDirectory
  }
}
