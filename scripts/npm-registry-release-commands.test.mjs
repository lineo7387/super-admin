import { execFileSync } from 'node:child_process'
import { describe, expect, test } from 'vitest'

function runCommandPrinter(mode) {
  return execFileSync(process.execPath, ['scripts/npm-registry-release-commands.mjs', mode], {
    cwd: process.cwd(),
    encoding: 'utf8'
  })
}

describe('npm registry release command printer', () => {
  test('prints publish-next package directories as explicit local paths', () => {
    const output = runCommandPrinter('publish-next')

    expect(output).toContain('npm publish ./packages/core --tag next')
    expect(output).toContain('npm publish ./packages/theme --tag next')
    expect(output).toContain('npm publish ./packages/cli --tag next')
    expect(output).not.toContain('npm publish packages/')
  })

  test('prints bootstrap tarballs as explicit local paths', () => {
    const output = runCommandPrinter('bootstrap')

    expect(output).toContain('npm publish ./output/npm-bootstrap/tarballs/super-admin-org-core-0.0.0-bootstrap.0.tgz')
    expect(output).not.toContain('npm publish output/')
  })
})
