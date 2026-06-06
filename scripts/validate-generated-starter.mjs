import { access, readFile, readdir } from 'node:fs/promises'
import { createServer } from 'node:net'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

export const themePackageById = {
  base: '@super-admin/theme-base',
  crypto: '@super-admin/theme-crypto',
  cyberpunk: '@super-admin/theme-cyberpunk',
  industrial: '@super-admin/theme-industrial',
  newsprint: '@super-admin/theme-newsprint'
}

const allowedDefaultScripts = new Set(['dev', 'build', 'typecheck', 'preview'])
const allThemeProfilePackages = Object.values(themePackageById)
const forbiddenMaintainerToolingPackages = new Set([
  '@playwright/test',
  'eslint',
  'playwright',
  'prettier',
  'vitepress',
  'vitest'
])
const textFileExtensions = new Set(['.css', '.html', '.json', '.md', '.mjs', '.ts', '.tsx', '.vue', '.js'])

function createFailure(id, message, file) {
  return {
    file,
    id,
    message
  }
}

function getExtension(filePath) {
  const dotIndex = filePath.lastIndexOf('.')
  return dotIndex >= 0 ? filePath.slice(dotIndex) : ''
}

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function readText(path) {
  return readFile(path, 'utf8')
}

async function readJson(path) {
  const text = await readText(path)
  return JSON.parse(text)
}

async function collectFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = resolve(current, entry.name)
    const relativePath = absolutePath.slice(root.length + 1)

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') {
        continue
      }

      files.push(...(await collectFiles(root, absolutePath)))
      continue
    }

    if (entry.isFile()) {
      files.push(relativePath)
    }
  }

  return files
}

function getDependencyGroups(packageJson) {
  return [
    packageJson.dependencies ?? {},
    packageJson.devDependencies ?? {},
    packageJson.optionalDependencies ?? {},
    packageJson.peerDependencies ?? {}
  ]
}

function getAllDependencyEntries(packageJson) {
  return getDependencyGroups(packageJson).flatMap((group) => Object.entries(group))
}

function getWorkspaceRangeEntries(packageJson) {
  return getAllDependencyEntries(packageJson).filter(([, version]) => String(version).startsWith('workspace:'))
}

function normalizeThemes(themes = ['base']) {
  const normalizedThemes = []

  for (const theme of themes) {
    if (!Object.hasOwn(themePackageById, theme)) {
      throw new Error(`Unknown theme "${theme}". Supported themes: ${Object.keys(themePackageById).join(', ')}`)
    }

    if (!normalizedThemes.includes(theme)) {
      normalizedThemes.push(theme)
    }
  }

  if (normalizedThemes.length === 0) {
    throw new Error('At least one generated starter theme is required.')
  }

  return normalizedThemes
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

function sortedUnique(values) {
  return [...new Set(values)].sort()
}

function getExpectedThemePackages(themes) {
  return sortedUnique(themes.map((theme) => themePackageById[theme]))
}

function validatePackageJson(packageJson, themes) {
  const failures = []
  const scripts = packageJson.scripts ?? {}
  const scriptNames = Object.keys(scripts)
  const disallowedScripts = scriptNames.filter((scriptName) => !allowedDefaultScripts.has(scriptName))
  const missingScripts = [...allowedDefaultScripts].filter((scriptName) => !(scriptName in scripts))

  if (disallowedScripts.length > 0 || missingScripts.length > 0) {
    failures.push(
      createFailure(
        'package-default-scripts-only',
        `Generated package scripts must be only dev, build, typecheck, and preview. Disallowed: ${disallowedScripts.join(', ') || 'none'}; missing: ${missingScripts.join(', ') || 'none'}.`,
        'package.json'
      )
    )
  }

  const workspaceEntries = getWorkspaceRangeEntries(packageJson)

  if (workspaceEntries.length > 0) {
    failures.push(
      createFailure(
        'package-no-workspace-ranges',
        `Generated package.json must not expose workspace ranges: ${workspaceEntries.map(([name]) => name).join(', ')}.`,
        'package.json'
      )
    )
  }

  const dependencies = packageJson.dependencies ?? {}
  const actualThemePackages = sortedUnique(Object.keys(dependencies).filter((name) => allThemeProfilePackages.includes(name)))
  const expectedThemePackages = getExpectedThemePackages(themes)

  if (!arraysEqual(actualThemePackages, expectedThemePackages)) {
    failures.push(
      createFailure(
        'theme-packages-match-selection',
        `Installed theme packages must match selected themes. Expected ${expectedThemePackages.join(', ')}; found ${actualThemePackages.join(', ') || 'none'}.`,
        'package.json'
      )
    )
  }

  if (!('@super-admin/theme' in dependencies)) {
    failures.push(createFailure('theme-runtime-package-present', 'Generated package.json must include @super-admin/theme.', 'package.json'))
  }

  const toolingEntries = getAllDependencyEntries(packageJson)
    .map(([name]) => name)
    .filter((name) => forbiddenMaintainerToolingPackages.has(name))

  if (toolingEntries.length > 0) {
    failures.push(
      createFailure(
        'package-no-maintainer-tooling-dependencies',
        `Generated package.json must not include maintainer-only tooling dependencies: ${toolingEntries.join(', ')}.`,
        'package.json'
      )
    )
  }

  return failures
}

async function validatePackedPackageManifests(packageManifestPaths = []) {
  const failures = []

  for (const manifestPath of packageManifestPaths) {
    const packageJson = await readJson(manifestPath)
    const workspaceEntries = getWorkspaceRangeEntries(packageJson)

    if (workspaceEntries.length === 0) {
      continue
    }

    failures.push(
      createFailure(
        'packed-package-no-workspace-ranges',
        `Packed package manifest must not expose workspace ranges: ${workspaceEntries.map(([name]) => name).join(', ')}.`,
        manifestPath
      )
    )
  }

  return failures
}

function getRegistryThemeImports(registryText) {
  const imports = []
  const importRegex = /from\s+['"](@super-admin\/theme-[^'"]+)['"]/g
  let match = importRegex.exec(registryText)

  while (match) {
    imports.push(match[1])
    match = importRegex.exec(registryText)
  }

  return sortedUnique(imports)
}

function validateThemeRegistry(registryText, themes) {
  const actualImports = getRegistryThemeImports(registryText)
  const expectedImports = getExpectedThemePackages(themes)

  if (arraysEqual(actualImports, expectedImports)) {
    return []
  }

  return [
    createFailure(
      'theme-registry-imports-match-selection',
      `Theme registry imports must match selected themes. Expected ${expectedImports.join(', ')}; found ${actualImports.join(', ') || 'none'}.`,
      'src/super-admin/theme-registry.generated.ts'
    )
  ]
}

async function readTextFiles(root, files) {
  const entries = []

  for (const file of files) {
    if (!textFileExtensions.has(getExtension(file))) {
      continue
    }

    entries.push({
      file,
      text: await readText(resolve(root, file))
    })
  }

  return entries
}

function validateNoMonorepoPaths(textEntries) {
  const leakingFiles = textEntries
    .filter(({ text }) => text.includes('../../packages') || text.includes('../../../../packages'))
    .map(({ file }) => file)

  if (leakingFiles.length === 0) {
    return []
  }

  return [
    createFailure(
      'source-no-monorepo-package-paths',
      `Generated source must not reference monorepo package paths: ${leakingFiles.join(', ')}.`,
      leakingFiles[0]
    )
  ]
}

function validateTsconfig(tsconfigText) {
  if (!tsconfigText.includes('../../packages') && !tsconfigText.includes('@super-admin/')) {
    return []
  }

  return [
    createFailure(
      'tsconfig-no-package-path-aliases',
      'Generated tsconfig.json must not map @super-admin/* to monorepo package source paths.',
      'tsconfig.json'
    )
  ]
}

function validateForbiddenOutput(root, files) {
  const failures = []

  if (files.some((file) => file.startsWith('docs/'))) {
    failures.push(createFailure('root-no-docs-site', 'Generated projects must not include the VitePress docs site.', 'docs/'))
  }

  if (files.some((file) => file.startsWith('apps/api/'))) {
    failures.push(createFailure('root-no-backend-app', 'Generated projects must not include optional backend apps.', 'apps/api/'))
  }

  if (files.some((file) => file.startsWith('src/api/reference/'))) {
    failures.push(createFailure('source-no-reference-api', 'Generated default source must not include optional reference API helpers.', 'src/api/reference/'))
  }

  const generatedTests = files.filter((file) => file.startsWith('src/') && /\.(test|spec)\.(ts|tsx|js|mjs)$/.test(file))

  if (generatedTests.length > 0) {
    failures.push(
      createFailure(
        'source-no-generated-tests',
        `Generated projects must not include test files by default: ${generatedTests.join(', ')}.`,
        generatedTests[0]
      )
    )
  }

  return failures
}

function validateReferenceEnv(textEntries) {
  const leakingFiles = textEntries
    .filter(({ file, text }) => file.startsWith('src/') && /VITE_SUPER_ADMIN_(API_BASE_URL|REFERENCE_TOKEN|USERS_API)/.test(text))
    .map(({ file }) => file)

  if (leakingFiles.length === 0) {
    return []
  }

  return [
    createFailure(
      'source-no-reference-env',
      `Generated default source must not declare or require optional reference backend env vars: ${leakingFiles.join(', ')}.`,
      leakingFiles[0]
    )
  ]
}

function validateDefaultSwitcherOutput(root, files, textEntries, themes, i18nEnabled) {
  const failures = []

  if (!i18nEnabled && files.includes('src/i18n/locales/en-US.ts')) {
    failures.push(createFailure('default-no-language-switcher', 'No-flags output must not include optional en-US runtime locale switching.', 'src/i18n/locales/en-US.ts'))
  }

  if (!i18nEnabled) {
    const localeSwitcherFile = textEntries.find(
      ({ file, text }) => file === 'src/shell/preferences/GlobalPreferences.vue' && (text.includes('setLocale') || text.includes('localeOptions'))
    )

    if (localeSwitcherFile) {
      failures.push(createFailure('default-no-language-switcher', 'No-flags output must not expose a runtime locale switcher.', localeSwitcherFile.file))
    }
  }

  if (themes.length === 1) {
    const themeSwitcherFile = textEntries.find(
      ({ file, text }) => file === 'src/shell/preferences/GlobalPreferences.vue' && (text.includes('setProfile') || text.includes('selectProfile'))
    )

    if (themeSwitcherFile) {
      failures.push(createFailure('default-no-theme-switcher', 'Single-theme output must not expose runtime theme/profile switching.', themeSwitcherFile.file))
    }
  }

  return failures
}

function validateDataBoundary(files, textEntries) {
  const failures = []

  if (!files.some((file) => file.startsWith('src/api/mock/'))) {
    failures.push(createFailure('data-boundary-has-mock-api', 'Generated projects must keep mock API data under src/api/mock/.', 'src/api/mock/'))
  }

  if (!files.some((file) => file.startsWith('src/modules/') && file.endsWith('.queries.ts'))) {
    failures.push(createFailure('data-boundary-has-module-queries', 'Generated projects must keep module query composables under src/modules/.', 'src/modules/'))
  }

  const directTransportPages = textEntries
    .filter(({ file }) => file.startsWith('src/modules/') && file.endsWith('.vue') && !file.startsWith('src/modules/auth/'))
    .filter(({ text }) => /\bfetch\s*\(|\baxios\b|from\s+['"]@\/api\//.test(text))
    .map(({ file }) => file)

  if (directTransportPages.length > 0) {
    failures.push(
      createFailure(
        'module-pages-no-direct-transport',
        `Generated module pages must call query composables instead of transport/API adapters directly: ${directTransportPages.join(', ')}.`,
        directTransportPages[0]
      )
    )
  }

  return failures
}

export async function validateGeneratedStarterStatic(projectDir, options = {}) {
  const root = resolve(projectDir)
  const themes = normalizeThemes(options.themes)
  const i18nEnabled = options.i18n === true
  const packageJsonPath = resolve(root, 'package.json')
  const tsconfigPath = resolve(root, 'tsconfig.json')
  const registryPath = resolve(root, 'src/super-admin/theme-registry.generated.ts')
  const failures = []

  if (!(await pathExists(packageJsonPath))) {
    failures.push(createFailure('root-has-package-json', 'Generated project must include package.json.', 'package.json'))
    return failures
  }

  const packageJson = await readJson(packageJsonPath)
  const files = await collectFiles(root)
  const textEntries = await readTextFiles(root, files)

  failures.push(...(await validatePackedPackageManifests(options.packageManifestPaths)))
  failures.push(...validatePackageJson(packageJson, themes))
  failures.push(...validateForbiddenOutput(root, files))
  failures.push(...validateNoMonorepoPaths(textEntries))
  failures.push(...validateReferenceEnv(textEntries))
  failures.push(...validateDefaultSwitcherOutput(root, files, textEntries, themes, i18nEnabled))
  failures.push(...validateDataBoundary(files, textEntries))

  if (await pathExists(tsconfigPath)) {
    failures.push(...validateTsconfig(await readText(tsconfigPath)))
  } else {
    failures.push(createFailure('root-has-tsconfig', 'Generated project must include tsconfig.json.', 'tsconfig.json'))
  }

  if (await pathExists(registryPath)) {
    failures.push(...validateThemeRegistry(await readText(registryPath), themes))
  } else {
    failures.push(createFailure('theme-registry-present', 'Generated project must include src/super-admin/theme-registry.generated.ts.', 'src/super-admin/theme-registry.generated.ts'))
  }

  return failures
}

async function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()

    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()

      server.close(() => {
        if (typeof address === 'object' && address !== null) {
          resolvePort(address.port)
          return
        }

        reject(new Error('Unable to allocate a local port.'))
      })
    })
  })
}

function getPackageManagerCommand(packageManager, script, extraArgs = []) {
  if (script === 'install') {
    return {
      args: ['install'],
      command: packageManager
    }
  }

  return {
    args: ['run', script, ...extraArgs],
    command: packageManager
  }
}

async function runCommand({ args, command, cwd, label }) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit'
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolveRun()
        return
      }

      reject(new Error(`${label} failed with exit code ${code}.`))
    })
  })
}

async function waitForHttp(url, timeoutMs = 20_000) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(1_000)
      })

      if (response.ok) {
        return
      }
    } catch {
      // Keep polling until the generated app becomes reachable or times out.
    }

    await new Promise((resolveWait) => {
      setTimeout(resolveWait, 250)
    })
  }

  throw new Error(`Generated starter did not become reachable at ${url} within ${timeoutMs}ms.`)
}

async function runStartupSmoke(projectDir, packageManager) {
  const port = await getFreePort()
  const { args, command } = getPackageManagerCommand(packageManager, 'dev', ['--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'])
  const child = spawn(command, args, {
    cwd: projectDir,
    stdio: ['ignore', 'pipe', 'pipe']
  })
  const logs = []

  child.stdout.on('data', (chunk) => {
    logs.push(chunk.toString())
  })
  child.stderr.on('data', (chunk) => {
    logs.push(chunk.toString())
  })

  try {
    await waitForHttp(`http://127.0.0.1:${port}`)
  } catch (error) {
    throw new Error(`${error.message}\n${logs.join('')}`)
  } finally {
    child.kill('SIGTERM')
  }
}

function detectPackageManager(packageJson, explicitPackageManager) {
  if (explicitPackageManager) {
    return explicitPackageManager
  }

  const packageManager = typeof packageJson.packageManager === 'string' ? packageJson.packageManager.split('@')[0] : ''

  if (['pnpm', 'npm', 'yarn', 'bun'].includes(packageManager)) {
    return packageManager
  }

  return 'pnpm'
}

export async function validateGeneratedStarter(projectDir, options = {}) {
  const root = resolve(projectDir)
  const failures = await validateGeneratedStarterStatic(root, options)

  if (failures.length > 0) {
    return failures
  }

  if (options.staticOnly === true) {
    return []
  }

  const packageJson = await readJson(resolve(root, 'package.json'))
  const packageManager = detectPackageManager(packageJson, options.packageManager)

  for (const script of ['install', 'typecheck', 'build']) {
    const { args, command } = getPackageManagerCommand(packageManager, script)
    await runCommand({
      args,
      command,
      cwd: root,
      label: `generated starter ${script}`
    })
  }

  await runStartupSmoke(root, packageManager)

  return []
}

function parseArgs(argv) {
  const args = [...argv]
  const projectDir = args.shift()
  const options = {
    themes: ['base']
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--static-only') {
      options.staticOnly = true
      continue
    }

    if (arg === '--i18n') {
      options.i18n = true
      continue
    }

    if (arg === '--pm') {
      options.packageManager = args[index + 1]
      index += 1
      continue
    }

    if (arg === '--package-manifest') {
      options.packageManifestPaths = [...(options.packageManifestPaths ?? []), args[index + 1]]
      index += 1
      continue
    }

    if (arg === '--theme') {
      options.themes = [args[index + 1]]
      index += 1
      continue
    }

    if (arg === '--themes') {
      options.themes = args[index + 1].split(',').map((theme) => theme.trim()).filter(Boolean)
      index += 1
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  return {
    options,
    projectDir
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { options, projectDir } = parseArgs(process.argv.slice(2))

  if (!projectDir) {
    console.error('Usage: node scripts/validate-generated-starter.mjs <project-dir> [--static-only] [--theme base] [--themes base,cyberpunk] [--i18n] [--pm pnpm] [--package-manifest path]')
    process.exitCode = 1
  } else {
    validateGeneratedStarter(projectDir, options)
      .then((failures) => {
        if (failures.length > 0) {
          for (const failure of failures) {
            console.error(`[${failure.id}] ${failure.message}`)
          }
          process.exitCode = 1
          return
        }

        console.log('Generated starter validation passed.')
      })
      .catch((error) => {
        console.error(error instanceof Error ? error.message : error)
        process.exitCode = 1
      })
  }
}
