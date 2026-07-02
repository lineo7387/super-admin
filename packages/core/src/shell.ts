import type { Density } from './design-profile'

export type LayoutPresetId = 'tri-column' | 'dual-column' | 'top-header' | (string & {})

export type ShellRegion = 'summary' | 'tools' | 'primary' | 'context' | 'activity'

export type KeepAlivePolicy = { enabled: true; cacheKey?: string; maxAgeMs?: number } | { enabled: false; reason?: string }

export type PageShellMeta = {
  title: string
  description?: string
  preferredLayout?: LayoutPresetId
  regions?: ShellRegion[]
  keepAlive: KeepAlivePolicy
  density?: Density
}

export type LayoutPreset = {
  id: LayoutPresetId
  name: string
  description: string
  regions: ShellRegion[]
}

export const builtInLayoutPresets: LayoutPreset[] = [
  {
    id: 'tri-column',
    name: 'Tri-column',
    description: 'Dock, module navigation, workspace, and persistent context panel.',
    regions: ['summary', 'tools', 'primary', 'context', 'activity']
  },
  {
    id: 'dual-column',
    name: 'Dual-column',
    description: 'Sidebar and workspace with adaptive context surfaces.',
    regions: ['summary', 'tools', 'primary', 'context']
  },
  {
    id: 'top-header',
    name: 'Top header',
    description: 'Header navigation and workspace with contextual panels below or in sheets.',
    regions: ['summary', 'tools', 'primary', 'activity']
  }
]

export function resolveLayoutPreset(userPreference: LayoutPresetId, pagePreference?: LayoutPresetId): LayoutPresetId {
  return pagePreference ?? userPreference
}
