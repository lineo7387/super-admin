import type { DesignProfile, DesignProfileMode } from '@super-admin-org/core'
import { describe, expect, it } from 'vitest'
import { getChartRecipe, mergeChartRecipe } from './index'

function createMode(mode: 'light' | 'dark', overrides: Partial<DesignProfileMode> = {}): DesignProfileMode {
  return {
    id: `test.${mode}`,
    mode,
    colors: {
      background: mode === 'dark' ? '#09090b' : '#ffffff',
      foreground: mode === 'dark' ? '#fafafa' : '#09090b',
      muted: mode === 'dark' ? '#27272a' : '#f4f4f5',
      mutedForeground: mode === 'dark' ? '#a1a1aa' : '#71717a',
      surface: mode === 'dark' ? '#18181b' : '#ffffff',
      surfaceRaised: mode === 'dark' ? '#27272a' : '#ffffff',
      surfaceSunken: mode === 'dark' ? '#09090b' : '#f4f4f5',
      border: mode === 'dark' ? '#27272a' : '#e4e4e7',
      borderStrong: mode === 'dark' ? '#3f3f46' : '#d4d4d8',
      primary: mode === 'dark' ? '#fafafa' : '#18181b',
      primaryForeground: mode === 'dark' ? '#18181b' : '#fafafa',
      accent: mode === 'dark' ? '#60a5fa' : '#2563eb',
      accentForeground: mode === 'dark' ? '#0f172a' : '#eff6ff',
      success: mode === 'dark' ? '#4ade80' : '#16a34a',
      warning: mode === 'dark' ? '#facc15' : '#ca8a04',
      danger: mode === 'dark' ? '#f87171' : '#dc2626'
    },
    shell: {
      appBackground: mode === 'dark' ? '#09090b' : '#ffffff',
      headerBackground: mode === 'dark' ? '#18181b' : '#ffffff',
      navBackground: mode === 'dark' ? '#18181b' : '#fafafa',
      contextBackground: mode === 'dark' ? '#18181b' : '#ffffff',
      tabBackground: mode === 'dark' ? '#27272a' : '#f4f4f5',
      activeTabBackground: mode === 'dark' ? '#3f3f46' : '#ffffff'
    },
    shape: {
      radiusXs: '4px',
      radiusSm: '6px',
      radiusMd: '8px',
      radiusLg: '8px'
    },
    effects: {
      cardShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
      panelShadow: '0 18px 46px rgba(0, 0, 0, 0.08)',
      focusRing: '0 0 0 3px rgba(37, 99, 235, 0.22)',
      glow: '0 8px 24px rgba(37, 99, 235, 0.12)',
      texture: 'linear-gradient(#fff, #f4f4f5)'
    },
    typography: {
      sans: '"Inter", sans-serif',
      display: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
      letterSpacing: '0'
    },
    motion: {
      durationFast: '120ms',
      durationBase: '180ms',
      easing: 'cubic-bezier(.2,.8,.2,1)'
    },
    ...overrides
  }
}

function createProfile(id: string): DesignProfile {
  return {
    id,
    name: id,
    description: `${id} profile`,
    modes: {
      light: createMode('light'),
      dark: createMode('dark')
    }
  }
}

describe('chart recipes', () => {
  it('derives chart semantics from the selected profile mode without requiring a chart library', () => {
    const recipe = getChartRecipe(createProfile('base'), 'dark')

    expect(recipe.palette).toEqual(['#60a5fa', '#fafafa', '#4ade80', '#facc15', '#f87171'])
    expect(recipe.axis.labelColor).toBe('#a1a1aa')
    expect(recipe.axis.lineColor).toBe('#3f3f46')
    expect(recipe.surface.backgroundColor).toBe('#18181b')
    expect(recipe.motion.duration).toBe(180)
  })

  it('keeps built-in profile chart signatures visually distinct', () => {
    const cyberpunkRecipe = getChartRecipe(createProfile('cyberpunk'), 'dark')
    const newsprintRecipe = getChartRecipe(createProfile('newsprint'), 'light')

    expect(cyberpunkRecipe.axis.splitLineStyle).toBe('dashed')
    expect(cyberpunkRecipe.line.showSymbol).toBe(true)
    expect(cyberpunkRecipe.bar.borderRadius).toBe(0)
    expect(newsprintRecipe.axis.splitLineStyle).toBe('dotted')
    expect(newsprintRecipe.line.smooth).toBe(false)
  })

  it('merges local chart overrides without mutating the base recipe', () => {
    const baseRecipe = getChartRecipe(createProfile('base'), 'light')
    const merged = mergeChartRecipe(baseRecipe, {
      palette: ['#111827', '#0ea5e9'],
      tooltip: {
        backgroundColor: '#111827'
      },
      bar: {
        borderRadius: 2
      }
    })

    expect(merged.palette).toEqual(['#111827', '#0ea5e9'])
    expect(merged.tooltip.backgroundColor).toBe('#111827')
    expect(merged.tooltip.textColor).toBe(baseRecipe.tooltip.textColor)
    expect(merged.bar.borderRadius).toBe(2)
    expect(baseRecipe.palette).toEqual(['#2563eb', '#18181b', '#16a34a', '#ca8a04', '#dc2626'])
  })
})

