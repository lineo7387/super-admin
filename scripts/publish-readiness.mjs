#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { validateGeneratedStarter } from './validate-generated-starter.mjs'

export const publishCandidates = [
  {
    name: '@super-admin-org/core',
    path: 'packages/core',
    scoped: true
  },
  {
    name: '@super-admin-org/theme',
    path: 'packages/theme',
    scoped: true
  },
  {
    name: '@super-admin-org/theme-base',
    path: 'packages/theme-base',
    scoped: true
  },
  {
    name: '@super-admin-org/theme-crypto',
    path: 'packages/theme-crypto',
    scoped: true
  },
  {
    name: '@super-admin-org/theme-cyberpunk',
    path: 'packages/theme-cyberpunk',
    scoped: true
  },
  {
    name: '@super-admin-org/theme-industrial',
    path: 'packages/theme-industrial',
    scoped: true
  },
  {
    name: '@super-admin-org/theme-newsprint',
    path: 'packages/theme-newsprint',
    scoped: true
  },
  {
    name: '@super-admin-org/ui',
    path: 'packages/ui',
    scoped: true
  },
  {
    name: 'create-super-admin',
    path: 'packages/cli',
    scoped: false
  }
]

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dependencyGroupNames = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
const cliRuntimeTemplateRequiredFiles = [
  'dist/starter-template/admin/components.json',
  'dist/starter-template/admin/src/App.vue',
  'dist/starter-template/admin/src/i18n/locales/en-US.ts',
  'dist/starter-template/admin/src/i18n/locales/zh-CN.ts',
  'dist/starter-template/admin/src/main.ts',
  'dist/starter-template/admin/src/super-admin/theme-registry.generated.ts'
]

function toPosixPath(path) {
  return path.split(sep).join('/')
}

function removePackagePrefix(filePath) {
  return filePath.startsWith('package/') ? filePath.slice('package/'.length) : filePath
}

function normalizePackedFiles(files) {
  return new Set(files.map((file) => removePackagePrefix(typeof file === 'string' ? file : file.path)))
}

function getDependencyEntries(manifest) {
  return dependencyGroupNames.flatMap((groupName) => Object.entries(manifest[groupName] ?? {}))
}

function getWorkspaceRangeNames(manifest) {
  return getDependencyEntries(manifest)
    .filter(([, version]) => String(version).startsWith('workspace:'))
    .map(([name]) => name)
}

function createFailure(id, message) {
  return {
    id,
    message
  }
}

function collectExportTargets(value) {
  if (!value) {
    return []
  }

  if (typeof value === 'string') {
    return value.startsWith('./') ? [value.slice(2)] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectExportTargets)
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap(collectExportTargets)
  }

  return []
}

function getManifestTargets(manifest) {
  return [
    manifest.main,
    manifest.module,
    manifest.types,
    ...collectExportTargets(manifest.exports)
  ].filter((target, index, targets) => typeof target === 'string' && targets.indexOf(target) === index)
}

export function createPackedManifestFailures({ files, manifest, packageName }) {
  const failures = []
  const packedFiles = normalizePackedFiles(files)
  const workspaceRangeNames = getWorkspaceRangeNames(manifest)

  if (workspaceRangeNames.length > 0) {
    failures.push(
      createFailure(
        'packed-package-no-workspace-ranges',
        `${packageName} packed manifest must not expose workspace ranges: ${workspaceRangeNames.join(', ')}.`
      )
    )
  }

  const missingTargets = getManifestTargets(manifest)
    .map((target) => target.replace(/^\.\//, ''))
    .filter((target) => !packedFiles.has(target))

  if (missingTargets.length > 0) {
    failures.push(
      createFailure('packed-package-export-target-exists', `${packageName} manifest targets are missing from the tarball: ${missingTargets.join(', ')}.`)
    )
  }

  const buildArtifacts = [...packedFiles].filter((file) => file.endsWith('.tsbuildinfo') || /\.(test|spec)\./.test(file))

  if (buildArtifacts.length > 0) {
    failures.push(createFailure('packed-package-no-build-artifacts', `${packageName} tarball includes build/test artifacts: ${buildArtifacts.join(', ')}.`))
  }

  if (packageName === 'create-super-admin') {
    const missingTemplateFiles = cliRuntimeTemplateRequiredFiles.filter((file) => !packedFiles.has(file))
    const forbiddenTemplateFiles = [...packedFiles].filter((file) => file.startsWith('dist/starter-template/admin/src/api/reference/'))

    if (missingTemplateFiles.length > 0) {
      failures.push(
        createFailure(
          'packed-cli-runtime-template-present',
          `${packageName} tarball must include runtime starter template files: ${missingTemplateFiles.join(', ')}.`
        )
      )
    }

    if (forbiddenTemplateFiles.length > 0) {
      failures.push(
        createFailure(
          'packed-cli-runtime-template-no-reference-api',
          `${packageName} runtime starter template must not include optional reference API source: ${forbiddenTemplateFiles.join(', ')}.`
        )
      )
    }
  }

  if (!packedFiles.has('README.md')) {
    failures.push(createFailure('packed-package-readme-present', `${packageName} tarball must include README.md.`))
  }

  return failures
}

export function createTarballDependencyMap(projectDir, tarballs, options = {}) {
  return Object.fromEntries(
    tarballs.map(({ name, tarballPath }) => {
      if (options.absolute === true) {
        return [name, `file:${tarballPath}`]
      }

      const relativePath = toPosixPath(relative(projectDir, tarballPath))
      return [name, `file:${relativePath.startsWith('.') ? relativePath : `./${relativePath}`}`]
    })
  )
}

export function rewriteStarterPackageJson(packageJson, tarballDependencyMap) {
  return {
    ...packageJson,
    dependencies: Object.fromEntries(
      Object.entries(packageJson.dependencies ?? {}).map(([name, version]) => [name, tarballDependencyMap[name] ?? version])
    ),
    pnpm: {
      ...(packageJson.pnpm ?? {}),
      overrides: {
        ...(packageJson.pnpm?.overrides ?? {}),
        ...tarballDependencyMap
      }
    }
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}

function runCommand(command, args, cwd, options = {}) {
  return new Promise((resolveRun, reject) => {
    const stderrChunks = []
    const stdoutChunks = []
    const child = spawn(command, args, {
      cwd,
      stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'
    })

    if (options.capture) {
      child.stdout.on('data', (chunk) => {
        stdoutChunks.push(chunk)
      })
      child.stderr.on('data', (chunk) => {
        stderrChunks.push(chunk)
      })
    }

    child.on('error', reject)
    child.on('exit', (code) => {
      const stderr = Buffer.concat(stderrChunks).toString()
      const stdout = Buffer.concat(stdoutChunks).toString()

      if (code === 0) {
        resolveRun(stdout)
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}.\n${stdout}${stderr}`))
    })
  })
}

async function buildCandidates() {
  for (const candidate of publishCandidates) {
    await runCommand('pnpm', ['--filter', candidate.name, 'build'], repoRoot)
  }
}

async function packCandidate(candidate, tarballDir) {
  const packageDir = resolve(repoRoot, candidate.path)
  const dryRunOutput = await runCommand('npm', ['pack', '--dry-run', '--json'], packageDir, { capture: true })
  const [dryRun] = JSON.parse(dryRunOutput)
  const manifest = await readJson(resolve(packageDir, 'package.json'))
  const failures = createPackedManifestFailures({
    files: dryRun.files,
    manifest,
    packageName: candidate.name
  })

  if (failures.length > 0) {
    throw new Error(
      failures.map((failure) => `${failure.id}: ${failure.message}`).join('\n')
    )
  }

  const packOutput = await runCommand('npm', ['pack', '--json', '--pack-destination', tarballDir], packageDir, { capture: true })
  const [packed] = JSON.parse(packOutput)

  return {
    manifestPath: resolve(packageDir, 'package.json'),
    name: candidate.name,
    tarballPath: resolve(tarballDir, packed.filename)
  }
}

async function packCandidates(outputDir) {
  const tarballDir = resolve(outputDir, 'tarballs')
  await mkdir(tarballDir, { recursive: true })

  const tarballs = []

  for (const candidate of publishCandidates) {
    tarballs.push(await packCandidate(candidate, tarballDir))
  }

  return tarballs
}

async function extractPackedCli(outputDir, tarballs) {
  const cliTarball = tarballs.find((tarball) => tarball.name === 'create-super-admin')

  if (!cliTarball) {
    throw new Error('create-super-admin tarball is required for starter validation.')
  }

  const packedCliRoot = resolve(outputDir, 'packed-create-super-admin')
  await rm(packedCliRoot, { force: true, recursive: true })
  await mkdir(packedCliRoot, { recursive: true })
  await runCommand('tar', ['-xzf', cliTarball.tarballPath, '-C', packedCliRoot], repoRoot)

  return resolve(packedCliRoot, 'package/dist/cli.js')
}

async function generateStarter(cliBinPath, targetDir, args) {
  await runCommand('node', [cliBinPath, targetDir, ...args, '--pm', 'pnpm'], repoRoot)
}

async function rewriteStarterDependencies(projectDir, tarballs) {
  const packageJsonPath = resolve(projectDir, 'package.json')
  const packageJson = await readJson(packageJsonPath)
  const tarballDependencyMap = createTarballDependencyMap(projectDir, tarballs, { absolute: true })
  await writeJson(packageJsonPath, rewriteStarterPackageJson(packageJson, tarballDependencyMap))
}

async function validateStarterVariant({ args, cliBinPath, i18n, outputDir, tarballs, themes }) {
  const projectDir = resolve(outputDir, args.length === 0 ? 'starter-default' : `starter-${themes.join('-')}${i18n ? '-i18n' : ''}`)

  await rm(projectDir, { force: true, recursive: true })
  await generateStarter(cliBinPath, projectDir, args)
  await rewriteStarterDependencies(projectDir, tarballs)

  const failures = await validateGeneratedStarter(projectDir, {
    i18n,
    packageManager: 'pnpm',
    packageManifestPaths: tarballs.map((tarball) => tarball.manifestPath),
    themes
  })

  if (failures.length > 0) {
    throw new Error(failures.map((failure) => `${failure.id}: ${failure.message}`).join('\n'))
  }
}

async function validateLocalStarters(outputDir, tarballs) {
  const starterRoot = await mkdtemp(resolve(tmpdir(), 'super-admin-starter-smoke-'))
  const cliBinPath = await extractPackedCli(outputDir, tarballs)

  await validateStarterVariant({
    args: [],
    cliBinPath,
    i18n: false,
    outputDir: starterRoot,
    tarballs,
    themes: ['base']
  })
  await validateStarterVariant({
    args: ['--themes', 'base,cyberpunk', '--i18n'],
    cliBinPath,
    i18n: true,
    outputDir: starterRoot,
    tarballs,
    themes: ['base', 'cyberpunk']
  })

  await writeFile(resolve(outputDir, 'starter-smoke-root.txt'), `${starterRoot}\n`)
}

function parseArgs(argv) {
  return {
    outputDir: resolve(repoRoot, 'output/npm-publish-readiness'),
    skipBuild: argv.includes('--skip-build'),
    skipStarterSmoke: argv.includes('--skip-starter-smoke')
  }
}

export async function validatePublishReadiness(options = {}) {
  const outputDir = options.outputDir ?? resolve(repoRoot, 'output/npm-publish-readiness')
  await rm(outputDir, { force: true, recursive: true })
  await mkdir(outputDir, { recursive: true })

  if (options.skipBuild !== true) {
    await buildCandidates()
  }

  const tarballs = await packCandidates(outputDir)

  if (options.skipStarterSmoke !== true) {
    await validateLocalStarters(outputDir, tarballs)
  }

  return {
    outputDir,
    tarballs
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await validatePublishReadiness(options)

  console.log(`Publish readiness validation passed. Artifacts: ${result.outputDir}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
