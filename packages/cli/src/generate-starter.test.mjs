import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { validateGeneratedStarterStatic } from '../../../scripts/validate-generated-starter.mjs'
import { generateStarter, parseCreateSuperAdminArgs, runCreateSuperAdmin } from './index.ts'
import { createPackageJson } from './templates.ts'

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

function expectControlCenterScrollingLayout(preferences) {
  expect(preferences).toContain('<AdminScrollArea')
  expect(preferences).toContain('as="section"')
  expect(preferences).toContain('max-h-[min(92vh,calc(100vh-2rem))] w-full max-w-5xl overflow-hidden')
  expect(preferences).toContain('sticky top-0')
  expect(preferences).toContain('items-start')
  expect(preferences).not.toContain('flex h-[min(92vh,calc(100vh-2rem))]')
  expect(preferences).not.toContain('max-h-[calc(88vh-92px)]')
}

function expectStageManagerStarterParity({ appShell, stageDockThumb, stageOverviewCard, stageRail }) {
  const groupedPreviewBlock = stageRail.match(
    /<StageWindowPreview\s+[\s\S]*?:component="stageGroup\.component"[\s\S]*?\/>/
  )?.[0] ?? ''

  expect(appShell).toContain(':data-stage-rail-open="showStageRail"')
  expect(appShell).toContain('overflow-x: clip;')
  expect(appShell).toContain('v-if="preferences.stageManagerDesktopAvailable"')
  expect(appShell).toContain('class="stage-rail-shell"')
  expect(appShell).toContain(':aria-hidden="!showStageRail"')
  expect(appShell).toContain(':inert="!showStageRail"')
  expect(appShell).toContain('<StageRail />')
  expect(appShell).toContain('grid-template-columns: 0rem minmax(0, 1fr);')
  expect(appShell).toContain('grid-column: 1;')
  expect(appShell).toContain('width: 14rem;')
  expect(appShell).toContain('min-height: 100vh;')
  expect(appShell).toContain('transform: translateX(-100%);')
  expect(appShell).toContain('.stage-shell-frame[data-stage-rail-open="true"] .stage-rail-shell')
  expect(appShell).toContain('pointer-events: none;')
  expect(appShell).toContain('pointer-events: auto;')
  expect(appShell).not.toContain('stage-rail-shell-leave-active')
  expect(appShell).not.toContain('stageRailLeaving')
  expect(stageDockThumb).toContain('stage-thumb__card-stack')
  expect(stageDockThumb).toContain('stage-thumb__stack-card')
  expect(stageDockThumb).toContain('transform: translate(-1.35rem, 0.72rem) scale(0.92);')
  expect(stageDockThumb).toContain('transform: translate(-0.72rem, 0.36rem) scale(0.96);')
  expect(stageRail).toContain('height: 100%;')
  expect(stageRail).toContain('min-height: 100vh;')
  expect(stageRail).toContain("import { useStageWindows } from './useStageWindows'")
  expect(stageRail).toContain('StageWindowActions')
  expect(stageRail).toContain('visibility="reveal"')
  expect(groupedPreviewBlock).not.toContain(':stacked="stageGroup.isStacked"')
  expect(stageRail).not.toContain('stage-rail__preview-stack')
  expect(stageRail).not.toContain('stage-rail__stack-card')
  expect(stageOverviewCard).toContain('StageWindowActions')
  expect(stageOverviewCard).toContain('visibility="reveal"')
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
  it('normalizes explicit single-theme CLI input', () => {
    const cwd = '/tmp/super-admin-cli'
    const input = parseCreateSuperAdminArgs(['demo-admin', '--theme', 'base'], { cwd })

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
    expect(() => parseCreateSuperAdminArgs(['demo'], { cwd: '/tmp' })).toThrow(/Theme selection is required/)
  })

  it('generates the default single-theme starter and passes static validation', async () => {
    const tempRoot = await createTempRoot()
    const input = parseCreateSuperAdminArgs(['demo-admin', '--theme', 'base'], { cwd: tempRoot })

    await generateStarter(input, { sourceRoot: repoRoot })

    const packageJson = await readGeneratedJson(input.targetDirectory, 'package.json')
    const config = await readGeneratedText(input.targetDirectory, 'super-admin.config.ts')
    const loginPage = await readGeneratedText(input.targetDirectory, 'src/modules/auth/LoginPage.vue')
    const registerPage = await readGeneratedText(input.targetDirectory, 'src/modules/auth/RegisterPage.vue')
    const preferences = await readGeneratedText(input.targetDirectory, 'src/shell/preferences/GlobalPreferences.vue')
    const appShell = await readGeneratedText(input.targetDirectory, 'src/shell/AppShell.vue')
    const stageDockThumb = await readGeneratedText(input.targetDirectory, 'src/workspace/StageDockThumb.vue')
    const stageOverviewCard = await readGeneratedText(input.targetDirectory, 'src/workspace/StageOverviewCard.vue')
    const stageRail = await readGeneratedText(input.targetDirectory, 'src/workspace/StageRail.vue')

    expect(packageJson.scripts).toEqual({
      build: 'vue-tsc --noEmit && vite build',
      dev: 'vite',
      preview: 'vite preview',
      typecheck: 'vue-tsc --noEmit'
    })
    expect(packageJson.dependencies['@super-admin-org/theme-base']).toBe('^0.1.2')
    expect(packageJson.dependencies['motion-v']).toBe('^2.3.0')
    expect(packageJson.dependencies['@super-admin-org/theme-cyberpunk']).toBeUndefined()
    expect(config).toContain("installed: ['base']")
    expect(config).toContain("switcher: 'off'")
    expect(preferences).not.toContain('selectProfile')
    expect(preferences).not.toContain('selectLocale')
    expect(preferences).toContain('shell.preferences.displayMode')
    expect(preferences).toContain('preferences.setStageRailEnabled')
    expect(preferences).toContain('preferences.openStageOverview')
    expect(preferences).toContain('shell.preferences.stageRail')
    expect(preferences).not.toContain('setStageManagerPresentationMode')
    expect(preferences).not.toContain('stageModes.sideDock')
    expect(preferences).not.toContain('stageModes.allWindows')
    expect(preferences).not.toContain('shell.preferences.modeDensity')
    expect(preferences).toContain('data-layout-preview')
    expectControlCenterScrollingLayout(preferences)
    expect(preferences).not.toContain('densityOptions')
    expect(preferences).not.toContain('selectDensity')
    expect(preferences).not.toContain('shell.preferences.density')
    expect(preferences).not.toContain('preferences.setDensity')
    expectStageManagerStarterParity({ appShell, stageDockThumb, stageOverviewCard, stageRail })
    expect(loginPage).toContain(':required-label="t(\'validation.requiredLabel\')"')
    expect(registerPage).toContain(':required-label="t(\'validation.requiredLabel\')"')

    await expect(validateGeneratedStarterStatic(input.targetDirectory, { themes: ['base'] })).resolves.toEqual([])
  })

  it('generates selected multi-theme and i18n variants', async () => {
    const tempRoot = await createTempRoot()
    const input = parseCreateSuperAdminArgs(['demo-admin', '--themes', 'base,cyberpunk', '--i18n'], { cwd: tempRoot })

    await generateStarter(input, { sourceRoot: repoRoot })

    const packageJson = await readGeneratedJson(input.targetDirectory, 'package.json')
    const registry = await readGeneratedText(input.targetDirectory, 'src/super-admin/theme-registry.generated.ts')
    const preferences = await readGeneratedText(input.targetDirectory, 'src/shell/preferences/GlobalPreferences.vue')

    expect(packageJson.dependencies['@super-admin-org/theme-base']).toBe('^0.1.2')
    expect(packageJson.dependencies['@super-admin-org/theme-cyberpunk']).toBe('^0.1.2')
    expect(packageJson.dependencies['motion-v']).toBe('^2.3.0')
    expect(packageJson.dependencies['@super-admin-org/theme-crypto']).toBeUndefined()
    expect(registry).toContain("from '@super-admin-org/theme-base'")
    expect(registry).toContain("from '@super-admin-org/theme-cyberpunk'")
    expect(preferences).toContain('selectProfile')
    expect(preferences).toContain('selectLocale')
    expect(preferences).toContain('shell.preferences.displayMode')
    expect(preferences).toContain('preferences.setStageRailEnabled')
    expect(preferences).toContain('preferences.openStageOverview')
    expect(preferences).toContain('shell.preferences.stageRail')
    expect(preferences).not.toContain('setStageManagerPresentationMode')
    expect(preferences).not.toContain('stageModes.sideDock')
    expect(preferences).not.toContain('stageModes.allWindows')
    expect(preferences).not.toContain('shell.preferences.modeDensity')
    expect(preferences).toContain('data-layout-preview')
    expectControlCenterScrollingLayout(preferences)
    expect(preferences).not.toContain('densityOptions')
    expect(preferences).not.toContain('selectDensity')
    expect(preferences).not.toContain('shell.preferences.density')
    expect(preferences).not.toContain('preferences.setDensity')

    await expect(validateGeneratedStarterStatic(input.targetDirectory, { i18n: true, themes: ['base', 'cyberpunk'] })).resolves.toEqual([])
  })

  it('uses package-specific Super Admin dependency ranges in generated package.json', () => {
    const input = parseCreateSuperAdminArgs(['demo-admin', '--themes', 'base,cyberpunk'], { cwd: '/tmp/super-admin-cli' })
    const packageJson = JSON.parse(
      createPackageJson(input, {
        packageVersionRanges: {
          '@super-admin-org/core': '^1.0.0',
          '@super-admin-org/theme': '^2.0.0',
          '@super-admin-org/theme-base': '^3.0.0',
          '@super-admin-org/theme-cyberpunk': '^4.0.0',
          '@super-admin-org/ui': '^5.0.0'
        }
      })
    )

    expect(packageJson.dependencies['@super-admin-org/core']).toBe('^1.0.0')
    expect(packageJson.dependencies['@super-admin-org/theme']).toBe('^2.0.0')
    expect(packageJson.dependencies['@super-admin-org/theme-base']).toBe('^3.0.0')
    expect(packageJson.dependencies['@super-admin-org/theme-cyberpunk']).toBe('^4.0.0')
    expect(packageJson.dependencies['@super-admin-org/ui']).toBe('^5.0.0')
  })

  it('does not write into non-empty target directories', async () => {
    const tempRoot = await createTempRoot()
    const target = join(tempRoot, 'demo-admin')
    await mkdir(target)
    await writeFile(join(target, 'keep.txt'), 'existing file\n')

    const input = parseCreateSuperAdminArgs(['demo-admin', '--theme', 'base'], { cwd: tempRoot })

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

  it('prompts for theme selection when no theme flag is provided in an interactive terminal', async () => {
    const tempRoot = await createTempRoot()
    const output = []

    const exitCode = await runCreateSuperAdmin(['demo-admin'], {
      cwd: tempRoot,
      isTTY: true,
      promptThemes: async () => ['base', 'cyberpunk'],
      sourceRoot: repoRoot,
      stderr: (message) => output.push(`error:${message}`),
      stdout: (message) => output.push(message)
    })

    expect(exitCode).toBe(0)

    const packageJson = await readGeneratedJson(join(tempRoot, 'demo-admin'), 'package.json')
    const registry = await readGeneratedText(join(tempRoot, 'demo-admin'), 'src/super-admin/theme-registry.generated.ts')
    const preferences = await readGeneratedText(join(tempRoot, 'demo-admin'), 'src/shell/preferences/GlobalPreferences.vue')
    expect(packageJson.dependencies['@super-admin-org/theme-base']).toBe('^0.1.2')
    expect(packageJson.dependencies['@super-admin-org/theme-cyberpunk']).toBe('^0.1.2')
    expect(packageJson.dependencies['@super-admin-org/theme-crypto']).toBeUndefined()
    expect(registry).toContain("from '@super-admin-org/theme-base'")
    expect(registry).toContain("from '@super-admin-org/theme-cyberpunk'")
    expect(preferences).toContain('selectProfile')
    expect(preferences).not.toContain('selectLocale')
    expectControlCenterScrollingLayout(preferences)
  })

  it('requires an explicit theme flag when no interactive terminal is available', async () => {
    const tempRoot = await createTempRoot()
    const output = []

    const exitCode = await runCreateSuperAdmin(['demo-admin'], {
      cwd: tempRoot,
      isTTY: false,
      stderr: (message) => output.push(`error:${message}`),
      stdout: (message) => output.push(message)
    })

    expect(exitCode).toBe(1)
    expect(output.join('\n')).toContain('Theme selection is required')
    await expect(readdir(tempRoot)).resolves.toEqual([])
  })

  it('prints CLI help without generating a starter', async () => {
    const tempRoot = await createTempRoot()
    const output = []

    const exitCode = await runCreateSuperAdmin(['--help'], {
      cwd: tempRoot,
      stderr: (message) => output.push(`error:${message}`),
      stdout: (message) => output.push(message)
    })

    expect(exitCode).toBe(0)
    expect(output.join('\n')).toContain('Usage: create-super-admin <project>')
    expect(output.join('\n')).toContain('--themes base,cyberpunk')
    await expect(readdir(tempRoot)).resolves.toEqual([])
  })

  it('prints CLI help for the short help flag', async () => {
    const tempRoot = await createTempRoot()
    const output = []

    const exitCode = await runCreateSuperAdmin(['-h'], {
      cwd: tempRoot,
      stderr: (message) => output.push(`error:${message}`),
      stdout: (message) => output.push(message)
    })

    expect(exitCode).toBe(0)
    expect(output.join('\n')).toContain('Usage: create-super-admin <project>')
    await expect(readdir(tempRoot)).resolves.toEqual([])
  })

  it('prints usage guidance when the project name is missing', async () => {
    const tempRoot = await createTempRoot()
    const output = []

    const exitCode = await runCreateSuperAdmin([], {
      cwd: tempRoot,
      stderr: (message) => output.push(`error:${message}`),
      stdout: (message) => output.push(message)
    })

    expect(exitCode).toBe(1)
    expect(output.join('\n')).toContain('Usage: create-super-admin <project>')
    await expect(readdir(tempRoot)).resolves.toEqual([])
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

    await runCommand('node', [join(unpackRoot, 'package/dist/cli.js'), 'demo-admin', '--theme', 'base', '--pm', 'pnpm'], workspaceRoot)

    await expect(validateGeneratedStarterStatic(join(workspaceRoot, 'demo-admin'), { themes: ['base'] })).resolves.toEqual([])
  })
})
