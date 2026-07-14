import { describe, expect, it } from 'vitest'
import chartsPageSource from '../charts/ChartsPage.vue?raw'
import chartExamplePanelSource from '../charts/components/ChartExamplePanel.vue?raw'
import { chartsManifest } from '../charts/charts.manifest'
import { examplesManifest } from './examples.manifest'

describe('charts example integration', () => {
  it('keeps the optional chart page inside Examples instead of a first-level module', () => {
    expect(chartsManifest.routes).toHaveLength(1)
    expect(examplesManifest.nav.children?.find((item) => item.label === 'Charts')?.path).toBe('/examples/charts')
    expect(examplesManifest.routes.find((route) => route.name === 'examples-charts')?.path).toBe('/examples/charts')
  })

  it('uses container-friendly chart layout for Stage Rail compressed workspaces', () => {
    expect(chartsPageSource).toContain('min-w-0')
    expect(chartsPageSource).not.toContain('xl:grid-cols')
    expect(chartsPageSource).toContain('repeat(auto-fit,minmax(min(100%,24rem),1fr))')
    expect(chartExamplePanelSource).toContain('min-w-0')
  })
})
