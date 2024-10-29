<template>
  <div :class="className" :style="{height: height, width: width}" />
</template>

<script>
import * as echarts from 'echarts'
import ResizeMixin from '@/components/Charts/mixins/resize'

export default {
  name: 'PieChart',
  mixins: [ResizeMixin],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    projectChatData: {
      type: Array,
      default: () => [
        {
          name: 'tesssS',
          memberCount: 320
        }
      ]
    }
  },
  data() {
    return {
      chart: null, // Định nghĩa biến chart để giữ tham chiếu đến đối tượng ECharts
      dataProject: [
        { value: 320, name: 'Industries' },
        { value: 240, name: 'Technology' },
        { value: 149, name: 'Forex' },
        { value: 100, name: 'Gold' },
        { value: 59, name: 'Forecasts' }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  watch: {
    projectChatData: {
      handler(newVal) {
        this.dataProject = newVal.map((item) => ({
          name: item.name,
          value: item.memberCount
        }))
        this.initChart()
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: 'Project Pie Chart', // Tiêu đề của biểu đồ
          left: 'left', // Vị trí của tiêu đề, có thể là 'center', 'left', 'right'
          top: 'top', // Vị trí trên của tiêu đề, có thể là 'top', 'middle', 'bottom'
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold'
            // color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            return `Project: ${params.name} <br/>Members count: ${params.value} (${params.percent}%)`
          }
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.dataProject.map((item) => item.name)
        },
        series: [
          {
            name: 'Projects',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.dataProject,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
/* Thêm các kiểu CSS nếu cần */
</style>
