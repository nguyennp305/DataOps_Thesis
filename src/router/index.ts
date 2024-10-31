import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

Vue.use(VueRouter)

/*
  Note: sub-menu only appear when children.length>=1
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'admin_project']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "guide" */ '@/views/guide/index.vue'),
        name: 'Guide',
        meta: {
          title: 'guide',
          icon: 'guide',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'user',
          noCache: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/directive',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'admin_project'], // you can set roles in root nav
      alwaysShow: true // will always show the root menu
    },
    children: [
      {
        path: 'page',
        component: () => import(/* webpackChunkName: "permission-page" */ '@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import(/* webpackChunkName: "permission-directive" */ '@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import(/* webpackChunkName: "permission-role" */ '@/views/permission/role.vue'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/user-management',
    component: Layout,
    redirect: '/user-management/user-list',
    meta: {
      title: 'userManagement',
      icon: 'peoples',
      roles: ['admin'],
      alwaysShow: true
    },
    children: [
      {
        path: 'user-list',
        component: () => import('@/views/user-management/index.vue'),
        name: 'UserList',
        meta: {
          title: 'userList',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/organization',
    component: Layout,
    meta: {
      title: 'enterpriseManagement',
      icon: 'enterprise',
      roles: ['admin'],
      alwaysShow: true
    },
    children: [
      {
        path: 'enterprise',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/organization/enterprise.vue'),
        name: 'Enterprise',
        meta: {
          title: 'enterprise',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    meta: {
      title: 'projectManagement',
      icon: 'skill',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/project-management/index.vue'),
        name: 'Project',
        meta: {
          title: 'project',
          roles: ['admin', 'admin_project']
        }
      },
      {
        path: 'task-management',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/project-management/task-management.vue'),
        name: 'TaskManagement',
        meta: {
          title: 'taskManagement',
          roles: ['admin', 'admin_project']
        }
      },
      {
        path: 'report-management',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/project-management/report-management.vue'),
        name: 'ReportManagement',
        meta: {
          title: 'reportManagement',
          roles: ['admin', 'admin_project']
        }
      }
    ]
  },
  {
    path: '/label-management',
    component: Layout,
    meta: {
      title: 'labelManagement',
      icon: 'qq',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'label-data',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/labeling-management/label-data.vue'),
        name: 'LabelData',
        meta: {
          title: 'labelData',
          roles: ['admin', 'admin_project']
        }
      },
      {
        path: 'label-group',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/labeling-management/label-group.vue'),
        name: 'LabelGroup',
        meta: {
          title: 'labelGroup',
          roles: ['admin', 'admin_project']
        }
      },
      {
        path: 'labeling-image',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/labeling-management/index.vue'),
        name: 'LabelingImage',
        meta: {
          title: 'labelingImage',
          roles: ['admin', 'admin_project']
        }
      }
    ]
  },
  {
    path: '/dataset',
    component: Layout,
    meta: {
      title: 'datasetManagement',
      icon: 'tree',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/dataset-management/index.vue'),
        name: 'Dataset',
        meta: {
          title: 'dataset',
          roles: ['admin', 'admin_project']
        }
      },
      {
        path: 'analytics',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/dataset-management/analytics.vue'),
        name: 'Analytics',
        meta: {
          title: 'analytics',
          roles: ['admin', 'admin_project']
        }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    meta: {
      title: 'dataManagement',
      icon: 'documentation',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/data-management/index.vue'),
        name: 'Data',
        meta: {
          title: 'data',
          roles: ['admin', 'admin_project']
        }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "icons" */ '@/views/icons/index.vue'),
        name: 'Icons',
        meta: {
          title: 'icons',
          icon: 'icon',
          roles: ['admin'],
          noCache: true
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    meta: {
      title: 'example',
      icon: 'example',
      roles: ['admin']
    },
    children: [
      {
        path: 'create',
        component: () => import(/* webpackChunkName: "example-create" */ '@/views/example/create.vue'),
        name: 'CreateArticle',
        meta: {
          title: 'createArticle',
          icon: 'edit',
          roles: ['admin']
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import(/* webpackChunkName: "example-edit" */ '@/views/example/edit.vue'),
        name: 'EditArticle',
        meta: {
          title: 'editArticle',
          roles: ['admin'],
          noCache: true,
          activeMenu: '/example/list',
          hidden: true
        }
      },
      {
        path: 'list',
        component: () => import(/* webpackChunkName: "example-list" */ '@/views/example/list.vue'),
        name: 'ArticleList',
        meta: {
          title: 'articleList',
          icon: 'list',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/tab',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "tab" */ '@/views/tab/index.vue'),
        name: 'Tab',
        meta: {
          title: 'tab',
          icon: 'tab',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'errorPages',
      icon: '404',
      roles: ['admin']
    },
    children: [
      {
        path: '401',
        component: () => import(/* webpackChunkName: "error-page-401" */ '@/views/error-page/401.vue'),
        name: 'Page401',
        meta: {
          title: 'page401',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import(/* webpackChunkName: "error-page-404" */ '@/views/error-page/404.vue'),
        name: 'Page404',
        meta: {
          title: 'page404',
          roles: ['admin'],
          noCache: true
        }
      }
    ]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    meta: {
      title: 'excel',
      icon: 'excel',
      roles: ['admin']
    },
    children: [
      {
        path: 'export-excel',
        component: () => import(/* webpackChunkName: "export-excel" */ '@/views/excel/export-excel.vue'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel', roles: ['admin'] }
      },
      {
        path: 'export-selected-excel',
        component: () => import(/* webpackChunkName: "select-excel" */ '@/views/excel/select-excel.vue'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel', roles: ['admin'] }
      },
      {
        path: 'export-merge-header',
        component: () => import(/* webpackChunkName: "merge-header" */ '@/views/excel/merge-header.vue'),
        name: 'MergeHeader',
        meta: { title: 'mergeHeader', roles: ['admin'] }
      },
      {
        path: 'upload-excel',
        component: () => import(/* webpackChunkName: "upload-excel" */ '@/views/excel/upload-excel.vue'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    meta: {
      title: 'zip',
      icon: 'zip',
      roles: ['admin'],
      alwaysShow: true // will always show the root menu
    },
    children: [
      {
        path: 'download',
        component: () => import(/* webpackChunkName: "zip" */ '@/views/zip/index.vue'),
        name: 'ExportZip',
        meta: { title: 'exportZip', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/pdf',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "pdf" */ '@/views/pdf/index.vue'),
        name: 'PDF',
        meta: {
          title: 'pdf',
          icon: 'pdf',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/pdf-download-example',
    component: () => import(/* webpackChunkName: "pdf-download-example" */ '@/views/pdf/download.vue'),
    meta: { hidden: true, roles: ['admin'] }
  },
  {
    path: '/theme',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "theme" */ '@/views/theme/index.vue'),
        name: 'Theme',
        meta: {
          title: 'theme',
          icon: 'theme',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/i18n',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "i18n-demo" */ '@/views/i18n-demo/index.vue'),
        name: 'I18n',
        meta: {
          title: 'i18n',
          icon: 'international',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: 'https://github.com',
    meta: {
      title: 'externalLink',
      icon: 'link',
      roles: ['admin']
    }
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true, roles: ['admin'] }
  }
]

const createRouter = () => new VueRouter({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
