import type { ChartRecipe } from '@super-admin-org/theme'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

export type ChartPoint = {
  label: string
  value: number
}

let registered = false

export function registerSuperAdminECharts(): void {
  if (registered) {
    return
  }

  use([BarChart, LineChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])
  registered = true
}

function createTooltip(recipe: ChartRecipe): EChartsOption['tooltip'] {
  return {
    backgroundColor: recipe.tooltip.backgroundColor,
    borderColor: recipe.tooltip.borderColor,
    borderWidth: 1,
    textStyle: {
      color: recipe.tooltip.textColor
    },
    trigger: 'axis'
  }
}

function createCategoryAxis(recipe: ChartRecipe, labels: string[]): EChartsOption['xAxis'] {
  return {
    axisLabel: {
      color: recipe.axis.labelColor
    },
    axisLine: {
      lineStyle: {
        color: recipe.axis.lineColor
      }
    },
    axisTick: {
      show: false
    },
    data: labels,
    type: 'category'
  }
}

function createValueAxis(recipe: ChartRecipe): EChartsOption['yAxis'] {
  return {
    axisLabel: {
      color: recipe.axis.labelColor
    },
    splitLine: {
      lineStyle: {
        color: recipe.axis.splitLineColor,
        type: recipe.axis.splitLineStyle
      }
    },
    type: 'value'
  }
}

export function createTrendLineOption(recipe: ChartRecipe, points: ChartPoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    color: recipe.palette,
    grid: {
      bottom: 24,
      containLabel: true,
      left: 8,
      right: 8,
      top: 24
    },
    tooltip: createTooltip(recipe),
    xAxis: createCategoryAxis(recipe, points.map((point) => point.label)),
    yAxis: createValueAxis(recipe),
    series: [
      {
        areaStyle: {
          opacity: recipe.line.areaOpacity
        },
        data: points.map((point) => point.value),
        lineStyle: {
          width: recipe.line.width
        },
        showSymbol: recipe.line.showSymbol,
        smooth: recipe.line.smooth,
        type: 'line'
      }
    ],
    animationDuration: recipe.motion.duration
  }
}

export function createBarChartOption(recipe: ChartRecipe, points: ChartPoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    color: recipe.palette,
    grid: {
      bottom: 24,
      containLabel: true,
      left: 8,
      right: 8,
      top: 24
    },
    tooltip: createTooltip(recipe),
    xAxis: createCategoryAxis(recipe, points.map((point) => point.label)),
    yAxis: createValueAxis(recipe),
    series: [
      {
        barWidth: recipe.bar.columnWidth,
        data: points.map((point) => point.value),
        itemStyle: {
          borderRadius: recipe.bar.borderRadius
        },
        type: 'bar'
      }
    ],
    animationDuration: recipe.motion.duration
  }
}

export function createDonutChartOption(recipe: ChartRecipe, points: ChartPoint[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    color: recipe.palette,
    legend: {
      bottom: 0,
      icon: 'circle',
      textStyle: {
        color: recipe.axis.labelColor
      }
    },
    series: [
      {
        data: points.map((point) => ({
          name: point.label,
          value: point.value
        })),
        itemStyle: {
          borderColor: recipe.surface.backgroundColor,
          borderWidth: 2
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        radius: ['54%', '76%'],
        type: 'pie'
      }
    ],
    tooltip: {
      ...createTooltip(recipe),
      trigger: 'item'
    },
    animationDuration: recipe.motion.duration
  }
}
