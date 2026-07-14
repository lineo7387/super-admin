import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve, sep } from 'node:path'
import type { NormalizedStarterGenerationInput } from './parse-args.js'
import { themeDefinitions } from './theme-options.js'

export type StarterSourceAction = {
  kind: 'copy' | 'exclude' | 'generate' | 'transform'
}

export const APP_SOURCE_TRANSFORM_PATHS = [
  'api/users.api.ts',
  'env.d.ts',
  'i18n/index.ts',
  'modules/auth/LoginPage.vue',
  'modules/auth/auth-session.ts',
  'modules/auth/components/auth-recipe-registry.generated.ts',
  'modules/examples/examples.manifest.ts',
  'shell/preferences/GlobalPreferences.vue',
  'shell/use-command-palette-items.ts',
  'styles/main.css',
  'super-admin/theme-registry.generated.ts'
] as const

export const GENERATOR_OWNED_TEMPLATE_EXPORTS = [
  'createAgentsMd',
  'createAiContextFiles',
  'createClaudeMd',
  'createEslintConfig',
  'createIndexHtml',
  'createPackageJson',
  'createReadme',
  'createSuperAdminConfig',
  'createTsconfig',
  'createVitestConfig',
  'createViteConfig'
] as const

export const GENERATOR_OWNED_OUTPUT_PATHS = [
  'AGENTS.md',
  'CLAUDE.md',
  'eslint.config.js',
  'README.md',
  'ai-context/charts.md',
  'ai-context/core.md',
  'ai-context/data-flow.md',
  'ai-context/extension-points.md',
  'ai-context/i18n.md',
  'ai-context/theme.md',
  'index.html',
  'package.json',
  'super-admin.config.ts',
  'tsconfig.json',
  'vite.config.ts',
  'vitest.config.ts'
] as const

export const STARTER_QUALITY_SOURCE_PATHS = ['super-admin/starter-quality.test.ts'] as const

function isInvariantExcludedPath(relativePath: string): boolean {
  if ((STARTER_QUALITY_SOURCE_PATHS as readonly string[]).includes(relativePath)) {
    return false
  }

  return (
    relativePath === 'api/reference' ||
    relativePath.startsWith('api/reference/') ||
    /\.(test|spec)\.(ts|tsx|js|mjs)$/.test(relativePath) ||
    relativePath.endsWith('.tsbuildinfo')
  )
}

function toPosixPath(path: string): string {
  return path.split(sep).join('/')
}

function replaceSourceSection(text: string, name: string, replacement: string | null): string {
  const lines = text.split('\n')
  const output: string[] = []
  const startMarker = `@starter-${name}:start`
  const endMarker = `@starter-${name}:end`

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index]?.includes(startMarker)) {
      output.push(lines[index] ?? '')
      continue
    }

    const endIndex = lines.findIndex((line, candidateIndex) => candidateIndex > index && line.includes(endMarker))
    if (endIndex === -1) {
      throw new Error(`Missing ${endMarker} marker.`)
    }

    if (replacement === null) {
      output.push(...lines.slice(index + 1, endIndex))
    } else if (replacement) {
      output.push(...replacement.split('\n'))
    }

    index = endIndex
  }

  return output.join('\n')
}

function transformThemeRegistry(text: string, input: NormalizedStarterGenerationInput): string {
  const imports = input.themes.installed
    .map((themeId) => {
      const definition = themeDefinitions[themeId]
      return `import { ${definition.profileExport} } from '${definition.packageName}'`
    })
    .join('\n')
  const profiles = input.themes.installed.map((themeId) => themeDefinitions[themeId].profileExport).join(', ')
  const fallback = themeDefinitions[input.themes.default].profileExport

  return replaceSourceSection(
    replaceSourceSection(replaceSourceSection(text, 'theme-imports', imports), 'theme-profiles', `export const builtInDesignProfiles = [${profiles}] as const`),
    'theme-fallback',
    `  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? ${fallback}`
  )
}

function transformAuthRecipeRegistry(text: string, input: NormalizedStarterGenerationInput): string {
  const imports = input.themes.installed
    .map((themeId) => {
      const component = themeDefinitions[themeId].authRecipeComponent
      return `import ${component} from './recipes/${component}.vue'`
    })
    .join('\n')
  const registrations = input.themes.installed
    .map((themeId) => {
      const component = themeDefinitions[themeId].authRecipeComponent
      return `  { component: ${component}, profileId: '${themeId}' }`
    })
    .join(',\n')

  return replaceSourceSection(
    replaceSourceSection(text, 'auth-recipe-imports', imports),
    'auth-recipe-registrations',
    `export const authRecipeRegistry = createAuthRecipeRegistry([\n${registrations}\n])`
  )
}

function transformCommandPalette(text: string, input: NormalizedStarterGenerationInput): string {
  const localeType = input.i18n.installed.map((locale) => `'${locale}'`).join(' | ')
  const localeEntries = input.i18n.installed.map((locale) => `  '${locale}': '${locale === 'zh-CN' ? 'zhCN' : 'enUS'}'`).join(',\n')
  const localeList = input.i18n.installed.map((locale) => `'${locale}'`).join(', ')

  return text
    .replace("type Locale = 'zh-CN' | 'en-US'", `type Locale = ${localeType}`)
    .replace(/const LOCALE_I18N_KEY: Record<Locale, string> = \{[\s\S]*?\n\}/, `const LOCALE_I18N_KEY: Record<Locale, string> = {\n${localeEntries}\n}`)
    .replace("    const locales: Locale[] = ['zh-CN', 'en-US']", `    const locales: Locale[] = [${localeList}]`)
}

export function transformStarterSourceText(relativePath: string, text: string, input: NormalizedStarterGenerationInput): string {
  let transformed = replaceSourceSection(text, 'reference', '')

  if (relativePath === 'i18n/index.ts') {
    transformed = replaceSourceSection(transformed, 'locale-en', input.i18n.installed.includes('en-US') ? null : '')
  }

  if (relativePath === 'shell/preferences/GlobalPreferences.vue') {
    transformed = replaceSourceSection(transformed, 'theme', input.themes.installed.length > 1 ? null : '')
    transformed = replaceSourceSection(transformed, 'locale', input.i18n.switcher ? null : '')
  }

  if (relativePath === 'super-admin/theme-registry.generated.ts') {
    return transformThemeRegistry(transformed, input)
  }

  if (relativePath === 'modules/auth/components/auth-recipe-registry.generated.ts') {
    return transformAuthRecipeRegistry(transformed, input)
  }

  if (relativePath === 'shell/use-command-palette-items.ts') {
    return transformCommandPalette(transformed, input)
  }

  if (relativePath === 'modules/examples/examples.manifest.ts') {
    return replaceSourceSection(transformed, 'charts', input.charts.provider === 'none' ? '' : null)
  }

  if (relativePath === 'styles/main.css') {
    return transformed.replace('@source "../../../../packages/ui/src";', '@source "../../node_modules/@super-admin-org/ui/dist";')
  }

  return transformed
}

type SourceMaterializationOptions = { mode: 'runtime-template' } | { input: NormalizedStarterGenerationInput; mode: 'starter' }

async function materializeSourceDirectory(
  sourceDirectory: string,
  targetDirectory: string,
  options: SourceMaterializationOptions,
  currentDirectory = sourceDirectory
): Promise<void> {
  const entries = await readdir(currentDirectory, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = resolve(currentDirectory, entry.name)
    const relativePath = toPosixPath(relative(sourceDirectory, sourcePath))
    const action = options.mode === 'runtime-template' ? resolveRuntimeTemplateAction(relativePath) : resolveStarterSourceAction(relativePath, options.input)

    if (action.kind === 'exclude') {
      continue
    }

    if (entry.isDirectory()) {
      await materializeSourceDirectory(sourceDirectory, targetDirectory, options, sourcePath)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const targetPath = resolve(targetDirectory, relativePath)
    await mkdir(dirname(targetPath), { recursive: true })
    const sourceText = await readFile(sourcePath, 'utf8')
    const output = options.mode === 'starter' && action.kind === 'transform' ? transformStarterSourceText(relativePath, sourceText, options.input) : sourceText
    await writeFile(targetPath, output)
  }
}

export async function materializeStarterSource(sourceDirectory: string, targetDirectory: string, input: NormalizedStarterGenerationInput): Promise<void> {
  await materializeSourceDirectory(sourceDirectory, targetDirectory, { input, mode: 'starter' })
}

export async function materializeRuntimeTemplate(sourceAppDirectory: string, targetDirectory: string): Promise<void> {
  await mkdir(targetDirectory, { recursive: true })
  await cp(resolve(sourceAppDirectory, 'components.json'), resolve(targetDirectory, 'components.json'))
  await materializeSourceDirectory(resolve(sourceAppDirectory, 'src'), resolve(targetDirectory, 'src'), { mode: 'runtime-template' })
}

export function resolveRuntimeTemplateAction(relativePath: string): StarterSourceAction {
  return { kind: isInvariantExcludedPath(relativePath) ? 'exclude' : 'copy' }
}

export function resolveStarterRootAction(relativePath: string): StarterSourceAction {
  return { kind: (GENERATOR_OWNED_OUTPUT_PATHS as readonly string[]).includes(relativePath) ? 'generate' : 'exclude' }
}

export function resolveStarterSourceAction(relativePath: string, input: NormalizedStarterGenerationInput): StarterSourceAction {
  if (isInvariantExcludedPath(relativePath)) {
    return { kind: 'exclude' }
  }

  if (input.quality === 'minimal' && (STARTER_QUALITY_SOURCE_PATHS as readonly string[]).includes(relativePath)) {
    return { kind: 'exclude' }
  }

  if (!input.i18n.switcher && relativePath === 'i18n/locales/en-US.ts') {
    return { kind: 'exclude' }
  }

  const recipeTheme = input.themes.installed.find(
    (themeId) => relativePath === `modules/auth/components/recipes/${themeDefinitions[themeId].authRecipeComponent}.vue`
  )
  const isThemeRecipe = Object.values(themeDefinitions).some(
    (definition) => relativePath === `modules/auth/components/recipes/${definition.authRecipeComponent}.vue`
  )

  if (isThemeRecipe && !recipeTheme) {
    return { kind: 'exclude' }
  }

  if (input.charts.provider === 'none' && (relativePath.startsWith('modules/charts/') || relativePath.startsWith('shared/charts/'))) {
    return { kind: 'exclude' }
  }

  if ((APP_SOURCE_TRANSFORM_PATHS as readonly string[]).includes(relativePath)) {
    return { kind: 'transform' }
  }

  return { kind: 'copy' }
}
