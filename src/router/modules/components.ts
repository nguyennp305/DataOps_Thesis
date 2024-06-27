import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const componentsRouter: RouteConfig = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: 'components',
    icon: 'component',
    roles: ['admin']
  },
  children: [
    {
      path: 'tinymce',
      component: () => import(/* webpackChunkName: "tinymce" */ '@/views/components-demo/tinymce.vue'),
      name: 'TinymceDemo',
      meta: { title: 'tinymce', roles: ['admin'] }
    },
    {
      path: 'markdown',
      component: () => import(/* webpackChunkName: "markdown" */ '@/views/components-demo/markdown.vue'),
      name: 'MarkdownDemo',
      meta: { title: 'markdown', roles: ['admin'] }
    },
    {
      path: 'json-editor',
      component: () => import(/* webpackChunkName: "json-editor" */ '@/views/components-demo/json-editor.vue'),
      name: 'JsonEditorDemo',
      meta: { title: 'jsonEditor', roles: ['admin'] }
    },
    {
      path: 'split-pane',
      component: () => import(/* webpackChunkName: "split-pane" */ '@/views/components-demo/split-pane.vue'),
      name: 'SplitPaneDemo',
      meta: { title: 'splitPane', roles: ['admin'] }
    },
    {
      path: 'avatar-upload',
      component: () => import(/* webpackChunkName: "avatar-upload" */ '@/views/components-demo/avatar-upload.vue'),
      name: 'AvatarUploadDemo',
      meta: { title: 'avatarUpload', roles: ['admin'] }
    },
    {
      path: 'dropzone',
      component: () => import(/* webpackChunkName: "dropzone" */ '@/views/components-demo/dropzone.vue'),
      name: 'DropzoneDemo',
      meta: { title: 'dropzone', roles: ['admin'] }
    },
    {
      path: 'sticky',
      component: () => import(/* webpackChunkName: "sticky" */ '@/views/components-demo/sticky.vue'),
      name: 'StickyDemo',
      meta: { title: 'sticky', roles: ['admin'] }
    },
    {
      path: 'count-to',
      component: () => import(/* webpackChunkName: "count-to" */ '@/views/components-demo/count-to.vue'),
      name: 'CountToDemo',
      meta: { title: 'countTo', roles: ['admin'] }
    },
    {
      path: 'mixin',
      component: () => import(/* webpackChunkName: "component-mixin" */ '@/views/components-demo/mixin.vue'),
      name: 'ComponentMixinDemo',
      meta: { title: 'componentMixin', roles: ['admin'] }
    },
    {
      path: 'back-to-top',
      component: () => import(/* webpackChunkName: "back-to-top" */ '@/views/components-demo/back-to-top.vue'),
      name: 'BackToTopDemo',
      meta: { title: 'backToTop', roles: ['admin'] }
    },
    {
      path: 'draggable-dialog',
      component: () => import(/* webpackChunkName: "draggable-dialog" */ '@/views/components-demo/draggable-dialog.vue'),
      name: 'DraggableDialogDemo',
      meta: { title: 'draggableDialog', roles: ['admin'] }
    },
    {
      path: 'draggable-kanban',
      component: () => import(/* webpackChunkName: "draggable-kanban" */ '@/views/components-demo/draggable-kanban.vue'),
      name: 'DraggableKanbanDemo',
      meta: { title: 'draggableKanban', roles: ['admin'] }
    },
    {
      path: 'draggable-list',
      component: () => import(/* webpackChunkName: "draggable-list" */ '@/views/components-demo/draggable-list.vue'),
      name: 'DraggableListDemo',
      meta: { title: 'draggableList', roles: ['admin'] }
    },
    {
      path: 'draggable-select',
      component: () => import(/* webpackChunkName: "draggable-select" */ '@/views/components-demo/draggable-select.vue'),
      name: 'DraggableSelectDemo',
      meta: { title: 'draggableSelect', roles: ['admin'] }
    }
  ]
}

export default componentsRouter
