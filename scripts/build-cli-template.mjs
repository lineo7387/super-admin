#!/usr/bin/env node
import { rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { materializeRuntimeTemplate } from '../packages/cli/dist/starter-source.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceAppDir = resolve(repoRoot, 'apps/admin')
const templateRoot = resolve(repoRoot, 'packages/cli/dist/starter-template/admin')

await rm(templateRoot, { force: true, recursive: true })
await materializeRuntimeTemplate(sourceAppDir, templateRoot)
