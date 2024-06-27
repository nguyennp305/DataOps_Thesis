import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const chartsRouter: RouteConfig = {
  path: '/charts',
  component: Layout,
  redirect: 'noredirect',
  name: 'Charts',
  meta: {
    title: 'charts',
    icon: 'chart',
    roles: ['admin']
  },
  children: [
    {
      path: 'bar-chart',
      component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/charts/bar-chart.vue'),
      name: 'BarChartDemo',
      meta: {
        title: 'barChart',
        roles: ['admin'],
        noCache: true
      }
    },
    {
      path: 'line-chart',
      component: () => import(/* webpackChunkName: "line-chart" */ '@/views/charts/line-chart.vue'),
      name: 'LineChartDemo',
      meta: {
        title: 'lineChart',
        roles: ['admin'],
        noCache: true
      }
    },
    {
      path: 'mixed-chart',
      component: () => import(/* webpackChunkName: "mixed-chart" */ '@/views/charts/mixed-chart.vue'),
      name: 'MixedChartDemo',
      meta: {
        title: 'mixedChart',
        roles: ['admin'],
        noCache: true
      }
    }
  ]
}

export default chartsRouter
