import { SUPPORTED_NODE_RANGE, themePackageById, validateGeneratedStarterStatic } from './starter-validation-static.mjs'
import { validateGeneratedStarter } from './starter-validation-runtime.mjs'

export { SUPPORTED_NODE_RANGE, themePackageById, validateGeneratedStarter, validateGeneratedStarterStatic }

export function parseGeneratedStarterArgs(argv) {
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

    if (arg === '--locale') {
      options.locale = args[index + 1]
      index += 1
      continue
    }

    if (arg === '--no-examples') {
      options.examples = 'removed'
      continue
    }

    if (arg === '--minimal') {
      options.quality = 'minimal'
      continue
    }

    if (arg === '--standard') {
      options.quality = 'standard'
      continue
    }

    if (arg === '--pm') {
      options.packageManager = args[index + 1]
      index += 1
      continue
    }

    if (arg === '--charts') {
      options.charts = args[index + 1]
      index += 1
      continue
    }

    if (arg === '--no-charts') {
      options.charts = 'none'
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
      options.themes = args[index + 1]
        .split(',')
        .map((theme) => theme.trim())
        .filter(Boolean)
      index += 1
      continue
    }

    throw new Error(`Unknown option: ${arg}`)
  }

  if (options.examples === 'removed' && options.charts === 'echarts') {
    throw new Error('--no-examples cannot be combined with --charts echarts because charts are generated under Examples.')
  }

  return {
    options,
    projectDir
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { options, projectDir } = parseGeneratedStarterArgs(process.argv.slice(2))

  if (!projectDir) {
    console.error(
      'Usage: node scripts/validate-generated-starter.mjs <project-dir> [--static-only] [--theme base] [--themes base,cyberpunk] [--charts echarts] [--no-charts] [--i18n] [--locale zh-CN|en-US] [--no-examples] [--minimal|--standard] [--pm pnpm] [--package-manifest path]'
    )
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
