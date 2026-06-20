import { describe, expect, it } from 'vitest'
import * as themeRuntime from './index'

describe('theme runtime package boundary', () => {
  it('exports runtime helpers without bundling built-in profile registries', () => {
    expect(themeRuntime.applyDesignProfile).toEqual(expect.any(Function))
    expect(themeRuntime.getChartRecipe).toEqual(expect.any(Function))
    expect(themeRuntime.mergeChartRecipe).toEqual(expect.any(Function))
    expect('builtInDesignProfiles' in themeRuntime).toBe(false)
    expect('getBuiltInDesignProfile' in themeRuntime).toBe(false)
    expect('baseProfile' in themeRuntime).toBe(false)
    expect('cyberpunkProfile' in themeRuntime).toBe(false)
    expect('cryptoProfile' in themeRuntime).toBe(false)
    expect('industrialProfile' in themeRuntime).toBe(false)
    expect('newsprintProfile' in themeRuntime).toBe(false)
  })
})
