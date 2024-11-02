<template>
  <div :id="id" :class="className" :style="{height: height, width: width}" />
</template>

<script lang="ts">
import * as echarts from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from './mixins/resize'
import { getAnalysticDatasetMixedChart } from '@/api/analystics-management/analystics'
import { dataChartMock } from '@/components/Charts/mockDataMixedChartAnalyticsDataset'

@Component({
  name: 'MixedChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string;
  @Prop({ default: 'chart' }) private id!: string;
  @Prop({ default: '200px' }) private width!: string;
  @Prop({ default: '200px' }) private height!: string;
  @Prop({ default: null }) private idsProject!: string;

  private dataChart: any = dataChartMock;

  @Watch('idsProject', { deep: true, immediate: true })
  private onIdsProjectChange(newVal: string) {
    this.getChartData(newVal)
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private async getChartData(id: string) {
    await getAnalysticDatasetMixedChart({ projectId: id }).then(
      (response: any) => {
        this.dataChart = response.data.dataChart
        this.$nextTick(() => {
          this.initChart()
        })
      }
    )
  }

  private initChart() {
    this.chart = echarts.init(
      document.getElementById(this.id) as HTMLDivElement
    )
    const xData = this.dataChart.map((item: any) => item.name)
    this.chart.setOption({
      backgroundColor: '#344b58',
      title: {
        text: 'Datasets MixedChart',
        top: '20',
        textStyle: {
          color: '#fff',
          fontSize: 22
        },
        subtextStyle: {
          color: '#90979c',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '5%',
        right: '5%',
        borderWidth: 0,
        top: 150,
        bottom: 95,
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        x: '5%',
        top: '10%',
        textStyle: {
          color: '#90979c'
        },
        data: ['labelGroups', 'labels', 'image']
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: xData
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }
      ],
      dataZoom: [
        {
          show: true,
          xAxisIndex: [0],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon:
            'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        },
        {
          type: 'inside',
          show: true,
          start: 1,
          end: 35
        }
      ],
      series: [
        {
          name: 'labelGroups',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            color: 'rgba(255,144,128,1)',
            label: {
              show: true,
              textStyle: {
                color: '#fff'
              },
              position: 'insideTop',
              formatter(p: any) {
                return p.value > 0 ? p.value : ''
              }
            }
          },
          data: this.dataChart.map((item: any) => item.labelGroups)
        },

        {
          name: 'labels',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            color: 'rgba(0,191,183,1)',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter(p: any) {
                return p.value > 0 ? p.value : ''
              }
            }
          },
          data: this.dataChart.map((item: any) => item.labels)
        },
        {
          name: 'image',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            color: 'rgba(252,230,48,1)',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter(p: any) {
                return p.value > 0 ? p.value : ''
              }
            }
          },
          data: this.dataChart.map((item: any) => item.image)
        }
      ]
    })
  }
}
</script>
