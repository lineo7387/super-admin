import { describe, expect, it } from 'vitest'
import chartsPageSource from '../charts/ChartsPage.vue?raw'
import chartExamplePanelSource from '../charts/components/ChartExamplePanel.vue?raw'
import examplesManifestSource from './examples.manifest.ts?raw'
import moduleRegistrySource from '../module-registry.ts?raw'

describe('charts example integration', () => {
  it('keeps the optional chart page inside Examples instead of a first-level module', () => {
    expect(examplesManifestSource).toContain("path: '/examples/charts'")
    expect(examplesManifestSource).toContain("name: 'examples-charts'")
    expect(examplesManifestSource).toContain("component: () => import('../charts/ChartsPage.vue')")
    expect(moduleRegistrySource).not.toContain('chartsManifest')
  })

  it('uses container-friendly chart layout for Stage Rail compressed workspaces', () => {
    expect(chartsPageSource).toContain('min-w-0')
    expect(chartsPageSource).not.toContain('xl:grid-cols')
    expect(chartsPageSource).toContain('repeat(auto-fit,minmax(min(100%,24rem),1fr))')
    expect(chartExamplePanelSource).toContain('min-w-0')
  })
})
