/* eslint-disable vue/one-component-per-file -- Test-only components exercise negative registry type contracts. */

import { defineComponent, h, type SlotsType } from 'vue'
import { describe, expect, expectTypeOf, it } from 'vitest'
import BaseAuthRecipe from '@/modules/auth/components/recipes/BaseAuthRecipe.vue'
import NeutralAuthRecipe from '@/modules/auth/components/recipes/NeutralAuthRecipe.vue'
import {
  createAuthRecipeRegistry,
  type AuthRecipeComponent,
  type AuthRecipeComponentInstance,
  type AuthRecipeSlots
} from '@/modules/auth/components/auth-recipe-registry'
import DualColumnLayout from './layouts/DualColumnLayout.vue'
import NeutralLayout from './layouts/NeutralLayout.vue'
import TopHeaderLayout from './layouts/TopHeaderLayout.vue'
import TriColumnLayout from './layouts/TriColumnLayout.vue'
import { createAppLayoutRegistry, type AppLayoutComponent, type AppLayoutComponentInstance, type AppLayoutSlots } from './layout-registry'

type MissingWorkspaceSlotInstance = Omit<AppLayoutComponentInstance, '$slots'> & {
  $slots: Pick<AppLayoutSlots, 'header-actions'>
}

type WrongAuthPropsInstance = Omit<AuthRecipeComponentInstance, '$props'> & {
  $props: {
    description: string
    eyebrow: number
    title: string
  }
}

type MissingAuthDefaultSlotInstance = Omit<AuthRecipeComponentInstance, '$slots'> & {
  $slots: Record<never, never>
}

const layoutRequiringTenantId = defineComponent({
  name: 'LayoutRequiringTenantId',
  props: {
    tenantId: {
      type: String,
      required: true
    }
  },
  slots: Object as SlotsType<AppLayoutSlots>,
  setup() {
    return () => h('div')
  }
})

const authRecipeRequiringTenantIdAndSlot = defineComponent({
  name: 'AuthRecipeRequiringTenantIdAndSlot',
  props: {
    description: {
      type: String,
      required: true
    },
    eyebrow: {
      type: String,
      required: true
    },
    tenantId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  slots: Object as SlotsType<
    AuthRecipeSlots & {
      tenant(): unknown
    }
  >,
  setup() {
    return () => h('div')
  }
})

describe('registry component contracts', () => {
  it('accepts every layout recipe with the shared named-slot contract', () => {
    expectTypeOf(TriColumnLayout).toMatchTypeOf<AppLayoutComponent>()
    expectTypeOf(DualColumnLayout).toMatchTypeOf<AppLayoutComponent>()
    expectTypeOf(TopHeaderLayout).toMatchTypeOf<AppLayoutComponent>()
    expectTypeOf(NeutralLayout).toMatchTypeOf<AppLayoutComponent>()
    expectTypeOf<MissingWorkspaceSlotInstance>().not.toMatchTypeOf<AppLayoutComponentInstance>()

    expect(true).toBe(true)
  })

  it('accepts auth recipes with shared props and default-slot contracts', () => {
    expectTypeOf(BaseAuthRecipe).toMatchTypeOf<AuthRecipeComponent>()
    expectTypeOf(NeutralAuthRecipe).toMatchTypeOf<AuthRecipeComponent>()
    expectTypeOf<WrongAuthPropsInstance>().not.toMatchTypeOf<AuthRecipeComponentInstance>()
    expectTypeOf<MissingAuthDefaultSlotInstance>().not.toMatchTypeOf<AuthRecipeComponentInstance>()

    expectTypeOf<AuthRecipeSlots['default']>().toBeFunction()
    expect(true).toBe(true)
  })

  it('rejects layouts that require props the shell orchestrator never provides', () => {
    const invalidRegistration = {
      component: layoutRequiringTenantId,
      preset: {
        id: 'tenant-layout',
        name: 'Tenant layout',
        description: 'Requires an unsupported tenant input.',
        regions: ['primary' as const]
      },
      preview: {
        compact: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'minmax(0, 1fr)'
        },
        stage: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          gridTemplateRows: 'minmax(0, 1fr)'
        },
        showDock: false,
        showSidebar: false,
        showTopNavigation: false
      }
    }

    // @ts-expect-error The shell never provides the required tenantId prop.
    createAppLayoutRegistry([invalidRegistration])
    expect(true).toBe(true)
  })

  it('rejects auth recipes that require unsupported props or named slots', () => {
    const invalidRegistration = {
      component: authRecipeRequiringTenantIdAndSlot,
      profileId: 'tenant-auth'
    }

    // @ts-expect-error AuthLayout provides neither tenantId nor the required tenant slot.
    createAuthRecipeRegistry([invalidRegistration])
    expect(true).toBe(true)
  })
})
