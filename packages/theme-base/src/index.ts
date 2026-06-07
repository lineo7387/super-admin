import type { DesignProfile } from '@super-admin-org/core'

export const baseProfile: DesignProfile = {
  id: 'base',
  name: 'Base',
  description: 'Neutral shadcn-vue starter profile with quiet surfaces, restrained focus, and clean admin defaults.',
  modes: {
    light: {
      id: 'base.light',
      mode: 'light',
      colors: {
        background: '#ffffff',
        foreground: '#09090b',
        muted: '#f4f4f5',
        mutedForeground: '#71717a',
        surface: '#ffffff',
        surfaceRaised: '#ffffff',
        surfaceSunken: '#f4f4f5',
        border: '#e4e4e7',
        borderStrong: '#d4d4d8',
        primary: '#18181b',
        primaryForeground: '#fafafa',
        accent: '#2563eb',
        accentForeground: '#eff6ff',
        success: '#16a34a',
        warning: '#ca8a04',
        danger: '#dc2626'
      },
      shell: {
        appBackground:
          'linear-gradient(180deg, rgba(250, 250, 250, 0.96), rgba(244, 244, 245, 0.82)), #ffffff',
        headerBackground: 'rgba(255, 255, 255, 0.92)',
        navBackground: '#fafafa',
        contextBackground: '#ffffff',
        tabBackground: '#f4f4f5',
        activeTabBackground: '#ffffff'
      },
      shape: {
        radiusXs: '4px',
        radiusSm: '6px',
        radiusMd: '8px',
        radiusLg: '8px'
      },
      effects: {
        cardShadow: '0 1px 2px rgba(24, 24, 27, 0.06), 0 8px 24px rgba(24, 24, 27, 0.06)',
        panelShadow: '0 18px 46px rgba(24, 24, 27, 0.08)',
        focusRing: '0 0 0 3px rgba(37, 99, 235, 0.22)',
        glow: '0 8px 24px rgba(37, 99, 235, 0.12)',
        texture:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(244, 244, 245, 0.56)), linear-gradient(90deg, rgba(228, 228, 231, 0.36) 1px, transparent 1px)'
      },
      typography: {
        sans: '"Inter", "Geist", ui-sans-serif, system-ui, sans-serif',
        display: '"Inter", "Geist", ui-sans-serif, system-ui, sans-serif',
        mono: '"JetBrains Mono", "SFMono-Regular", ui-monospace, monospace',
        letterSpacing: '0'
      },
      motion: {
        durationFast: '120ms',
        durationBase: '180ms',
        easing: 'cubic-bezier(.2,.8,.2,1)'
      }
    },
    dark: {
      id: 'base.dark',
      mode: 'dark',
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        muted: '#27272a',
        mutedForeground: '#a1a1aa',
        surface: '#18181b',
        surfaceRaised: '#27272a',
        surfaceSunken: '#09090b',
        border: '#27272a',
        borderStrong: '#3f3f46',
        primary: '#fafafa',
        primaryForeground: '#18181b',
        accent: '#60a5fa',
        accentForeground: '#0f172a',
        success: '#4ade80',
        warning: '#facc15',
        danger: '#f87171'
      },
      shell: {
        appBackground:
          'linear-gradient(180deg, rgba(24, 24, 27, 0.92), rgba(9, 9, 11, 0.98)), #09090b',
        headerBackground: 'rgba(24, 24, 27, 0.9)',
        navBackground: '#18181b',
        contextBackground: '#18181b',
        tabBackground: '#27272a',
        activeTabBackground: '#3f3f46'
      },
      shape: {
        radiusXs: '4px',
        radiusSm: '6px',
        radiusMd: '8px',
        radiusLg: '8px'
      },
      effects: {
        cardShadow: '0 1px 2px rgba(0, 0, 0, 0.28), 0 18px 44px rgba(0, 0, 0, 0.28)',
        panelShadow: '0 24px 60px rgba(0, 0, 0, 0.34)',
        focusRing: '0 0 0 3px rgba(96, 165, 250, 0.28)',
        glow: '0 8px 28px rgba(96, 165, 250, 0.16)',
        texture:
          'linear-gradient(180deg, rgba(39, 39, 42, 0.42), rgba(9, 9, 11, 0.5)), linear-gradient(90deg, rgba(63, 63, 70, 0.36) 1px, transparent 1px)'
      },
      typography: {
        sans: '"Inter", "Geist", ui-sans-serif, system-ui, sans-serif',
        display: '"Inter", "Geist", ui-sans-serif, system-ui, sans-serif',
        mono: '"JetBrains Mono", "SFMono-Regular", ui-monospace, monospace',
        letterSpacing: '0'
      },
      motion: {
        durationFast: '120ms',
        durationBase: '180ms',
        easing: 'cubic-bezier(.2,.8,.2,1)'
      }
    }
  }
}
