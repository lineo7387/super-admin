import { generateStarter } from './generate-starter.js'
import { parseCreateSuperAdminArgs } from './parse-args.js'

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

export async function runCreateSuperAdmin(argv: string[], io: CreateSuperAdminIo = {}): Promise<number> {
  try {
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
