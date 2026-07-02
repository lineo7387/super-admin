import type { DesignProfile } from '@super-admin-org/core'

export const cyberpunkProfile: DesignProfile = {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  description: 'Glitch terminal control room with neon signal, scanlines, and chamfered noir panels.',
  modes: {
    dark: {
      id: 'cyberpunk.dark',
      mode: 'dark',
      colors: {
        background: '#0a0a0f',
        foreground: '#e0e0e0',
        muted: '#1c1c2e',
        mutedForeground: '#7b8292',
        surface: 'rgba(18, 18, 26, 0.9)',
        surfaceRaised: 'rgba(28, 28, 46, 0.88)',
        surfaceSunken: 'rgba(5, 5, 10, 0.82)',
        border: 'rgba(0, 212, 255, 0.22)',
        borderStrong: 'rgba(0, 255, 136, 0.5)',
        primary: '#00ff88',
        primaryForeground: '#04100c',
        accent: '#ff00ff',
        accentForeground: '#fff4ff',
        success: '#00ff88',
        warning: '#f8f32b',
        danger: '#ff3366'
      },
      shell: {
        appBackground:
          'radial-gradient(circle at 18% -8%, rgba(0, 255, 136, 0.18), transparent 30%), radial-gradient(circle at 88% 8%, rgba(255, 0, 255, 0.16), transparent 26%), #0a0a0f',
        headerBackground: 'rgba(10, 10, 15, 0.9)',
        navBackground: 'rgba(12, 12, 22, 0.86)',
        contextBackground: 'rgba(8, 8, 14, 0.92)',
        tabBackground: 'rgba(28, 28, 46, 0.72)',
        activeTabBackground: 'rgba(0, 255, 136, 0.16)'
      },
      shape: {
        radiusXs: '0px',
        radiusSm: '2px',
        radiusMd: '4px',
        radiusLg: '4px'
      },
      effects: {
        cardShadow: '0 0 0 1px rgba(0, 255, 136, 0.14), 0 0 18px rgba(0, 255, 136, 0.18), 0 24px 70px rgba(0, 0, 0, 0.58)',
        panelShadow: '0 0 0 1px rgba(255, 0, 255, 0.16), 0 0 26px rgba(0, 212, 255, 0.2), 0 30px 90px rgba(0, 0, 0, 0.66)',
        focusRing: '0 0 0 2px rgba(0, 255, 136, 0.74), 0 0 18px rgba(0, 255, 136, 0.38)',
        glow: '0 0 5px rgba(0, 255, 136, 0.8), 0 0 18px rgba(0, 255, 136, 0.32)',
        texture:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.28) 2px, rgba(0, 0, 0, 0.28) 4px), linear-gradient(rgba(0, 255, 136, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px)'
      },
      typography: {
        sans: '"JetBrains Mono", "Fira Code", "Consolas", ui-monospace, SFMono-Regular, monospace',
        display: '"Orbitron", "Share Tech Mono", "JetBrains Mono", ui-monospace, monospace',
        mono: '"JetBrains Mono", "Fira Code", "Consolas", ui-monospace, monospace',
        letterSpacing: '0.04em'
      },
      motion: {
        durationFast: '90ms',
        durationBase: '140ms',
        easing: 'steps(4, end)'
      }
    },
    light: {
      id: 'cyberpunk.light',
      mode: 'light',
      colors: {
        background: '#e9fbff',
        foreground: '#081018',
        muted: '#cdeff5',
        mutedForeground: '#4c6470',
        surface: 'rgba(244, 253, 255, 0.88)',
        surfaceRaised: 'rgba(255, 255, 255, 0.94)',
        surfaceSunken: 'rgba(207, 239, 246, 0.72)',
        border: 'rgba(0, 106, 122, 0.22)',
        borderStrong: 'rgba(184, 0, 130, 0.44)',
        primary: '#006a7a',
        primaryForeground: '#f2feff',
        accent: '#b80082',
        accentForeground: '#fff4fb',
        success: '#00794d',
        warning: '#8d6a00',
        danger: '#bc1747'
      },
      shell: {
        appBackground:
          'radial-gradient(circle at 16% -10%, rgba(0, 212, 255, 0.24), transparent 30%), radial-gradient(circle at 86% 4%, rgba(255, 0, 255, 0.15), transparent 24%), #e9fbff',
        headerBackground: 'rgba(236, 251, 255, 0.9)',
        navBackground: 'rgba(218, 246, 252, 0.84)',
        contextBackground: 'rgba(241, 253, 255, 0.92)',
        tabBackground: 'rgba(205, 239, 245, 0.74)',
        activeTabBackground: 'rgba(184, 0, 130, 0.14)'
      },
      shape: {
        radiusXs: '0px',
        radiusSm: '2px',
        radiusMd: '4px',
        radiusLg: '4px'
      },
      effects: {
        cardShadow: '0 0 0 1px rgba(0, 106, 122, 0.12), 0 0 22px rgba(0, 106, 122, 0.16), 0 18px 54px rgba(12, 74, 91, 0.14)',
        panelShadow: '0 0 0 1px rgba(184, 0, 130, 0.14), 0 0 26px rgba(184, 0, 130, 0.14), 0 22px 70px rgba(12, 74, 91, 0.18)',
        focusRing: '0 0 0 2px rgba(0, 106, 122, 0.56), 0 0 16px rgba(184, 0, 130, 0.22)',
        glow: '0 0 6px rgba(0, 106, 122, 0.34), 0 0 20px rgba(184, 0, 130, 0.18)',
        texture:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 106, 122, 0.055) 2px, rgba(0, 106, 122, 0.055) 4px), linear-gradient(rgba(0, 106, 122, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 0, 130, 0.045) 1px, transparent 1px)'
      },
      typography: {
        sans: '"JetBrains Mono", "Fira Code", "Consolas", ui-monospace, SFMono-Regular, monospace',
        display: '"Orbitron", "Share Tech Mono", "JetBrains Mono", ui-monospace, monospace',
        mono: '"JetBrains Mono", "Fira Code", "Consolas", ui-monospace, monospace',
        letterSpacing: '0.035em'
      },
      motion: {
        durationFast: '90ms',
        durationBase: '140ms',
        easing: 'steps(4, end)'
      }
    }
  }
}
