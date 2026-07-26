import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createPublicDemoBuildEnv } from './build-docs-site.mjs'

const adminSmoke = await import('./admin-browser-smoke.mjs').catch(() => ({}))

describe('mock-backed admin browser smoke helpers', () => {
  it('creates an isolated mock-backed admin target', () => {
    expect(adminSmoke.createAdminSmokeConfig).toBeTypeOf('function')
    if (typeof adminSmoke.createAdminSmokeConfig !== 'function') {
      return
    }

    expect(adminSmoke.createAdminSmokeConfig({ adminPort: 19002, headed: true })).toEqual({
      adminPort: 19002,
      adminUrl: 'http://127.0.0.1:19002',
      headed: true
    })
  })

  it('supports a reviewable public screenshot output without changing CI defaults', () => {
    expect(
      adminSmoke.createAdminSmokeConfig({
        adminPort: 19002,
        screenshotPath: '/tmp/super-admin-shell.png'
      })
    ).toEqual({
      adminPort: 19002,
      adminUrl: 'http://127.0.0.1:19002',
      headed: false,
      screenshotPath: '/tmp/super-admin-shell.png'
    })
  })

  it('removes optional reference-backend settings from the admin environment', () => {
    expect(adminSmoke.buildMockAdminEnv).toBeTypeOf('function')
    if (typeof adminSmoke.buildMockAdminEnv !== 'function') {
      return
    }

    expect(
      adminSmoke.buildMockAdminEnv({
        KEEP_ME: 'yes',
        VITE_SUPER_ADMIN_API_BASE_URL: 'http://127.0.0.1:8787',
        VITE_SUPER_ADMIN_REFERENCE_TOKEN: 'secret',
        VITE_SUPER_ADMIN_USERS_API: 'reference'
      })
    ).toEqual({
      KEEP_ME: 'yes',
      VITE_SUPER_ADMIN_USERS_API: 'mock'
    })
  })

  it('summarizes the protected-route, preferences, navigation and logout contract', () => {
    expect(adminSmoke.getAdminSmokeResult).toBeTypeOf('function')
    if (typeof adminSmoke.getAdminSmokeResult !== 'function') {
      return
    }

    expect(
      adminSmoke.getAdminSmokeResult({
        finalUrl: 'http://127.0.0.1:19002/auth/login?redirect=/examples/users/all',
        layoutPreset: 'top-header',
        locale: 'en-US',
        mode: 'dark',
        pageErrors: [],
        profile: 'cyberpunk',
        protectedRouteRedirected: true,
        usersRendered: true
      })
    ).toEqual({
      layoutSwitched: true,
      localeSwitched: true,
      logoutReturnedToLogin: true,
      mockUsersRendered: true,
      noPageErrors: true,
      profileSwitched: true,
      protectedRouteRedirected: true
    })
  })

  it('wires the Chromium smoke and failure artifacts into the root CI gate', async () => {
    const packageJson = JSON.parse(await readFile(resolve('package.json'), 'utf8'))
    const workflow = await readFile(resolve('.github/workflows/ci.yml'), 'utf8')

    expect(packageJson.scripts['test:browser']).toBe('node scripts/admin-browser-smoke.mjs')
    expect(workflow).toContain('pnpm exec playwright install --with-deps chromium')
    expect(workflow).toContain('pnpm test:browser')
    expect(workflow).toContain('output/playwright/admin-smoke')
  })

  it('builds the canonical admin into the GitHub Pages demo subpath', async () => {
    const packageJson = JSON.parse(await readFile(resolve('package.json'), 'utf8'))
    const workflow = await readFile(resolve('.github/workflows/docs-pages.yml'), 'utf8')
    const viteConfig = await readFile(resolve('apps/admin/vite.config.ts'), 'utf8')
    const router = await readFile(resolve('apps/admin/src/router/index.ts'), 'utf8')

    expect(packageJson.scripts['docs:build']).toBe('node scripts/build-docs-site.mjs')
    expect(workflow).toContain('apps/admin/**')
    expect(workflow).toContain('packages/**')
    expect(viteConfig).toContain("process.env.SUPER_ADMIN_PUBLIC_BASE ?? '/'")
    expect(viteConfig).toContain('process.env.SUPER_ADMIN_PUBLIC_OUT_DIR')
    expect(createPublicDemoBuildEnv({ KEEP_ME: 'yes' })).toEqual({
      KEEP_ME: 'yes',
      SUPER_ADMIN_PUBLIC_BASE: '/super-admin/demo/',
      SUPER_ADMIN_PUBLIC_OUT_DIR: '../../docs/.vitepress/dist/demo',
      VITE_SUPER_ADMIN_ROUTER_MODE: 'hash'
    })
    expect(router).toContain('createWebHashHistory')
    expect(router).toContain("import.meta.env.VITE_SUPER_ADMIN_ROUTER_MODE === 'hash'")
  })

  it('keeps the bilingual manual Examples-removal recipe aligned with generated AI context', async () => {
    const zhGuide = await readFile(resolve('docs/guide/examples.md'), 'utf8')
    const enGuide = await readFile(resolve('docs/en/guide/examples.md'), 'utf8')

    expect(zhGuide).toContain('ai-context/extension-points.md')
    expect(enGuide).toContain('ai-context/extension-points.md')
  })
})
