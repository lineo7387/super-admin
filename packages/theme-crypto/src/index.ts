import type { DesignProfile } from '@super-admin-org/core'

export const cryptoProfile: DesignProfile = {
  id: 'crypto',
  name: 'Crypto',
  description: 'Bitcoin DeFi control room with glass surfaces, amber signal, and technical depth.',
  modes: {
    dark: {
      id: 'crypto.dark',
      mode: 'dark',
      colors: {
        background: '#070706',
        foreground: '#f8f3e7',
        muted: '#15130f',
        mutedForeground: '#a79a83',
        surface: 'rgba(18, 16, 12, 0.82)',
        surfaceRaised: 'rgba(33, 28, 18, 0.86)',
        surfaceSunken: 'rgba(7, 7, 6, 0.72)',
        border: 'rgba(255, 185, 72, 0.18)',
        borderStrong: 'rgba(255, 185, 72, 0.38)',
        primary: '#f7931a',
        primaryForeground: '#181006',
        accent: '#ffd36b',
        accentForeground: '#1a1207',
        success: '#41d98b',
        warning: '#ffbd4a',
        danger: '#ff5f57'
      },
      shell: {
        appBackground: 'radial-gradient(circle at 24% 0%, rgba(247, 147, 26, 0.16), transparent 34%), #070706',
        headerBackground: 'rgba(12, 11, 9, 0.88)',
        navBackground: 'rgba(16, 14, 10, 0.78)',
        contextBackground: 'rgba(12, 10, 8, 0.9)',
        tabBackground: 'rgba(24, 21, 15, 0.72)',
        activeTabBackground: 'rgba(247, 147, 26, 0.18)'
      },
      shape: {
        radiusXs: '3px',
        radiusSm: '5px',
        radiusMd: '7px',
        radiusLg: '8px'
      },
      effects: {
        cardShadow: '0 18px 60px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 211, 107, 0.08)',
        panelShadow: '0 22px 80px rgba(0, 0, 0, 0.58)',
        focusRing: '0 0 0 3px rgba(247, 147, 26, 0.28)',
        glow: '0 0 32px rgba(247, 147, 26, 0.28)',
        texture: 'linear-gradient(rgba(255, 185, 72, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 185, 72, 0.045) 1px, transparent 1px)'
      },
      typography: {
        sans: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
        display: '"IBM Plex Sans Condensed", ui-sans-serif, system-ui, sans-serif',
        mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
        letterSpacing: '0'
      },
      motion: {
        durationFast: '120ms',
        durationBase: '180ms',
        easing: 'cubic-bezier(.2,.8,.2,1)'
      }
    },
    light: {
      id: 'crypto.light',
      mode: 'light',
      colors: {
        background: '#fbf4e5',
        foreground: '#1d160b',
        muted: '#efe3ca',
        mutedForeground: '#69553a',
        surface: 'rgba(255, 250, 239, 0.86)',
        surfaceRaised: 'rgba(255, 247, 229, 0.94)',
        surfaceSunken: 'rgba(242, 224, 188, 0.64)',
        border: 'rgba(121, 80, 16, 0.18)',
        borderStrong: 'rgba(121, 80, 16, 0.34)',
        primary: '#d97800',
        primaryForeground: '#fff7e8',
        accent: '#7b4d00',
        accentForeground: '#fff2d4',
        success: '#128453',
        warning: '#b96a00',
        danger: '#c63d31'
      },
      shell: {
        appBackground: 'radial-gradient(circle at 18% -8%, rgba(247, 147, 26, 0.24), transparent 32%), #fbf4e5',
        headerBackground: 'rgba(255, 247, 230, 0.9)',
        navBackground: 'rgba(246, 232, 203, 0.82)',
        contextBackground: 'rgba(255, 250, 239, 0.92)',
        tabBackground: 'rgba(239, 222, 190, 0.76)',
        activeTabBackground: 'rgba(247, 147, 26, 0.22)'
      },
      shape: {
        radiusXs: '3px',
        radiusSm: '5px',
        radiusMd: '7px',
        radiusLg: '8px'
      },
      effects: {
        cardShadow: '0 16px 48px rgba(73, 49, 8, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.66)',
        panelShadow: '0 18px 64px rgba(73, 49, 8, 0.18)',
        focusRing: '0 0 0 3px rgba(217, 120, 0, 0.24)',
        glow: '0 0 28px rgba(217, 120, 0, 0.2)',
        texture: 'linear-gradient(rgba(121, 80, 16, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(121, 80, 16, 0.04) 1px, transparent 1px)'
      },
      typography: {
        sans: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
        display: '"IBM Plex Sans Condensed", ui-sans-serif, system-ui, sans-serif',
        mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
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
