import type { Component } from 'vue'
import { builtInLayoutPresets } from '@super-admin-org/core'
import type { LayoutPreset, LayoutPresetId } from '@super-admin-org/core'
import DualColumnLayout from './layouts/DualColumnLayout.vue'
import NeutralLayout from './layouts/NeutralLayout.vue'
import TopHeaderLayout from './layouts/TopHeaderLayout.vue'
import TriColumnLayout from './layouts/TriColumnLayout.vue'
import type { ExactRequiredComponentContract, VueComponentContractCandidate } from '@/shared/vue-component-contract'

export type LayoutGridPresentation = {
  gridTemplateColumns: string
  gridTemplateRows: string
}

export type LayoutPreviewPresentation = {
  compact: LayoutGridPresentation
  stage: LayoutGridPresentation
  showDock: boolean
  showSidebar: boolean
  showTopNavigation: boolean
}

export type AppLayoutSlots = {
  'header-actions'(): unknown
  workspace(): unknown
}

export type AppLayoutComponentInstance = {
  $props: Readonly<Record<never, never>>
  $slots: Readonly<AppLayoutSlots>
}

export type AppLayoutComponent = Component & (new () => AppLayoutComponentInstance)

export type AppLayoutRegistration = {
  component: AppLayoutComponent
  preset: LayoutPreset
  preview: LayoutPreviewPresentation
}

type AppLayoutRegistrationInput<ComponentType extends VueComponentContractCandidate = VueComponentContractCandidate> = {
  component: ComponentType
  preset: LayoutPreset
  preview: LayoutPreviewPresentation
}

type ExactAppLayoutRegistration<Input extends AppLayoutRegistrationInput> = Input & {
  component: Input['component'] &
    AppLayoutComponent &
    ExactRequiredComponentContract<NoInfer<Input['component']>, AppLayoutComponentInstance['$props'], AppLayoutComponentInstance['$slots']>
}

type ExactAppLayoutRegistrations<Inputs extends readonly AppLayoutRegistrationInput[]> = {
  [Index in keyof Inputs]: ExactAppLayoutRegistration<Inputs[Index]>
}

type AppLayoutRegistry<Inputs extends readonly AppLayoutRegistrationInput[]> = {
  -readonly [Index in keyof Inputs]: AppLayoutRegistration
}

function getBuiltInLayoutPreset(id: LayoutPresetId): LayoutPreset {
  const preset = builtInLayoutPresets.find((candidate) => candidate.id === id)

  if (!preset) {
    throw new Error(`Missing built-in layout preset "${id}"`)
  }

  return preset
}

export function createAppLayoutRegistry<const Inputs extends readonly AppLayoutRegistrationInput[]>(
  registrations: Inputs & ExactAppLayoutRegistrations<NoInfer<Inputs>>
): AppLayoutRegistry<Inputs> {
  const ids = new Set<LayoutPresetId>()

  for (const registration of registrations) {
    if (ids.has(registration.preset.id)) {
      throw new Error(`Duplicate app layout id "${registration.preset.id}"`)
    }

    ids.add(registration.preset.id)
  }

  return [...registrations] as unknown as AppLayoutRegistry<Inputs>
}

export const appLayoutRegistry = createAppLayoutRegistry([
  {
    component: TriColumnLayout,
    preset: getBuiltInLayoutPreset('tri-column'),
    preview: {
      compact: {
        gridTemplateColumns: '0.5fr 1.4fr 3fr',
        gridTemplateRows: 'minmax(0, 1fr)'
      },
      stage: {
        gridTemplateColumns: '4rem 16rem minmax(0, 1fr)',
        gridTemplateRows: 'minmax(0, 1fr)'
      },
      showDock: true,
      showSidebar: true,
      showTopNavigation: false
    }
  },
  {
    component: DualColumnLayout,
    preset: getBuiltInLayoutPreset('dual-column'),
    preview: {
      compact: {
        gridTemplateColumns: '1.4fr 3fr',
        gridTemplateRows: 'minmax(0, 1fr)'
      },
      stage: {
        gridTemplateColumns: '17rem minmax(0, 1fr)',
        gridTemplateRows: 'minmax(0, 1fr)'
      },
      showDock: false,
      showSidebar: true,
      showTopNavigation: false
    }
  },
  {
    component: TopHeaderLayout,
    preset: getBuiltInLayoutPreset('top-header'),
    preview: {
      compact: {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateRows: '0.7fr 3fr'
      },
      stage: {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridTemplateRows: '3.1rem minmax(0, 1fr)'
      },
      showDock: false,
      showSidebar: false,
      showTopNavigation: true
    }
  }
])

export const neutralLayoutRegistration = createAppLayoutRegistry([
  {
    component: NeutralLayout,
    preset: {
      id: 'neutral',
      name: 'Neutral',
      description: 'A dependency-free workspace shell used when no registered layout matches.',
      regions: ['summary', 'tools', 'primary', 'context', 'activity']
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
])[0]

export function resolveAppLayoutRegistration(layoutId: LayoutPresetId, registry: readonly AppLayoutRegistration[] = appLayoutRegistry): AppLayoutRegistration {
  return registry.find((registration) => registration.preset.id === layoutId) ?? neutralLayoutRegistration
}
