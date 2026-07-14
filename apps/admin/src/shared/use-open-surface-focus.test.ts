// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, useTemplateRef } from 'vue'
import { describe, expect, it } from 'vitest'
import { useOpenSurfaceFocus } from './use-open-surface-focus'

const surfaceOpen = ref(false)
const FocusHost = defineComponent({
  setup() {
    const surface = useTemplateRef<HTMLElement>('surface')
    useOpenSurfaceFocus(() => surfaceOpen.value, surface)
    return { surfaceOpen }
  },
  template: `
    <div>
      <button data-testid="background-trigger">Background trigger</button>
      <Teleport to="body">
        <section v-if="surfaceOpen" ref="surface" role="dialog" tabindex="-1">Focused surface</section>
      </Teleport>
    </div>
  `
})

describe('useOpenSurfaceFocus', () => {
  it('moves focus into a newly opened teleported surface', async () => {
    surfaceOpen.value = false
    const wrapper = mount(FocusHost, { attachTo: document.body })
    wrapper.get<HTMLElement>('[data-testid="background-trigger"]').element.focus()

    surfaceOpen.value = true
    await nextTick()
    await nextTick()

    expect(document.activeElement).toBe(document.body.querySelector('[role="dialog"]'))

    wrapper.unmount()
  })

  it('focuses an async surface that mounts after its open state is already true', async () => {
    surfaceOpen.value = true
    const wrapper = mount(FocusHost, { attachTo: document.body })
    await nextTick()
    await nextTick()

    expect(document.activeElement).toBe(document.body.querySelector('[role="dialog"]'))

    wrapper.unmount()
  })
})
