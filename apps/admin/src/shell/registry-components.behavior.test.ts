// @vitest-environment happy-dom

import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdminI18n } from '@/i18n'
import { useAuthSessionStore } from '@/stores/auth-session.store'
import AuthLayout from '@/modules/auth/components/AuthLayout.vue'
import LayoutPresetPreview from './preferences/LayoutPresetPreview.vue'
import StageWindowPreview from '@/workspace/StageWindowPreview.vue'
import { appLayoutRegistry, neutralLayoutRegistration, resolveAppLayoutRegistration } from './layout-registry'

const authPreferences = vi.hoisted(() => ({
  aiAvailability: { reason: 'provider-not-configured', status: 'unavailable' },
  colorMode: 'dark',
  controlCenterOpen: false,
  locale: 'en-US',
  layoutPreset: 'tri-column',
  openControlCenter: vi.fn(),
  openStageOverview: vi.fn(),
  profileId: 'custom-profile',
  providerMode: 'mock',
  setColorMode: vi.fn(),
  setLayoutPreset: vi.fn(),
  setLocale: vi.fn(),
  setProfile: vi.fn(),
  setStageRailEnabled: vi.fn(),
  setTabsEnabled: vi.fn(),
  stageManager: { railEnabled: true },
  stageManagerDesktopAvailable: false,
  workspaceTabs: { enabled: true }
}))

vi.mock('@/stores/preferences.store', () => ({
  usePreferencesStore: () => authPreferences
}))

const SlotPassthrough = defineComponent({
  template: '<div><slot /></div>'
})

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/workspace', component: SlotPassthrough },
      { path: '/auth/login', component: SlotPassthrough }
    ]
  })
}

describe('registered layout component behavior', () => {
  beforeEach(() => {
    window.localStorage.clear()
    authPreferences.openControlCenter.mockClear()
  })

  it('mounts the neutral fallback with module navigation, shared slots, and working sign out', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createTestRouter()
    await router.push('/workspace')
    await router.isReady()

    const session = useAuthSessionStore()
    session.setSession({
      permissions: [],
      token: 'test-token',
      tokenType: 'Bearer',
      user: {
        email: 'operator@example.com',
        id: 'operator-1',
        name: 'Template Operator',
        role: 'Operator'
      }
    })

    const registration = resolveAppLayoutRegistration('custom-layout')
    const wrapper = mount(registration.component, {
      attachTo: document.body,
      global: {
        plugins: [pinia, createAdminI18n('en-US'), router],
        stubs: {
          WorkspaceHeader: true,
          WorkspaceTabs: true
        }
      },
      slots: {
        'header-actions': '<button data-testid="header-action">Control Center</button>',
        workspace: '<article data-testid="workspace-content">Workspace content</article>'
      }
    })

    expect(registration).toBe(neutralLayoutRegistration)
    expect(wrapper.get('[data-layout-fallback="neutral"]')).toBeTruthy()
    expect(wrapper.get('[data-neutral-module-navigation]')).toBeTruthy()
    expect(wrapper.get('[data-neutral-module-navigation] nav').element.closest('.super-scroll')).toBeNull()
    expect(wrapper.get('[data-testid="workspace-content"]').element.closest('.super-scroll')).not.toBeNull()
    expect(wrapper.get('[data-testid="header-action"]').text()).toBe('Control Center')
    expect(wrapper.get('[data-testid="workspace-content"]').text()).toBe('Workspace content')

    const examplesTrigger = wrapper.findAll('[data-neutral-module-navigation] nav > div > button').find((button) => button.text().includes('Examples'))
    expect(examplesTrigger).toBeTruthy()
    const examplesTriggerElement = examplesTrigger!.element as HTMLElement
    vi.spyOn(examplesTriggerElement, 'getBoundingClientRect').mockReturnValue({
      bottom: 96,
      height: 40,
      left: 0,
      right: 112,
      top: 56,
      width: 112,
      x: 0,
      y: 56,
      toJSON: () => ({})
    })
    await examplesTrigger?.trigger('keydown', { key: 'ArrowDown' })

    const dropdown = document.body.querySelector<HTMLElement>('[data-primary-nav-dropdown]')
    expect(dropdown).not.toBeNull()
    expect(examplesTrigger!.attributes('aria-controls')).toBe(dropdown!.id)
    expect(examplesTrigger!.attributes('aria-expanded')).toBe('true')
    expect(dropdown!.classList.contains('fixed')).toBe(true)
    expect(dropdown!.style.left).toBe('8px')
    expect(dropdown!.style.top).toBe('102px')
    expect(dropdown!.closest('.super-scroll')).toBeNull()
    expect(dropdown!.querySelectorAll('[role="menuitem"]').length).toBeGreaterThan(0)
    expect(dropdown!.contains(document.activeElement)).toBe(true)

    const usersTrigger = Array.from(dropdown!.querySelectorAll('button')).find((button) => button.textContent?.includes('Users'))
    expect(usersTrigger).toBeTruthy()
    usersTrigger?.click()
    await flushPromises()

    expect(dropdown!.querySelector('a[href="/examples/users/pending-review"]')?.textContent).toContain('Pending Review')
    expect(dropdown!.querySelector('a[href="/examples/users/invites"]')?.textContent).toContain('Invites')
    expect(dropdown!.querySelector('a[href="/examples/users/activity"]')?.textContent).toContain('Activity')

    const headerAction = wrapper.get<HTMLElement>('[data-testid="header-action"]')
    headerAction.element.focus()
    await flushPromises()

    expect(document.body.querySelector('[data-primary-nav-dropdown]')).toBeNull()
    expect(examplesTrigger!.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(headerAction.element)

    examplesTriggerElement.focus()
    await examplesTrigger?.trigger('keydown', { key: 'ArrowDown' })
    document.body.querySelector<HTMLElement>('[data-primary-nav-dropdown]')?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await flushPromises()

    expect(document.body.querySelector('[data-primary-nav-dropdown]')).toBeNull()
    expect(document.activeElement).toBe(examplesTriggerElement)

    await wrapper.get('[aria-haspopup="menu"]').trigger('click')
    await wrapper.get('.account-menu-item--danger').trigger('click')
    await flushPromises()

    expect(session.isAuthenticated).toBe(false)
    expect(router.currentRoute.value).toMatchObject({
      path: '/auth/login',
      query: { redirect: '/workspace' }
    })

    wrapper.unmount()
  })

  it('renders compact and stage geometry from the same layout registration', () => {
    const registration = appLayoutRegistry[0]!
    const compact = mount(LayoutPresetPreview, {
      props: { presentation: registration.preview }
    })
    const stage = mount(StageWindowPreview, {
      props: {
        preview: {
          description: 'Dashboard preview',
          layoutPreset: registration.preset.id,
          moduleName: 'Examples',
          regions: ['primary'],
          routePath: '/examples/dashboard',
          tabs: [],
          title: 'Dashboard'
        },
        previewUnavailableLabel: 'Preview unavailable'
      }
    })

    const compactSurface = compact.get<HTMLElement>('[data-layout-preview-surface="compact"]')
    const stageSurface = stage.get<HTMLElement>('[data-layout-preview-surface="stage"]')

    expect(compactSurface.element.style.gridTemplateColumns).toBe(registration.preview.compact.gridTemplateColumns)
    expect(compactSurface.element.style.gridTemplateRows).toBe(registration.preview.compact.gridTemplateRows)
    expect(stageSurface.element.style.gridTemplateColumns).toBe(registration.preview.stage.gridTemplateColumns)
    expect(stageSurface.element.style.gridTemplateRows).toBe(registration.preview.stage.gridTemplateRows)
    expect(stage.find('.stage-window-preview__dock').exists()).toBe(true)
    expect(stage.find('.stage-window-preview__sidebar').exists()).toBe(true)
  })
})

describe('registered auth recipe component behavior', () => {
  it('mounts AuthLayout with an unknown profile and preserves its neutral recipe contract', async () => {
    const wrapper = mount(AuthLayout, {
      global: {
        plugins: [createPinia(), createAdminI18n('en-US')]
      },
      props: {
        description: 'Provider-independent access.',
        eyebrow: 'Custom workspace',
        title: 'Sign in safely'
      },
      slots: {
        default: '<form data-testid="auth-form">Shared login form</form>'
      }
    })

    expect(wrapper.get('[data-auth-profile]').attributes('data-auth-profile')).toBe('neutral')
    expect(wrapper.get('[data-auth-recipe="neutral"]')).toBeTruthy()
    expect(wrapper.text()).toContain('Custom workspace')
    expect(wrapper.text()).toContain('Sign in safely')
    expect(wrapper.text()).toContain('Provider-independent access.')
    expect(wrapper.get('[data-testid="auth-form"]').text()).toBe('Shared login form')

    const controlCenterTrigger = wrapper.get('.global-preferences-trigger')
    expect(controlCenterTrigger.attributes('aria-label')).toBe('Open Control Center: custom-profile / Dark')
    await controlCenterTrigger.trigger('click')
    expect(authPreferences.openControlCenter).toHaveBeenCalledOnce()
  })
})
