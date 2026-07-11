import { cp, mkdir, readdir, rename, rm, rmdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Dirent } from 'node:fs'
import type { StarterGenerationInput } from './parse-args.js'
import { materializeStarterSource, resolveStarterRootAction } from './starter-source.js'
import {
  createAgentsMd,
  createAiContextFiles,
  createClaudeMd,
  createIndexHtml,
  createPackageJson,
  createReadme,
  createSuperAdminConfig,
  createTsconfig,
  createViteConfig
} from './templates.js'

export type GenerateStarterOptions = {
  sourceRoot?: string
}

export type GenerateStarterResult = {
  targetDirectory: string
}

function getDefaultSourceAppDir(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), 'starter-template/admin')
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
  if (resolveStarterRootAction(filePath).kind !== 'generate') {
    throw new Error(`Generator-owned output is not allowed for app-source path: ${filePath}`)
  }

  const target = resolve(root, filePath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

async function writeGeneratedRootFiles(outputRoot: string, input: StarterGenerationInput, sourceAppDir: string): Promise<void> {
  await cp(resolve(sourceAppDir, 'components.json'), resolve(outputRoot, 'components.json'))
  await writeText(outputRoot, 'AGENTS.md', createAgentsMd(input))
  await writeText(outputRoot, 'CLAUDE.md', createClaudeMd())
  for (const aiContextFile of createAiContextFiles(input)) {
    await writeText(outputRoot, aiContextFile.filePath, aiContextFile.content)
  }
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

export async function generateStarter(input: StarterGenerationInput, options: GenerateStarterOptions = {}): Promise<GenerateStarterResult> {
  const sourceAppDir = options.sourceRoot ? resolve(options.sourceRoot, 'apps/admin') : getDefaultSourceAppDir()
  const targetDirectory = input.targetDirectory
  const tempDirectory = resolve(dirname(targetDirectory), `.${input.projectName}.tmp-${Date.now()}-${process.pid}`)
  await ensureTargetIsWritable(targetDirectory)
  await rm(tempDirectory, { force: true, recursive: true })
  await mkdir(tempDirectory, { recursive: true })

  try {
    await writeGeneratedRootFiles(tempDirectory, input, sourceAppDir)
    await materializeStarterSource(resolve(sourceAppDir, 'src'), resolve(tempDirectory, 'src'), input)
    await materializeOutput(tempDirectory, targetDirectory)
  } catch (error) {
    await rm(tempDirectory, { force: true, recursive: true })
    throw error
  }

  return {
    targetDirectory
  }
}
