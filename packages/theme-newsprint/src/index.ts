import type { DesignProfile } from '@super-admin-org/core'

export const newsprintProfile: DesignProfile = {
  id: 'newsprint',
  name: 'Newsprint',
  description: 'Editorial command desk with sharp ink rules, dense columns, and newspaper masthead authority.',
  modes: {
    light: {
      id: 'newsprint.light',
      mode: 'light',
      colors: {
        background: '#f9f9f7',
        foreground: '#111111',
        muted: '#e5e5e0',
        mutedForeground: '#525252',
        surface: '#fbfbf8',
        surfaceRaised: '#ffffff',
        surfaceSunken: '#eeeeea',
        border: '#111111',
        borderStrong: '#111111',
        primary: '#111111',
        primaryForeground: '#f9f9f7',
        accent: '#cc0000',
        accentForeground: '#fff7f5',
        success: '#146c43',
        warning: '#8a5a00',
        danger: '#cc0000'
      },
      shell: {
        appBackground: 'radial-gradient(rgba(17, 17, 17, 0.045) 1px, transparent 1px), linear-gradient(180deg, #f9f9f7, #f1f1ed)',
        headerBackground: '#f9f9f7',
        navBackground: '#f2f2ee',
        contextBackground: '#fbfbf8',
        tabBackground: '#e5e5e0',
        activeTabBackground: '#ffffff'
      },
      shape: {
        radiusXs: '0px',
        radiusSm: '0px',
        radiusMd: '0px',
        radiusLg: '0px'
      },
      effects: {
        cardShadow: '4px 4px 0 #111111',
        panelShadow: '8px 8px 0 #111111',
        focusRing: '0 0 0 2px #f9f9f7, 0 0 0 4px #111111',
        glow: '3px 3px 0 #111111',
        texture:
          'radial-gradient(rgba(17, 17, 17, 0.045) 1px, transparent 1px), linear-gradient(0deg, transparent 0 96%, rgba(17, 17, 17, 0.035) 96% 100%), linear-gradient(90deg, transparent 0 96%, rgba(17, 17, 17, 0.035) 96% 100%)'
      },
      typography: {
        sans: '"Inter", "Helvetica Neue", ui-sans-serif, system-ui, sans-serif',
        display: '"Playfair Display", "Times New Roman", Georgia, serif',
        mono: '"JetBrains Mono", "Courier New", ui-monospace, monospace',
        letterSpacing: '0'
      },
      motion: {
        durationFast: '100ms',
        durationBase: '160ms',
        easing: 'cubic-bezier(.2,.8,.2,1)'
      }
    },
    dark: {
      id: 'newsprint.dark',
      mode: 'dark',
      colors: {
        background: '#151412',
        foreground: '#f4efe6',
        muted: '#282520',
        mutedForeground: '#b7ada0',
        surface: '#1d1b18',
        surfaceRaised: '#26231f',
        surfaceSunken: '#0f0e0d',
        border: '#e7dccb',
        borderStrong: '#f4efe6',
        primary: '#f4efe6',
        primaryForeground: '#151412',
        accent: '#ff4b3e',
        accentForeground: '#160504',
        success: '#66c18c',
        warning: '#e0b25a',
        danger: '#ff6b60'
      },
      shell: {
        appBackground: 'radial-gradient(rgba(244, 239, 230, 0.055) 1px, transparent 1px), linear-gradient(180deg, #151412, #0f0e0d)',
        headerBackground: '#181612',
        navBackground: '#201d18',
        contextBackground: '#191714',
        tabBackground: '#2a261f',
        activeTabBackground: '#332f27'
      },
      shape: {
        radiusXs: '0px',
        radiusSm: '0px',
        radiusMd: '0px',
        radiusLg: '0px'
      },
      effects: {
        cardShadow: '4px 4px 0 #000000',
        panelShadow: '8px 8px 0 #000000',
        focusRing: '0 0 0 2px #151412, 0 0 0 4px #f4efe6',
        glow: '3px 3px 0 #000000',
        texture:
          'radial-gradient(rgba(244, 239, 230, 0.06) 1px, transparent 1px), linear-gradient(0deg, transparent 0 96%, rgba(244, 239, 230, 0.045) 96% 100%), linear-gradient(90deg, transparent 0 96%, rgba(244, 239, 230, 0.045) 96% 100%)'
      },
      typography: {
        sans: '"Inter", "Helvetica Neue", ui-sans-serif, system-ui, sans-serif',
        display: '"Playfair Display", "Times New Roman", Georgia, serif',
        mono: '"JetBrains Mono", "Courier New", ui-monospace, monospace',
        letterSpacing: '0'
      },
      motion: {
        durationFast: '100ms',
        durationBase: '160ms',
        easing: 'cubic-bezier(.2,.8,.2,1)'
      }
    }
  }
}
