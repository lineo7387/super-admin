import type { Density, DesignProfile, ResolvedColorMode } from '@super-admin-org/core'
import { getProfileMode } from '@super-admin-org/core'

export type ThemeRoot = Pick<HTMLElement, 'dataset' | 'style'>

export function applyDesignProfile(
  root: ThemeRoot,
  profile: DesignProfile,
  mode: ResolvedColorMode,
  density: Density
): void {
  const variant = getProfileMode(profile, mode)

  root.dataset.profile = profile.id
  root.dataset.mode = mode
  root.dataset.density = density

  const tokens: Record<string, string> = {
    '--background': variant.colors.background,
    '--foreground': variant.colors.foreground,
    '--muted': variant.colors.muted,
    '--muted-foreground': variant.colors.mutedForeground,
    '--surface': variant.colors.surface,
    '--surface-raised': variant.colors.surfaceRaised,
    '--surface-sunken': variant.colors.surfaceSunken,
    '--border': variant.colors.border,
    '--border-strong': variant.colors.borderStrong,
    '--primary': variant.colors.primary,
    '--primary-foreground': variant.colors.primaryForeground,
    '--accent': variant.colors.accent,
    '--accent-foreground': variant.colors.accentForeground,
    '--success': variant.colors.success,
    '--warning': variant.colors.warning,
    '--danger': variant.colors.danger,
    '--app-background': variant.shell.appBackground,
    '--header-background': variant.shell.headerBackground,
    '--nav-background': variant.shell.navBackground,
    '--context-background': variant.shell.contextBackground,
    '--tab-background': variant.shell.tabBackground,
    '--active-tab-background': variant.shell.activeTabBackground,
    '--radius-xs': variant.shape.radiusXs,
    '--radius-sm': variant.shape.radiusSm,
    '--radius-md': variant.shape.radiusMd,
    '--radius-lg': variant.shape.radiusLg,
    '--card-shadow': variant.effects.cardShadow,
    '--panel-shadow': variant.effects.panelShadow,
    '--focus-ring': variant.effects.focusRing,
    '--glow': variant.effects.glow,
    '--texture': variant.effects.texture,
    '--font-sans': variant.typography.sans,
    '--font-display': variant.typography.display,
    '--font-mono': variant.typography.mono,
    '--letter-spacing': variant.typography.letterSpacing,
    '--duration-fast': variant.motion.durationFast,
    '--duration-base': variant.motion.durationBase,
    '--easing': variant.motion.easing
  }

  for (const [name, value] of Object.entries(tokens)) {
    root.style.setProperty(name, value)
  }
}
