import { access, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const GENERATED_EXAMPLE_PATHS = [
  'ai-context/charts.md',
  'src/api/access.api.ts',
  'src/api/dashboard.api.ts',
  'src/api/mock/access.mock.ts',
  'src/api/mock/dashboard.mock.ts',
  'src/api/mock/users.mock.ts',
  'src/api/mock/workbench.mock.ts',
  'src/api/users.api.ts',
  'src/api/workbench.api.ts',
  'src/modules/access',
  'src/modules/charts',
  'src/modules/dashboard',
  'src/modules/examples',
  'src/modules/users',
  'src/modules/workbench',
  'src/shared/charts'
]

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function updateOptionalTextFile(path, transform) {
  if (!(await pathExists(path))) {
    return
  }

  const current = await readFile(path, 'utf8')
  const next = transform(current)

  if (next !== current) {
    await writeFile(path, next)
  }
}

function removeExamplesRegistration(registryText) {
  const withoutImport = registryText.replace(/^import \{ examplesRegistration \} from ['"]\.\/examples\/examples\.registration['"]\n/m, '')
  const withoutRegistration = withoutImport.replace(/^\s{4}examplesRegistration,\n/m, '')

  if (withoutRegistration.includes('examplesRegistration')) {
    throw new Error('Cannot safely remove Examples: src/modules/module-registry.ts contains an unsupported examplesRegistration reference.')
  }

  return withoutRegistration
}

export async function removeGeneratedExamples(projectDir) {
  const root = resolve(projectDir)
  const packageJsonPath = resolve(root, 'package.json')
  const agentsPath = resolve(root, 'AGENTS.md')
  const registryPath = resolve(root, 'src/modules/module-registry.ts')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
  const agentsText = await readFile(agentsPath, 'utf8')

  if (!agentsText.includes('本项目是由 `create-super-admin` 生成的用户后台项目。')) {
    throw new Error('Refusing to remove Examples outside a create-super-admin generated project.')
  }

  const registryText = await readFile(registryPath, 'utf8')
  const nextRegistryText = removeExamplesRegistration(registryText)
  const dependencies = { ...(packageJson.dependencies ?? {}) }

  delete dependencies.echarts
  delete dependencies['vue-echarts']

  await Promise.all(GENERATED_EXAMPLE_PATHS.map((path) => rm(resolve(root, path), { force: true, recursive: true })))
  await writeFile(
    packageJsonPath,
    `${JSON.stringify(
      {
        ...packageJson,
        dependencies
      },
      null,
      2
    )}\n`
  )
  await writeFile(registryPath, nextRegistryText)
  await updateOptionalTextFile(resolve(root, 'AGENTS.md'), (text) => text.replace(/^@ai-context\/charts\.md\n/m, ''))
  await updateOptionalTextFile(resolve(root, 'super-admin.config.ts'), (text) => text.replace("provider: 'echarts'", "provider: 'none'"))

  return {
    removedPaths: [...GENERATED_EXAMPLE_PATHS]
  }
}
