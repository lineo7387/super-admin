import { basename, resolve } from 'node:path'
import { isStarterPackageManager, isStarterThemeId, starterPackageManagers, starterThemeIds } from './theme-options.js'
import type { StarterLocaleId, StarterPackageManager, StarterThemeId } from './theme-options.js'

export type StarterGenerationInput = {
  projectName: string
  packageName: string
  packageManager: StarterPackageManager
  targetDirectory: string
  themes: {
    installed: StarterThemeId[]
    default: StarterThemeId
  }
  i18n: {
    installed: StarterLocaleId[]
    default: StarterLocaleId
    switcher: boolean
  }
}

export type ParseCreateSuperAdminArgsOptions = {
  cwd?: string
}

type ParsedFlags = {
  project?: string
  theme?: string
  themes?: string
  i18n: boolean
  packageManager?: string
}

function readFlagValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1]

  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value.`)
  }

  return value
}

function parseFlags(argv: string[]): ParsedFlags {
  const parsed: ParsedFlags = {
    i18n: false
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--i18n') {
      parsed.i18n = true
      continue
    }

    if (arg === '--theme') {
      parsed.theme = readFlagValue(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--themes') {
      parsed.themes = readFlagValue(argv, index, arg)
      index += 1
      continue
    }

    if (arg === '--pm' || arg === '--package-manager') {
      parsed.packageManager = readFlagValue(argv, index, arg)
      index += 1
      continue
    }

    if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`)
    }

    if (parsed.project) {
      throw new Error(`Unexpected extra argument: ${arg}`)
    }

    parsed.project = arg
  }

  return parsed
}

function normalizePackageName(project: string): string {
  const name = basename(project)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return name || 'super-admin-app'
}

function normalizeThemes(theme?: string, themes?: string): StarterThemeId[] {
  if (theme && themes) {
    throw new Error('--theme and --themes are mutually exclusive.')
  }

  const rawThemes = (themes ? themes.split(',') : theme ? [theme] : []).map((item) => item.trim()).filter(Boolean)
  const normalizedThemes: StarterThemeId[] = []

  for (const rawTheme of rawThemes) {
    if (!isStarterThemeId(rawTheme)) {
      throw new Error(`Unknown theme "${rawTheme}". Supported themes: ${starterThemeIds.join(', ')}`)
    }

    if (!normalizedThemes.includes(rawTheme)) {
      normalizedThemes.push(rawTheme)
    }
  }

  if (normalizedThemes.length === 0) {
    throw new Error('Theme selection is required. Use --theme <id>, --themes <ids>, or run create-super-admin in an interactive terminal.')
  }

  return normalizedThemes
}

function normalizePackageManager(packageManager?: string): StarterPackageManager {
  if (!packageManager) {
    return 'pnpm'
  }

  if (!isStarterPackageManager(packageManager)) {
    throw new Error(`Unsupported package manager "${packageManager}". Supported package managers: ${starterPackageManagers.join(', ')}`)
  }

  return packageManager
}

export function parseCreateSuperAdminArgs(
  argv: string[],
  options: ParseCreateSuperAdminArgsOptions = {}
): StarterGenerationInput {
  const cwd = options.cwd ?? process.cwd()
  const flags = parseFlags(argv)

  if (!flags.project) {
    throw new Error('Usage: create-super-admin <project> [--theme base] [--themes base,cyberpunk] [--i18n] [--pm pnpm]')
  }

  const packageManager = normalizePackageManager(flags.packageManager)
  const themes = normalizeThemes(flags.theme, flags.themes)
  const projectName = basename(flags.project)

  return {
    projectName,
    packageName: normalizePackageName(projectName),
    packageManager,
    targetDirectory: resolve(cwd, flags.project),
    themes: {
      installed: themes,
      default: themes[0] ?? 'base'
    },
    i18n: {
      installed: flags.i18n ? ['zh-CN', 'en-US'] : ['zh-CN'],
      default: 'zh-CN',
      switcher: flags.i18n
    }
  }
}
