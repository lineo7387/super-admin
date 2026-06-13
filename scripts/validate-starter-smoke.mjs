#!/usr/bin/env node
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validatePublishReadiness } from './publish-readiness.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

async function main() {
  const result = await validatePublishReadiness({
    outputDir: resolve(repoRoot, 'output/starter-validation'),
    skipBuild: process.argv.includes('--skip-build')
  })

  console.log(`Starter validation passed. Artifacts: ${result.outputDir}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
