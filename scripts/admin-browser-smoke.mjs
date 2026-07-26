#!/usr/bin/env node
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { assertSmoke, getFreePort, loadPlaywright, saveJsonArtifact, startProcess, stopProcess, waitForHttp, workspaceBin } from './browser-smoke-runtime.mjs'

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ARTIFACT_DIR = resolve(ROOT_DIR, 'output/playwright/admin-smoke')

export function createAdminSmokeConfig({ adminPort = 5173, headed = false, screenshotPath } = {}) {
  return {
    adminPort,
    adminUrl: `http://127.0.0.1:${adminPort}`,
    headed,
    ...(screenshotPath ? { screenshotPath } : {})
  }
}

async function createRuntimeConfig(env = process.env) {
  const adminPort = env.ADMIN_SMOKE_PORT ? Number.parseInt(env.ADMIN_SMOKE_PORT, 10) : await getFreePort()

  return createAdminSmokeConfig({
    adminPort,
    headed: env.ADMIN_SMOKE_HEADED === '1',
    screenshotPath: env.ADMIN_SMOKE_SCREENSHOT_PATH ? resolve(ROOT_DIR, env.ADMIN_SMOKE_SCREENSHOT_PATH) : undefined
  })
}

async function readPreferences(page) {
  return page.evaluate(() => {
    const value = window.localStorage.getItem('super-admin:preferences')
    return value ? JSON.parse(value) : {}
  })
}

async function runBrowserFlow(config) {
  const { chromium } = await loadPlaywright('the mock-backed admin smoke')
  let browser

  try {
    browser = await chromium.launch({ headless: !config.headed })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Unable to launch Chromium. Run "pnpm exec playwright install chromium" and retry. ${message}`, { cause: error })
  }

  const consoleMessages = []
  const pageErrors = []
  let page

  try {
    const context = await browser.newContext({
      locale: 'zh-CN',
      reducedMotion: 'reduce',
      viewport: {
        height: 960,
        width: 1440
      }
    })
    page = await context.newPage()
    page.on('console', (message) => {
      const entry = {
        text: message.text(),
        type: message.type()
      }
      consoleMessages.push(entry)
      if (message.type() === 'error') {
        pageErrors.push(entry)
      }
    })
    page.on('pageerror', (error) => {
      const entry = {
        text: error.message,
        type: 'pageerror'
      }
      consoleMessages.push(entry)
      pageErrors.push(entry)
    })

    await page.goto(`${config.adminUrl}/examples/users/all`, { waitUntil: 'domcontentloaded' })
    await page.waitForURL('**/auth/login**')
    const protectedRouteRedirected = page.url().includes('redirect=/examples/users/all')

    await page.getByRole('button', { name: /^(登录|Sign in)$/ }).click()
    await page.waitForURL('**/examples/users/all')
    await page.getByRole('main').getByText('Mira Chen').waitFor({ state: 'visible' })

    await page.getByRole('button', { name: '控制中心' }).click()
    const controlCenter = page.getByRole('dialog', { name: /工作区配置/ })
    await controlCenter.waitFor({ state: 'visible' })
    await controlCenter.getByRole('button', { name: /Cyberpunk/ }).click()
    await controlCenter.getByRole('button', { name: /^深色/ }).click()
    await controlCenter.getByRole('button', { name: /Top header/ }).click()
    await controlCenter.getByRole('button', { name: /^English/ }).click()
    await page.keyboard.press('Escape')
    await controlCenter.waitFor({ state: 'hidden' })

    await page.keyboard.press('Control+K')
    const commandPalette = page.getByRole('dialog', { name: 'Command Palette' })
    await commandPalette.getByRole('textbox').fill('UI Kit / Foundations')
    await commandPalette.getByRole('option', { name: /UI Kit \/ Foundations/ }).click()
    await page.waitForURL('**/ui-kit/foundations')

    await page.keyboard.press('Control+K')
    const returnPalette = page.getByRole('dialog', { name: 'Command Palette' })
    await returnPalette.getByRole('textbox').fill('All Users')
    await returnPalette.getByRole('option').filter({ hasText: '/examples/users/all' }).click()
    await page.waitForURL('**/examples/users/all')
    await page.getByRole('main').getByText('Mira Chen').waitFor({ state: 'visible' })
    const screenshotPath = config.screenshotPath ?? resolve(ARTIFACT_DIR, 'admin-smoke-success.png')
    await mkdir(dirname(screenshotPath), { recursive: true })
    await page.screenshot({
      fullPage: true,
      path: screenshotPath
    })

    const preferences = await readPreferences(page)
    const profile = await page.locator('html').getAttribute('data-profile')
    const mode = await page.locator('html').getAttribute('data-mode')

    await page.getByRole('button', { name: 'MC' }).click()
    await page.getByRole('menuitem', { name: /^(退出登录|Sign out)$/ }).click()
    await page.waitForURL('**/auth/login**')

    const result = getAdminSmokeResult({
      finalUrl: page.url(),
      layoutPreset: preferences.layoutPreset,
      locale: preferences.locale,
      mode,
      pageErrors,
      profile,
      protectedRouteRedirected,
      usersRendered: true
    })

    for (const [contract, passed] of Object.entries(result)) {
      assertSmoke(passed, `Mock-backed admin browser contract failed: ${contract}.`)
    }

    await saveJsonArtifact(ARTIFACT_DIR, 'admin-smoke-result.json', {
      ...result,
      adminUrl: config.adminUrl,
      consoleMessages
    })

    return result
  } catch (error) {
    await saveJsonArtifact(ARTIFACT_DIR, 'admin-smoke-failure.json', {
      consoleMessages,
      currentUrl: page?.url(),
      error: error instanceof Error ? error.message : String(error),
      pageErrors
    })
    if (page) {
      await page.screenshot({
        fullPage: true,
        path: resolve(ARTIFACT_DIR, 'admin-smoke-failure.png')
      })
    }
    throw error
  } finally {
    await browser.close()
  }
}

export async function runAdminSmoke(env = process.env) {
  const config = await createRuntimeConfig(env)
  const adminProcess = startProcess({
    args: ['--host', '127.0.0.1', '--port', String(config.adminPort), '--strictPort'],
    command: workspaceBin(ROOT_DIR, 'apps/admin', 'vite'),
    cwd: resolve(ROOT_DIR, 'apps/admin'),
    env: buildMockAdminEnv(env),
    label: 'admin'
  })

  try {
    await waitForHttp(config.adminUrl, { label: 'mock-backed admin app' })
    return await runBrowserFlow(config)
  } finally {
    await saveJsonArtifact(ARTIFACT_DIR, 'admin-smoke-service-logs.json', {
      admin: adminProcess.logs
    })
    await stopProcess(adminProcess)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runAdminSmoke()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2))
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    })
}

export function buildMockAdminEnv(env = process.env) {
  const adminEnv = {
    ...env,
    VITE_SUPER_ADMIN_USERS_API: 'mock'
  }

  delete adminEnv.VITE_SUPER_ADMIN_API_BASE_URL
  delete adminEnv.VITE_SUPER_ADMIN_REFERENCE_TOKEN

  return adminEnv
}

export function getAdminSmokeResult({ finalUrl, layoutPreset, locale, mode, pageErrors, profile, protectedRouteRedirected, usersRendered }) {
  return {
    layoutSwitched: layoutPreset === 'top-header',
    localeSwitched: locale === 'en-US',
    logoutReturnedToLogin: finalUrl.includes('/auth/login') && finalUrl.includes('redirect=/examples/users/all'),
    mockUsersRendered: usersRendered,
    noPageErrors: pageErrors.length === 0,
    profileSwitched: profile === 'cyberpunk' && mode === 'dark',
    protectedRouteRedirected
  }
}
