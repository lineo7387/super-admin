import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { validateGeneratedStarterStatic } from '../../../scripts/validate-generated-starter.mjs'
import { generateStarter, parseCreateSuperAdminArgs, runCreateSuperAdmin } from './index.ts'

const packageDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(packageDir, '../../..')

async function createTempRoot() {
  return mkdtemp(join(tmpdir(), 'create-super-admin-test-'))
}

async function readGeneratedJson(root, filePath) {
  return JSON.parse(await readFile(join(root, filePath), 'utf8'))
}

async function readGeneratedText(root, filePath) {
  return readFile(join(root, filePath), 'utf8')
}

function runCommand(command, args, cwd) {
  return new Promise((resolveRun, reject) => {
    const stderrChunks = []
    const stdoutChunks = []
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    child.stdout.on('data', (chunk) => {
      stdoutChunks.push(chunk)
    })
    child.stderr.on('data', (chunk) => {
      stderrChunks.push(chunk)
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      const stdout = Buffer.concat(stdoutChunks).toString()
      const stderr = Buffer.concat(stderrChunks).toString()

      if (code === 0) {
        resolveRun(stdout)
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}.\n${stdout}${stderr}`))
    })
  })
}

describe('create-super-admin starter generation', () => {
  it('normalizes default CLI input', () => {
    const cwd = '/tmp/super-admin-cli'
    const input = parseCreateSuperAdminArgs(['demo-admin'], { cwd })

    expect(input).toEqual({
      i18n: {
        default: 'zh-CN',
        installed: ['zh-CN'],
        switcher: false
      },
      packageManager: 'pnpm',
      packageName: 'demo-admin',
      projectName: 'demo-admin',
      targetDirectory: join(cwd, 'demo-admin'),
      themes: {
        default: 'base',
        installed: ['base']
      }
    })
  })

  it('dedupes selected themes and rejects invalid flag combinations', () => {
    expect(parseCreateSuperAdminArgs(['demo', '--themes', 'base,cyberpunk,base', '--pm', 'bun'], { cwd: '/tmp' }).themes).toEqual({
      default: 'base',
      installed: ['base', 'cyberpunk']
    })

    expect(() => parseCreateSuperAdminArgs(['demo', '--theme', 'base', '--themes', 'cyberpunk'], { cwd: '/tmp' })).toThrow(
      /mutually exclusive/
    )
    expect(() => parseCreateSuperAdminArgs(['demo', '--theme', 'unknown'], { cwd: '/tmp' })).toThrow(/Supported themes: base/)
    expect(() => parseCreateSuperAdminArgs(['demo', '--pm', 'deno'], { cwd: '/tmp' })).toThrow(/Supported package managers/)
  })

  it('generates the default single-theme starter and passes static validation', async () => {
    const tempRoot = await createTempRoot()
    const input = parseCreateSuperAdminArgs(['demo-admin'], { cwd: tempRoot })

    await generateStarter(input, { sourceRoot: repoRoot })

    const packageJson = await readGeneratedJson(input.targetDirectory, 'package.json')
    const config = await readGeneratedText(input.targetDirectory, 'super-admin.config.ts')
    const preferences = await readGeneratedText(input.targetDirectory, 'src/shell/preferences/GlobalPreferences.vue')

    expect(packageJson.scripts).toEqual({
      build: 'vue-tsc --noEmit && vite build',
      dev: 'vite',
      preview: 'vite preview',
      typecheck: 'vue-tsc --noEmit'
    })
    expect(packageJson.dependencies['@super-admin-org/theme-base']).toBe('^0.1.1')
    expect(packageJson.dependencies['@super-admin-org/theme-cyberpunk']).toBeUndefined()
    expect(config).toContain("installed: ['base']")
    expect(config).toContain("switcher: 'off'")
    expect(preferences).not.toContain('selectProfile')
    expect(preferences).not.toContain('selectLocale')

    await expect(validateGeneratedStarterStatic(input.targetDirectory, { themes: ['base'] })).resolves.toEqual([])
  })

  it('generates selected multi-theme and i18n variants', async () => {
    const tempRoot = await createTempRoot()
    const input = parseCreateSuperAdminArgs(['demo-admin', '--themes', 'base,cyberpunk', '--i18n'], { cwd: tempRoot })

    await generateStarter(input, { sourceRoot: repoRoot })

    const packageJson = await readGeneratedJson(input.targetDirectory, 'package.json')
    const registry = await readGeneratedText(input.targetDirectory, 'src/super-admin/theme-registry.generated.ts')
    const preferences = await readGeneratedText(input.targetDirectory, 'src/shell/preferences/GlobalPreferences.vue')

    expect(packageJson.dependencies['@super-admin-org/theme-base']).toBe('^0.1.1')
    expect(packageJson.dependencies['@super-admin-org/theme-cyberpunk']).toBe('^0.1.1')
    expect(packageJson.dependencies['@super-admin-org/theme-crypto']).toBeUndefined()
    expect(registry).toContain("from '@super-admin-org/theme-base'")
    expect(registry).toContain("from '@super-admin-org/theme-cyberpunk'")
    expect(preferences).toContain('selectProfile')
    expect(preferences).toContain('selectLocale')

    await expect(validateGeneratedStarterStatic(input.targetDirectory, { i18n: true, themes: ['base', 'cyberpunk'] })).resolves.toEqual([])
  })

  it('does not write into non-empty target directories', async () => {
    const tempRoot = await createTempRoot()
    const target = join(tempRoot, 'demo-admin')
    await mkdir(target)
    await writeFile(join(target, 'keep.txt'), 'existing file\n')

    const input = parseCreateSuperAdminArgs(['demo-admin'], { cwd: tempRoot })

    await expect(generateStarter(input, { sourceRoot: repoRoot })).rejects.toThrow(/not empty/)
    await expect(readdir(target)).resolves.toEqual(['keep.txt'])
  })

  it('runs the CLI entrypoint with injectable IO', async () => {
    const tempRoot = await createTempRoot()
    const output = []

    const exitCode = await runCreateSuperAdmin(['demo-admin', '--theme', 'base'], {
      cwd: tempRoot,
      sourceRoot: repoRoot,
      stderr: (message) => output.push(`error:${message}`),
      stdout: (message) => output.push(message)
    })

    expect(exitCode).toBe(0)
    expect(output.join('\n')).toContain('Created Super Admin starter')
    await expect(validateGeneratedStarterStatic(join(tempRoot, 'demo-admin'), { themes: ['base'] })).resolves.toEqual([])
  })

  it('runs from the packed CLI package without a repo apps/admin source tree', async () => {
    const tempRoot = await createTempRoot()
    const unpackRoot = join(tempRoot, 'unpacked')
    const workspaceRoot = join(tempRoot, 'workspace')
    await mkdir(unpackRoot)
    await mkdir(workspaceRoot)

    await runCommand('pnpm', ['--filter', 'create-super-admin', 'build'], repoRoot)
    const packOutput = await runCommand('npm', ['pack', '--json', '--pack-destination', tempRoot], resolve(repoRoot, 'packages/cli'))
    const [packed] = JSON.parse(packOutput)
    await runCommand('tar', ['-xzf', resolve(tempRoot, packed.filename), '-C', unpackRoot], repoRoot)

    await runCommand('node', [join(unpackRoot, 'package/dist/cli.js'), 'demo-admin', '--pm', 'pnpm'], workspaceRoot)

    await expect(validateGeneratedStarterStatic(join(workspaceRoot, 'demo-admin'), { themes: ['base'] })).resolves.toEqual([])
  })
})
