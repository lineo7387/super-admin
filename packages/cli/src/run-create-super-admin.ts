import { stdin, stdout } from 'node:process'
import { emitKeypressEvents } from 'node:readline'
import { generateStarter } from './generate-starter.js'
import { parseCreateSuperAdminArgs } from './parse-args.js'
import { isStarterThemeId, starterThemeIds, themeDefinitions } from './theme-options.js'
import type { StarterThemeId } from './theme-options.js'

const HELP_TEXT = `Usage: create-super-admin <project> [options]

Create a frontend-first, mock-backed Super Admin starter.

Options:
  --theme <id>             Generate with one theme and skip the interactive selector
  --themes <ids>           Generate with multiple comma-separated themes and skip the selector
  --i18n                   Include zh-CN and en-US locale catalogs and a language switcher
  --pm <name>              Package manager for printed next steps: pnpm, npm, yarn, or bun
  --package-manager <name> Alias for --pm
  -h, --help               Show this help message

Interactive theme selection:
  create-super-admin <project> prompts for one or more themes when no --theme or --themes
  flag is provided. Use Space to toggle themes, Up/Down to move, and Enter to confirm.

Generated starter:
  The generated app is a single Vite app with zh-CN, mock data, and no backend,
  docs site, tests, lint, or e2e tooling.

Examples:
  create-super-admin my-admin
  create-super-admin my-admin --theme base
  create-super-admin my-admin --themes base,cyberpunk --i18n --pm pnpm`

const THEME_SELECTION_REQUIRED_MESSAGE =
  'Theme selection is required. Use --theme <id>, --themes <ids>, or run create-super-admin in an interactive terminal.'

export type CreateSuperAdminIo = {
  cwd?: string
  isTTY?: boolean
  promptThemes?: () => Promise<StarterThemeId[]> | StarterThemeId[]
  sourceRoot?: string
  stdout?: (message: string) => void
  stderr?: (message: string) => void
}

function writeLine(writer: ((message: string) => void) | undefined, message: string): void {
  if (writer) {
    writer(message)
    return
  }

  console.log(message)
}

function writeError(writer: ((message: string) => void) | undefined, message: string): void {
  if (writer) {
    writer(message)
    return
  }

  console.error(message)
}

function isHelpRequested(argv: string[]): boolean {
  return argv.includes('--help') || argv.includes('-h')
}

function hasThemeFlag(argv: string[]): boolean {
  return argv.includes('--theme') || argv.includes('--themes')
}

function validateArgsBeforePrompt(argv: string[], cwd?: string): void {
  const validationArgv = hasThemeFlag(argv) ? argv : [...argv, '--theme', 'base']
  parseCreateSuperAdminArgs(validationArgv, { cwd })
}

function isInteractive(io: CreateSuperAdminIo): boolean {
  return io.isTTY ?? (stdin.isTTY === true && stdout.isTTY === true)
}

function formatThemeLabel(themeId: StarterThemeId): string {
  return `${themeId} (${themeDefinitions[themeId].packageName})`
}

function renderThemeSelection(output: NodeJS.WriteStream, cursorIndex: number, selectedThemes: Set<StarterThemeId>, message = ''): void {
  output.write('\x1b[2J\x1b[H')
  output.write('Select one or more themes for your Super Admin starter.\n')
  output.write('Use Up/Down to move, Space to toggle, Enter to confirm.\n\n')

  for (let index = 0; index < starterThemeIds.length; index += 1) {
    const themeId = starterThemeIds[index]
    const cursor = index === cursorIndex ? '>' : ' '
    const marker = selectedThemes.has(themeId) ? '[x]' : '[ ]'
    output.write(`${cursor} ${marker} ${formatThemeLabel(themeId)}\n`)
  }

  if (message) {
    output.write(`\n${message}\n`)
  }
}

async function promptThemesWithKeyboard(): Promise<StarterThemeId[]> {
  const input = stdin
  const output = stdout

  if (input.isTTY !== true || output.isTTY !== true) {
    throw new Error(THEME_SELECTION_REQUIRED_MESSAGE)
  }

  emitKeypressEvents(input)
  input.setRawMode(true)
  input.resume()

  return new Promise((resolve, reject) => {
    let cursorIndex = 0
    const selectedThemes = new Set<StarterThemeId>()

    function cleanup(): void {
      input.off('keypress', onKeypress)
      input.setRawMode(false)
      input.pause()
      output.write('\n')
    }

    function complete(): void {
      const themes = starterThemeIds.filter((themeId) => selectedThemes.has(themeId))

      if (themes.length === 0) {
        renderThemeSelection(output, cursorIndex, selectedThemes, 'Select at least one theme before continuing.')
        return
      }

      cleanup()
      resolve(themes)
    }

    function fail(error: Error): void {
      cleanup()
      reject(error)
    }

    function onKeypress(_character: string, key: { ctrl?: boolean; name?: string }): void {
      if (key.ctrl && key.name === 'c') {
        fail(new Error('Theme selection cancelled.'))
        return
      }

      if (key.name === 'up') {
        cursorIndex = (cursorIndex - 1 + starterThemeIds.length) % starterThemeIds.length
        renderThemeSelection(output, cursorIndex, selectedThemes)
        return
      }

      if (key.name === 'down') {
        cursorIndex = (cursorIndex + 1) % starterThemeIds.length
        renderThemeSelection(output, cursorIndex, selectedThemes)
        return
      }

      if (key.name === 'space') {
        const themeId = starterThemeIds[cursorIndex]

        if (selectedThemes.has(themeId)) {
          selectedThemes.delete(themeId)
        } else {
          selectedThemes.add(themeId)
        }

        renderThemeSelection(output, cursorIndex, selectedThemes)
        return
      }

      if (key.name === 'return' || key.name === 'enter') {
        complete()
      }
    }

    input.on('keypress', onKeypress)
    renderThemeSelection(output, cursorIndex, selectedThemes)
  })
}

function normalizePromptedThemes(themes: StarterThemeId[]): StarterThemeId[] {
  const normalizedThemes: StarterThemeId[] = []

  for (const theme of themes) {
    if (!isStarterThemeId(theme)) {
      throw new Error(`Unknown theme "${theme}". Supported themes: ${starterThemeIds.join(', ')}`)
    }

    if (!normalizedThemes.includes(theme)) {
      normalizedThemes.push(theme)
    }
  }

  if (normalizedThemes.length === 0) {
    throw new Error(THEME_SELECTION_REQUIRED_MESSAGE)
  }

  return normalizedThemes
}

async function getPromptedThemes(io: CreateSuperAdminIo): Promise<StarterThemeId[]> {
  if (!isInteractive(io) && !io.promptThemes) {
    throw new Error(THEME_SELECTION_REQUIRED_MESSAGE)
  }

  const themes = io.promptThemes ? await io.promptThemes() : await promptThemesWithKeyboard()

  return normalizePromptedThemes(themes)
}

export async function runCreateSuperAdmin(argv: string[], io: CreateSuperAdminIo = {}): Promise<number> {
  try {
    if (isHelpRequested(argv)) {
      writeLine(io.stdout, HELP_TEXT)
      return 0
    }

    validateArgsBeforePrompt(argv, io.cwd)

    const normalizedArgv = [...argv]

    if (!hasThemeFlag(normalizedArgv)) {
      const themes = await getPromptedThemes(io)
      normalizedArgv.push('--themes', themes.join(','))
    }

    const input = parseCreateSuperAdminArgs(normalizedArgv, {
      cwd: io.cwd
    })
    await generateStarter(input, {
      sourceRoot: io.sourceRoot
    })

    writeLine(io.stdout, `Created Super Admin starter at ${input.targetDirectory}`)
    writeLine(io.stdout, `Next: cd ${input.projectName} && ${input.packageManager} install && ${input.packageManager} run dev`)
    return 0
  } catch (error) {
    writeError(io.stderr, error instanceof Error ? error.message : String(error))
    return 1
  }
}
