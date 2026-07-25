import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { removeGeneratedExamples } from './prune-generated-starter-examples.mjs'

const tempRoots = []

async function writeText(root, filePath, content) {
  const target = join(root, filePath)
  await mkdir(join(target, '..'), { recursive: true })
  await writeFile(target, content)
}

async function pathExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })))
})

describe('generated starter example pruning', () => {
  it('removes the full example slice while preserving app infrastructure', async () => {
    const root = await mkdtemp(join(tmpdir(), 'super-admin-prune-examples-'))
    tempRoots.push(root)

    await writeText(
      root,
      'package.json',
      `${JSON.stringify(
        {
          dependencies: {
            echarts: '^6.1.0',
            vue: '^3.5.0',
            'vue-echarts': '^8.0.1'
          }
        },
        null,
        2
      )}\n`
    )
    await writeText(
      root,
      'src/modules/module-registry.ts',
      `import { createAppModuleRegistry } from './app-module-registry'
import { examplesRegistration } from './examples/examples.registration'
import { uiKitManifest } from './ui-kit/ui-kit.manifest'

export const appModuleRegistry = createAppModuleRegistry(
  [
    examplesRegistration,
    {
      manifest: uiKitManifest
    }
  ],
  {
    emptyPath: '/workspace'
  }
)
`
    )
    await writeText(root, 'src/modules/examples/examples.registration.ts', 'export const examplesRegistration = {}\n')
    await writeText(root, 'src/modules/dashboard/DashboardPage.vue', '<template><div /></template>\n')
    await writeText(root, 'src/modules/charts/ChartsPage.vue', '<template><div /></template>\n')
    await writeText(root, 'src/shared/charts/echarts-options.ts', 'export const options = {}\n')
    await writeText(root, 'src/api/dashboard.api.ts', 'export const getDashboard = () => []\n')
    await writeText(root, 'src/api/mock/dashboard.mock.ts', 'export const mockDashboard = []\n')
    await writeText(root, 'src/modules/ui-kit/ui-kit.manifest.ts', 'export const uiKitManifest = {}\n')
    await writeText(root, 'src/modules/auth/LoginPage.vue', '<template><div /></template>\n')
    await writeText(root, 'ai-context/charts.md', '# Charts\n')
    await writeText(root, 'AGENTS.md', '本项目是由 `create-super-admin` 生成的用户后台项目。\n@ai-context/core.md\n@ai-context/charts.md\n')
    await writeText(root, 'super-admin.config.ts', "export default { charts: { provider: 'echarts' } }\n")

    await removeGeneratedExamples(root)

    const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
    const registry = await readFile(join(root, 'src/modules/module-registry.ts'), 'utf8')
    const agents = await readFile(join(root, 'AGENTS.md'), 'utf8')
    const config = await readFile(join(root, 'super-admin.config.ts'), 'utf8')

    expect(packageJson.dependencies).toEqual({
      vue: '^3.5.0'
    })
    expect(registry).not.toContain('examplesRegistration')
    expect(registry).toContain('uiKitManifest')
    expect(agents).not.toContain('@ai-context/charts.md')
    expect(config).toContain("provider: 'none'")
    await expect(pathExists(join(root, 'src/modules/examples'))).resolves.toBe(false)
    await expect(pathExists(join(root, 'src/modules/dashboard'))).resolves.toBe(false)
    await expect(pathExists(join(root, 'src/modules/charts'))).resolves.toBe(false)
    await expect(pathExists(join(root, 'src/shared/charts'))).resolves.toBe(false)
    await expect(pathExists(join(root, 'src/api/dashboard.api.ts'))).resolves.toBe(false)
    await expect(pathExists(join(root, 'src/api/mock/dashboard.mock.ts'))).resolves.toBe(false)
    await expect(pathExists(join(root, 'ai-context/charts.md'))).resolves.toBe(false)
    await expect(pathExists(join(root, 'src/modules/ui-kit/ui-kit.manifest.ts'))).resolves.toBe(true)
    await expect(pathExists(join(root, 'src/modules/auth/LoginPage.vue'))).resolves.toBe(true)
  })

  it('refuses to delete source from a directory that is not a generated starter', async () => {
    const root = await mkdtemp(join(tmpdir(), 'super-admin-prune-safety-'))
    tempRoots.push(root)

    await writeText(root, 'package.json', '{"dependencies":{}}\n')
    await writeText(root, 'AGENTS.md', '# Maintainer application\n')
    await writeText(root, 'src/modules/module-registry.ts', "import { examplesRegistration } from './examples/examples.registration'\n")
    await writeText(root, 'src/modules/examples/keep.ts', 'export const keep = true\n')

    await expect(removeGeneratedExamples(root)).rejects.toThrow('Refusing to remove Examples outside a create-super-admin generated project.')
    await expect(pathExists(join(root, 'src/modules/examples/keep.ts'))).resolves.toBe(true)
  })
})
