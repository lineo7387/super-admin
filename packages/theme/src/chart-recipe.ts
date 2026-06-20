import type { DesignProfile, DesignProfileId, DesignProfileMode, ResolvedColorMode } from '@super-admin-org/core'
import { getProfileMode } from '@super-admin-org/core'

export type ChartLineRecipe = {
  areaOpacity: number
  showSymbol: boolean
  smooth: boolean
  width: number
}

export type ChartBarRecipe = {
  borderRadius: number
  columnWidth: string
}

export type ChartAxisRecipe = {
  labelColor: string
  lineColor: string
  splitLineColor: string
  splitLineStyle: 'solid' | 'dashed' | 'dotted'
}

export type ChartTooltipRecipe = {
  backgroundColor: string
  borderColor: string
  shadow: string
  textColor: string
}

export type ChartSurfaceRecipe = {
  backgroundColor: string
  borderColor: string
  textColor: string
}

export type ChartMotionRecipe = {
  duration: number
  easing: string
}

export type ChartRecipe = {
  axis: ChartAxisRecipe
  bar: ChartBarRecipe
  line: ChartLineRecipe
  motion: ChartMotionRecipe
  palette: string[]
  surface: ChartSurfaceRecipe
  tooltip: ChartTooltipRecipe
}

export type ChartRecipeOverride = {
  axis?: Partial<ChartAxisRecipe>
  bar?: Partial<ChartBarRecipe>
  line?: Partial<ChartLineRecipe>
  motion?: Partial<ChartMotionRecipe>
  palette?: string[]
  surface?: Partial<ChartSurfaceRecipe>
  tooltip?: Partial<ChartTooltipRecipe>
}

function parsePixelValue(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseDurationMs(value: string): number {
  const trimmed = value.trim()

  if (trimmed.endsWith('ms')) {
    const parsed = Number.parseFloat(trimmed)
    return Number.isFinite(parsed) ? parsed : 180
  }

  if (trimmed.endsWith('s')) {
    const parsed = Number.parseFloat(trimmed)
    return Number.isFinite(parsed) ? parsed * 1000 : 180
  }

  const parsed = Number.parseFloat(trimmed)
  return Number.isFinite(parsed) ? parsed : 180
}

function createBaseRecipe(variant: DesignProfileMode): ChartRecipe {
  return {
    axis: {
      labelColor: variant.colors.mutedForeground,
      lineColor: variant.colors.borderStrong,
      splitLineColor: variant.colors.border,
      splitLineStyle: 'solid'
    },
    bar: {
      borderRadius: parsePixelValue(variant.shape.radiusSm),
      columnWidth: '48%'
    },
    line: {
      areaOpacity: 0.14,
      showSymbol: false,
      smooth: true,
      width: 2
    },
    motion: {
      duration: parseDurationMs(variant.motion.durationBase),
      easing: variant.motion.easing
    },
    palette: [
      variant.colors.accent,
      variant.colors.primary,
      variant.colors.success,
      variant.colors.warning,
      variant.colors.danger
    ],
    surface: {
      backgroundColor: variant.colors.surface,
      borderColor: variant.colors.border,
      textColor: variant.colors.foreground
    },
    tooltip: {
      backgroundColor: variant.colors.surfaceRaised,
      borderColor: variant.colors.borderStrong,
      shadow: variant.effects.panelShadow,
      textColor: variant.colors.foreground
    }
  }
}

function getProfileRecipeOverride(profileId: DesignProfileId): ChartRecipeOverride {
  if (profileId === 'cyberpunk') {
    return {
      axis: {
        splitLineStyle: 'dashed'
      },
      bar: {
        borderRadius: 0,
        columnWidth: '42%'
      },
      line: {
        areaOpacity: 0.22,
        showSymbol: true,
        smooth: false,
        width: 2.5
      }
    }
  }

  if (profileId === 'industrial') {
    return {
      axis: {
        splitLineStyle: 'solid'
      },
      bar: {
        borderRadius: 1,
        columnWidth: '54%'
      },
      line: {
        areaOpacity: 0.1,
        smooth: false,
        width: 2
      }
    }
  }

  if (profileId === 'newsprint') {
    return {
      axis: {
        splitLineStyle: 'dotted'
      },
      bar: {
        borderRadius: 0,
        columnWidth: '46%'
      },
      line: {
        areaOpacity: 0.08,
        smooth: false,
        width: 1.75
      },
      motion: {
        duration: 90
      }
    }
  }

  if (profileId === 'crypto') {
    return {
      bar: {
        borderRadius: 3,
        columnWidth: '44%'
      },
      line: {
        areaOpacity: 0.2,
        smooth: true,
        width: 2.25
      }
    }
  }

  return {}
}

export function mergeChartRecipe(recipe: ChartRecipe, override: ChartRecipeOverride = {}): ChartRecipe {
  return {
    axis: {
      ...recipe.axis,
      ...(override.axis ?? {})
    },
    bar: {
      ...recipe.bar,
      ...(override.bar ?? {})
    },
    line: {
      ...recipe.line,
      ...(override.line ?? {})
    },
    motion: {
      ...recipe.motion,
      ...(override.motion ?? {})
    },
    palette: override.palette ? [...override.palette] : [...recipe.palette],
    surface: {
      ...recipe.surface,
      ...(override.surface ?? {})
    },
    tooltip: {
      ...recipe.tooltip,
      ...(override.tooltip ?? {})
    }
  }
}

export function getChartRecipe(profile: DesignProfile, mode: ResolvedColorMode, override: ChartRecipeOverride = {}): ChartRecipe {
  const variant = getProfileMode(profile, mode)
  const baseRecipe = createBaseRecipe(variant)
  const profileRecipe = mergeChartRecipe(baseRecipe, getProfileRecipeOverride(profile.id))

  return mergeChartRecipe(profileRecipe, override)
}

