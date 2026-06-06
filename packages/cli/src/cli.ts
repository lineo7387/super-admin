#!/usr/bin/env node
import { runCreateSuperAdmin } from './run-create-super-admin.js'

const exitCode = await runCreateSuperAdmin(process.argv.slice(2))
process.exitCode = exitCode
