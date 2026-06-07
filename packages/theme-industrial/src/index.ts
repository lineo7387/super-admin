import type { DesignProfile } from '@super-admin-org/core'

export const industrialProfile: DesignProfile = {
  id: 'industrial',
  name: 'Industrial',
  description: 'Tactile operations console with pressed surfaces, panel seams, and LED signal states.',
  modes: {
    light: {
      id: 'industrial.light',
      mode: 'light',
      colors: {
        background: '#e7e2d6',
        foreground: '#24231f',
        muted: '#d8d1c2',
        mutedForeground: '#6b665c',
        surface: '#ebe6da',
        surfaceRaised: '#f4efe3',
        surfaceSunken: '#d1cabb',
        border: '#c3b9a8',
        borderStrong: '#9f927d',
        primary: '#2f5f73',
        primaryForeground: '#f5fbfd',
        accent: '#b14e2f',
        accentForeground: '#fff8f4',
        success: '#34785c',
        warning: '#a66d20',
        danger: '#a33a32'
      },
      shell: {
        appBackground: 'linear-gradient(135deg, #f0eadf, #d8d1c3)',
        headerBackground: 'rgba(239, 234, 222, 0.94)',
        navBackground: '#ddd6c9',
        contextBackground: '#e4ded2',
        tabBackground: '#d8d1c2',
        activeTabBackground: '#f4efe3'
      },
      shape: {
        radiusXs: '2px',
        radiusSm: '4px',
        radiusMd: '6px',
        radiusLg: '8px'
      },
      effects: {
        cardShadow: '8px 8px 18px rgba(131, 120, 102, 0.34), -7px -7px 16px rgba(255, 255, 255, 0.72)',
        panelShadow: 'inset 1px 1px 0 rgba(255, 255, 255, 0.72), 10px 12px 30px rgba(104, 96, 84, 0.22)',
        focusRing: '0 0 0 3px rgba(47, 95, 115, 0.24)',
        glow: '0 0 18px rgba(47, 95, 115, 0.18)',
        texture: 'linear-gradient(90deg, rgba(36, 35, 31, 0.035) 1px, transparent 1px)'
      },
      typography: {
        sans: '"DIN Alternate", "Aptos", ui-sans-serif, system-ui, sans-serif',
        display: '"DIN Condensed", "Aptos Display", ui-sans-serif, system-ui, sans-serif',
        mono: '"Roboto Mono", ui-monospace, SFMono-Regular, monospace',
        letterSpacing: '0'
      },
      motion: {
        durationFast: '110ms',
        durationBase: '170ms',
        easing: 'cubic-bezier(.25,.7,.25,1)'
      }
    },
    dark: {
      id: 'industrial.dark',
      mode: 'dark',
      colors: {
        background: '#171815',
        foreground: '#ece6d8',
        muted: '#24251f',
        mutedForeground: '#aaa28f',
        surface: '#20211c',
        surfaceRaised: '#2b2c25',
        surfaceSunken: '#12130f',
        border: '#3d3b32',
        borderStrong: '#67604f',
        primary: '#76a8b5',
        primaryForeground: '#0f181b',
        accent: '#dd7652',
        accentForeground: '#1b100b',
        success: '#72c59b',
        warning: '#d9a34f',
        danger: '#e06459'
      },
      shell: {
        appBackground: 'linear-gradient(135deg, #1c1d18, #11120f)',
        headerBackground: 'rgba(35, 36, 30, 0.94)',
        navBackground: '#20211c',
        contextBackground: '#1b1c17',
        tabBackground: '#282921',
        activeTabBackground: '#34362c'
      },
      shape: {
        radiusXs: '2px',
        radiusSm: '4px',
        radiusMd: '6px',
        radiusLg: '8px'
      },
      effects: {
        cardShadow: '8px 8px 18px rgba(0, 0, 0, 0.34), -6px -6px 14px rgba(255, 255, 255, 0.035)',
        panelShadow: 'inset 1px 1px 0 rgba(255, 255, 255, 0.06), 12px 14px 34px rgba(0, 0, 0, 0.34)',
        focusRing: '0 0 0 3px rgba(118, 168, 181, 0.24)',
        glow: '0 0 20px rgba(118, 168, 181, 0.18)',
        texture: 'linear-gradient(90deg, rgba(236, 230, 216, 0.035) 1px, transparent 1px)'
      },
      typography: {
        sans: '"DIN Alternate", "Aptos", ui-sans-serif, system-ui, sans-serif',
        display: '"DIN Condensed", "Aptos Display", ui-sans-serif, system-ui, sans-serif',
        mono: '"Roboto Mono", ui-monospace, SFMono-Regular, monospace',
        letterSpacing: '0'
      },
      motion: {
        durationFast: '110ms',
        durationBase: '170ms',
        easing: 'cubic-bezier(.25,.7,.25,1)'
      }
    }
  }
}
