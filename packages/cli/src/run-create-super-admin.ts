import { generateStarter } from './generate-starter.js'
import { parseCreateSuperAdminArgs } from './parse-args.js'

const HELP_TEXT = `Usage: create-super-admin <project> [options]

Create a frontend-first, mock-backed Super Admin starter.

Options:
  --theme <id>             Generate with one theme. Default: base
  --themes <ids>           Generate with multiple comma-separated themes, for example base,cyberpunk
  --i18n                   Include zh-CN and en-US locale catalogs and a language switcher
  --pm <name>              Package manager for printed next steps: pnpm, npm, yarn, or bun
  --package-manager <name> Alias for --pm
  -h, --help               Show this help message

Defaults:
  create-super-admin <project> generates a single Vite app with zh-CN, the base theme,
  mock data, and no backend, docs site, tests, lint, or e2e tooling.

Examples:
  create-super-admin my-admin
  create-super-admin my-admin --theme base
  create-super-admin my-admin --themes base,cyberpunk --i18n --pm pnpm`

export type CreateSuperAdminIo = {
  cwd?: string
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

export async function runCreateSuperAdmin(argv: string[], io: CreateSuperAdminIo = {}): Promise<number> {
  try {
    if (isHelpRequested(argv)) {
      writeLine(io.stdout, HELP_TEXT)
      return 0
    }

    const input = parseCreateSuperAdminArgs(argv, {
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
