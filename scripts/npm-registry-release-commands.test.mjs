import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'vitest'

function runCommandPrinter(...args) {
  return execFileSync(process.execPath, ['scripts/npm-registry-release-commands.mjs', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8'
  })
}

function readPackageVersion(packageJsonPath) {
  return JSON.parse(readFileSync(packageJsonPath, 'utf8')).version
}

describe('npm registry release command printer', () => {
  test('prints publish-next package directories as explicit local paths', () => {
    const output = runCommandPrinter('publish-next', '--changed', '@super-admin-org/core')

    expect(output).toContain('npm publish ./packages/core --tag next')
    expect(output).toContain('npm publish ./packages/theme --tag next')
    expect(output).not.toContain('npm publish packages/')
  })

  test('prints bootstrap tarballs as explicit local paths', () => {
    const output = runCommandPrinter('bootstrap')

    expect(output).toContain('npm publish ./output/npm-bootstrap/tarballs/super-admin-org-core-0.0.0-bootstrap.0.tgz')
    expect(output).not.toContain('npm publish output/')
  })

  test('prints only CLI publish-next commands for CLI-only releases', () => {
    const output = runCommandPrinter('publish-next', '--changed', 'create-super-admin')

    expect(output).toContain('npm publish ./packages/cli --tag next --provenance')
    expect(output).not.toContain('npm publish ./packages/core')
    expect(output).not.toContain('npm publish ./packages/theme')
    expect(output).not.toContain('npm publish ./packages/ui')
  })

  test('prints only CLI promote-latest commands for CLI-only releases', () => {
    const output = runCommandPrinter('promote-latest', '--changed', 'create-super-admin')
    const cliVersion = readPackageVersion('packages/cli/package.json')

    expect(output).toContain(`npm dist-tag add create-super-admin@${cliVersion} latest`)
    expect(output).not.toContain('npm dist-tag add @super-admin-org/core')
    expect(output).not.toContain('npm dist-tag add @super-admin-org/theme')
    expect(output).not.toContain('npm dist-tag add @super-admin-org/ui')
  })

  test('prints core and internal dependents for core releases', () => {
    const output = runCommandPrinter('publish-next', '--changed', '@super-admin-org/core')

    expect(output).toContain('npm publish ./packages/core --tag next')
    expect(output).toContain('npm publish ./packages/theme --tag next')
    expect(output).toContain('npm publish ./packages/theme-base --tag next')
    expect(output).toContain('npm publish ./packages/theme-crypto --tag next')
    expect(output).toContain('npm publish ./packages/theme-cyberpunk --tag next')
    expect(output).toContain('npm publish ./packages/theme-industrial --tag next')
    expect(output).toContain('npm publish ./packages/theme-newsprint --tag next')
    expect(output).not.toContain('npm publish ./packages/ui')
    expect(output).not.toContain('npm publish ./packages/cli')
  })
})
