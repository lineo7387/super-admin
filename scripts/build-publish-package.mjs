#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { build } from 'vite'

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

async function readPackageJson(packageDir) {
  return JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8'))
}

function createExternalMatcher(packageJson) {
  const dependencyNames = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {})
  ]

  return (id) => dependencyNames.some((dependencyName) => id === dependencyName || id.startsWith(`${dependencyName}/`))
}

async function buildPackage(packageDir) {
  const packageJson = await readPackageJson(packageDir)
  const usesVue = existsSync(resolve(packageDir, 'src/env.d.ts'))

  await build({
    configFile: false,
    plugins: usesVue ? [vue()] : [],
    root: packageDir,
    build: {
      emptyOutDir: true,
      lib: {
        entry: resolve(packageDir, 'src/index.ts'),
        fileName: 'index',
        formats: ['es']
      },
      outDir: resolve(packageDir, 'dist'),
      rolldownOptions: {
        external: createExternalMatcher(packageJson)
      },
      sourcemap: true,
      target: 'es2022'
    }
  })

  await rm(resolve(packageDir, 'tsconfig.build.tsbuildinfo'), { force: true })
  await runCommand('pnpm', ['exec', usesVue ? 'vue-tsc' : 'tsc', '-p', 'tsconfig.build.json'], packageDir)
}

const packageDir = resolve(process.cwd(), process.argv[2] ?? '.')

try {
  await buildPackage(packageDir)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
