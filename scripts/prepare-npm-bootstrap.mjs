#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { publishCandidates } from './publish-readiness.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const bootstrapVersion = '0.0.0-bootstrap.0'
const outputDir = resolve(repoRoot, 'output/npm-bootstrap')
const stagingDir = resolve(outputDir, 'staging')
const tarballDir = resolve(outputDir, 'tarballs')

function safeName(name) {
  return name.replace(/^@/, '').replaceAll('/', '-')
}

function runCommand(command, args, cwd) {
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

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}.`))
    })
  })
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}

function rewriteInternalDependencyVersions(manifest) {
  const publishNames = new Set(publishCandidates.map((candidate) => candidate.name))

  for (const groupName of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
    for (const dependencyName of Object.keys(manifest[groupName] ?? {})) {
      if (publishNames.has(dependencyName)) {
        manifest[groupName][dependencyName] = bootstrapVersion
      }
    }
  }
}

async function stageBootstrapPackage(candidate) {
  const packageDir = resolve(repoRoot, candidate.path)
  const targetDir = resolve(stagingDir, safeName(candidate.name))
  const sourceManifest = await readJson(resolve(packageDir, 'package.json'))
  const manifest = {
    ...sourceManifest,
    version: bootstrapVersion
  }

  rewriteInternalDependencyVersions(manifest)

  await mkdir(targetDir, { recursive: true })
  await cp(resolve(packageDir, 'dist'), resolve(targetDir, 'dist'), { recursive: true })
  await cp(resolve(packageDir, 'README.md'), resolve(targetDir, 'README.md'))
  await writeJson(resolve(targetDir, 'package.json'), manifest)
  await runCommand('npm', ['pack', '--json', '--pack-destination', tarballDir], targetDir)
}

try {
  await rm(outputDir, { force: true, recursive: true })
  await mkdir(tarballDir, { recursive: true })

  for (const candidate of publishCandidates) {
    await stageBootstrapPackage(candidate)
  }

  console.log(`Bootstrap tarballs prepared in ${tarballDir}`)
  console.log('Do not publish them until the user explicitly approves the bootstrap registry mutation.')
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
