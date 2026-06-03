export type DesignProfileId = 'crypto' | 'industrial' | 'cyberpunk' | 'newsprint' | (string & {})

export type ColorMode = 'light' | 'dark' | 'system'

export type ResolvedColorMode = 'light' | 'dark'

export type Density = 'comfortable' | 'compact'

export type DesignProfileVariantId = `${string}.${ResolvedColorMode}`

export type SemanticColorTokens = {
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  surface: string
  surfaceRaised: string
  surfaceSunken: string
  border: string
  borderStrong: string
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  success: string
  warning: string
  danger: string
}

export type ShellTokens = {
  appBackground: string
  headerBackground: string
  navBackground: string
  contextBackground: string
  tabBackground: string
  activeTabBackground: string
}

export type ShapeTokens = {
  radiusXs: string
  radiusSm: string
  radiusMd: string
  radiusLg: string
}

export type EffectTokens = {
  cardShadow: string
  panelShadow: string
  focusRing: string
  glow: string
  texture: string
}

export type TypographyTokens = {
  sans: string
  display: string
  mono: string
  letterSpacing: string
}

export type MotionTokens = {
  durationFast: string
  durationBase: string
  easing: string
}

export type DesignProfileMode = {
  id: DesignProfileVariantId
  mode: ResolvedColorMode
  colors: SemanticColorTokens
  shell: ShellTokens
  shape: ShapeTokens
  effects: EffectTokens
  typography: TypographyTokens
  motion: MotionTokens
}

export type DesignProfile = {
  id: DesignProfileId
  name: string
  description: string
  modes: Record<ResolvedColorMode, DesignProfileMode>
}

export function resolveColorMode(colorMode: ColorMode, systemMode: ResolvedColorMode): ResolvedColorMode {
  return colorMode === 'system' ? systemMode : colorMode
}

export function getProfileMode(profile: DesignProfile, mode: ResolvedColorMode): DesignProfileMode {
  return profile.modes[mode]
}
