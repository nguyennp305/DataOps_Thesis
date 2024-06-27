import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const nestedRoutes: RouteConfig = {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1',
  name: 'Nested',
  meta: {
    title: 'nested',
    icon: 'nested',
    roles: ['admin']
  },
  children: [
    {
      path: 'menu1',
      component: () => import(/* webpackChunkName: "menu1" */ '@/views/nested/menu1/index.vue'),
      redirect: '/nested/menu1/menu1-1',
      name: 'Menu1',
      meta: { title: 'menu1', roles: ['admin'] },
      children: [
        {
          path: 'menu1-1',
          component: () => import(/* webpackChunkName: "menu1-1" */ '@/views/nested/menu1/menu1-1/index.vue'),
          name: 'Menu1-1',
          meta: { title: 'menu1-1', roles: ['admin'] }
        },
        {
          path: 'menu1-2',
          component: () => import(/* webpackChunkName: "menu1-2" */ '@/views/nested/menu1/menu1-2/index.vue'),
          redirect: '/nested/menu1/menu1-2/menu1-2-1',
          name: 'Menu1-2',
          meta: { title: 'menu1-2', roles: ['admin'] },
          children: [
            {
              path: 'menu1-2-1',
              component: () => import(/* webpackChunkName: "menu1-2-1" */ '@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
              name: 'Menu1-2-1',
              meta: { title: 'menu1-2-1', roles: ['admin'] }
            },
            {
              path: 'menu1-2-2',
              component: () => import(/* webpackChunkName: "menu1-2-2" */ '@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
              name: 'Menu1-2-2',
              meta: { title: 'menu1-2-2', roles: ['admin'] }
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () => import(/* webpackChunkName: "menu1-3" */ '@/views/nested/menu1/menu1-3/index.vue'),
          name: 'Menu1-3',
          meta: { title: 'menu1-3', roles: ['admin'] }
        }
      ]
    },
    {
      path: 'menu2',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/nested/menu2/index.vue'),
      name: 'Menu2',
      meta: { title: 'menu2', roles: ['admin'] }
    }
  ]
}

export default nestedRoutes
