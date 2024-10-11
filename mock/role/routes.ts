// Just a mock data

import { name } from 'faker'

export const constantRoutes = [
  {
    path: '/redirect',
    component: 'Layout',
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: 'views/redirect/index'
      }
    ]
  },
  {
    path: '/login',
    component: 'views/login/index',
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: 'views/login/auth-redirect',
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: 'views/error-page/404',
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: 'views/error-page/401',
    meta: { hidden: true }
  },
  {
    path: '',
    component: 'Layout',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: 'views/dashboard/index',
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
  //   component: 'Layout',
  //   children: [
  //     {
  //       path: 'index',
  //       component: 'views/documentation/index',
  //       name: 'Documentation',
  //       meta: {
  //         title: 'documentation',
  //         icon: 'documentation',
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/guide',
    component: 'Layout',
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: 'views/guide/index',
        name: 'Guide',
        meta: {
          title: 'guide',
          icon: 'guide',
          noCache: true
        }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/permission',
    component: 'Layout',
    redirect: '/permission/index',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'page',
        component: 'views/permission/page',
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin']
        }
      },
      {
        path: 'directive',
        component: 'views/permission/directive',
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
        }
      },
      {
        path: 'role',
        component: 'views/permission/role',
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
    component: 'Layout',
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
        component: 'views/user-management/index',
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
    component: 'Layout',
    redirect: '/organization/enterprise',
    meta: {
      title: 'enterpriseManagement',
      icon: 'enterprise',
      roles: ['admin'],
      alwaysShow: true
    },
    children: [
      {
        path: 'enterprise',
        component: 'views/organization/enterprise.vue',
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
    component: 'Layout',
    redirect: '/project/list',
    meta: {
      title: 'projectManagement',
      icon: 'skill',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'list',
        component: 'views/project-management/index.vue',
        name: 'Project',
        meta: {
          title: 'project',
          roles: ['admin', 'admin_project']
        }
      }
    ]
  },
  {
    path: '/label-management',
    component: 'Layout',
    redirect: '/label-management/label-group',
    meta: {
      title: 'labelManagement',
      icon: 'qq',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'label-data',
        component: '@/views/labeling-management/label-data.vue',
        name: 'LabelData',
        meta: {
          title: 'labelData',
          roles: ['admin', 'admin_project']
        }
      },
      {
        path: 'label-group',
        component: '@/views/labeling-management/label-group.vue',
        name: 'LabelGroup',
        meta: {
          title: 'labelGroup',
          roles: ['admin', 'admin_project']
        }
      },
      {
        path: 'labeling-image',
        component: '@/views/labeling-management/index.vue',
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
    component: 'Layout',
    redirect: '/dataset/list',
    meta: {
      title: 'datasetManagement',
      icon: 'tree',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'list',
        component: 'views/dataset-management/index.vue',
        name: 'Dataset',
        meta: {
          title: 'dataset',
          roles: ['admin', 'admin_project']
        }
      }
    ]
  },
  {
    path: '/data',
    component: 'Layout',
    redirect: '/data/list',
    meta: {
      title: 'dataManagement',
      icon: 'documentation',
      roles: ['admin', 'admin_project'],
      alwaysShow: true
    },
    children: [
      {
        path: 'list',
        component: 'views/data-management/index.vue',
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
    component: 'Layout',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: 'views/icons/index',
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
  {
    path: '/components',
    component: 'Layout',
    redirect: 'noredirect',
    name: 'ComponentDemo',
    meta: {
      title: 'components',
      icon: 'component',
      roles: ['admin']
    },
    children: [
      {
        path: 'tinymce',
        component: 'views/components-demo/tinymce',
        name: 'TinymceDemo',
        meta: { title: 'tinymce', roles: ['admin'] }
      },
      {
        path: 'markdown',
        component: 'views/components-demo/markdown',
        name: 'MarkdownDemo',
        meta: { title: 'markdown', roles: ['admin'] }
      },
      {
        path: 'avatar-upload',
        component: 'views/components-demo/avatar-upload',
        name: 'AvatarUploadDemo',
        meta: { title: 'avatarUpload', roles: ['admin'] }
      },
      {
        path: 'dropzone',
        component: 'views/components-demo/dropzone',
        name: 'DropzoneDemo',
        meta: { title: 'dropzone', roles: ['admin'] }
      },
      {
        path: 'sticky',
        component: 'views/components-demo/sticky',
        name: 'StickyDemo',
        meta: { title: 'sticky', roles: ['admin'] }
      },
      {
        path: 'count-to',
        component: 'views/components-demo/count-to',
        name: 'CountToDemo',
        meta: { title: 'countTo', roles: ['admin'] }
      },
      {
        path: 'mixin',
        component: 'views/components-demo/mixin',
        name: 'ComponentMixinDemo',
        meta: { title: 'componentMixin', roles: ['admin'] }
      },
      {
        path: 'draggable-dialog',
        component: 'views/components-demo/draggable-dialog',
        name: 'DraggableDialogDemo',
        meta: { title: 'draggableDialog', roles: ['admin'] }
      },
      {
        path: 'draggable-select',
        component: 'views/components-demo/draggable-select',
        name: 'DraggableSelectDemo',
        meta: { title: 'draggableSelect', roles: ['admin'] }
      },
      {
        path: 'draggable-list',
        component: 'views/components-demo/draggable-list',
        name: 'DraggableListDemo',
        meta: { title: 'draggableList', roles: ['admin'] }
      },
      {
        path: 'draggable-kanban',
        component: 'views/components-demo/draggable-kanban',
        name: 'DraggableKanbanDemo',
        meta: { title: 'draggableKanban', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/charts',
    component: 'Layout',
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
        component: 'views/charts/bar-chart',
        name: 'BarChartDemo',
        meta: {
          title: 'barChart',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: 'line-chart',
        component: 'views/charts/line-chart',
        name: 'LineChartDemo',
        meta: {
          title: 'lineChart',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: 'mixedchart',
        component: 'views/charts/mixed-chart',
        name: 'MixedChartDemo',
        meta: {
          title: 'mixedChart',
          roles: ['admin'],
          noCache: true
        }
      }
    ]
  },
  {
    path: '/nested',
    component: 'Layout',
    redirect: '/nested/menu1/menu1-1',
    name: 'Nested',
    meta: {
      title: 'nested',
      icon: 'nested',
      roles: ['admin']
    },
    children: [
      {
        path: 'menu1',
        component: 'views/nested/menu1/index',
        redirect: '/nested/menu1/menu1-1',
        name: 'Menu1',
        meta: { title: 'menu1', roles: ['admin'] },
        children: [
          {
            path: 'menu1-1',
            component: 'views/nested/menu1/menu1-1/index',
            name: 'Menu1-1',
            meta: { title: 'menu1-1', roles: ['admin'] }
          },
          {
            path: 'menu1-2',
            component: 'views/nested/menu1/menu1-2/index',
            name: 'Menu1-2',
            redirect: '/nested/menu1/menu1-2/menu1-2-1',
            meta: { title: 'menu1-2', roles: ['admin'] },
            children: [
              {
                path: 'menu1-2-1',
                component: 'views/nested/menu1/menu1-2/menu1-2-1/index',
                name: 'Menu1-2-1',
                meta: { title: 'menu1-2-1', roles: ['admin'] }
              },
              {
                path: 'menu1-2-2',
                component: 'views/nested/menu1/menu1-2/menu1-2-2/index',
                name: 'Menu1-2-2',
                meta: { title: 'menu1-2-2', roles: ['admin'] }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: 'views/nested/menu1/menu1-3/index',
            name: 'Menu1-3',
            meta: { title: 'menu1-3', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'Menu2',
        component: 'views/nested/menu2/index',
        meta: { title: 'menu2', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/table',
    component: 'Layout',
    redirect: '/table/complex-table',
    name: 'Table',
    meta: {
      title: 'table',
      icon: 'table',
      roles: ['admin']
    },
    children: [
      {
        path: 'dynamic-table',
        component: 'views/table/dynamic-table/index',
        name: 'DynamicTable',
        meta: { title: 'dynamicTable', roles: ['admin'] }
      },
      {
        path: 'draggable-table',
        component: 'views/table/draggable-table',
        name: 'DraggableTable',
        meta: { title: 'draggableTable', roles: ['admin'] }
      },
      {
        path: 'inline-edit-table',
        component: 'views/table/inline-edit-table',
        name: 'InlineEditTable',
        meta: { title: 'inlineEditTable', roles: ['admin'] }
      },
      {
        path: 'complex-table',
        component: 'views/table/complex-table',
        name: 'ComplexTable',
        meta: { title: 'complexTable', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/example',
    component: 'Layout',
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example',
      roles: ['admin']
    },
    children: [
      {
        path: 'create',
        component: 'views/example/create',
        name: 'CreateArticle',
        meta: {
          title: 'createArticle',
          icon: 'edit',
          roles: ['admin']
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: 'views/example/edit',
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
        component: 'views/example/list',
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
    component: 'Layout',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: 'views/tab/index',
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
    component: 'Layout',
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404',
      roles: ['admin']
    },
    children: [
      {
        path: '401',
        component: 'views/error-page/401',
        name: 'Page401',
        meta: {
          title: 'page401',
          roles: ['admin'],
          noCache: true
        }
      },
      {
        path: '404',
        component: 'views/error-page/404',
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
    component: 'Layout',
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel',
      roles: ['admin']
    },
    children: [
      {
        path: 'export-excel',
        component: 'views/excel/export-excel',
        name: 'ExportExcel',
        meta: { title: 'exportExcel', roles: ['admin'] }
      },
      {
        path: 'export-selected-excel',
        component: 'views/excel/select-excell',
        name: 'SelectExcel',
        meta: { title: 'selectExcel', roles: ['admin'] }
      },
      {
        path: 'export-merge-header',
        component: 'views/excel/merge-header',
        name: 'MergeHeader',
        meta: { title: 'mergeHeader', roles: ['admin'] }
      },
      {
        path: 'upload-excel',
        component: 'views/excel/upload-excel',
        name: 'UploadExcel',
        meta: { title: 'uploadExcel', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/zip',
    component: 'Layout',
    redirect: '/zip/download',
    meta: {
      title: 'zip',
      icon: 'zip',
      roles: ['admin'],
      alwaysShow: true
    },
    children: [
      {
        path: 'download',
        component: 'views/zip/index',
        name: 'ExportZip',
        meta: { title: 'exportZip', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/pdf',
    component: 'Layout',
    meta: {
      roles: ['admin']
    },
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: 'views/pdf/index',
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
    component: 'views/pdf/download',
    meta: { hidden: true, roles: ['admin'] }
  },
  {
    path: '/theme',
    component: 'Layout',
    meta: {
      roles: ['admin']
    },
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: 'views/theme/index',
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
    component: 'Layout',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: 'views/i18n-demo/index',
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
