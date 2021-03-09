import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/Index.vue';
import { setRouterRef } from '@/layout/messageCenter/routerRef';
import { h } from 'vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index.vue'),
    meta: {
      isRootLevel: false,
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    meta: {
      isRootLevel: true,
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/project',
    component: Layout,
    name: 'project',
    meta: {
      title: '项目管理',
      icon: 'el-icon-eleme',
      isRootLevel: true,
    },
    children: [
      {
        path: 'project-list',
        component: () => import('@/views/project-management/Index.vue'),
        name: 'projectList',
        meta: {
          title: '项目列表',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'add-project',
        component: () => import('@/views/project-management/add-project/AddProject.vue'),
        name: 'addProject',
        meta: {
          title: '新增项目',
          icon: 'el-icon-eleme',
          hidden: false,
          isRootLevel: false,
        },
      },
      {
        path: 'user-list',
        component: () => import('@/views/user-management/Index.vue'),
        name: 'userList',
        meta: {
          title: '用户列表',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/service',
    name: 'Service',
    component: Layout,
    meta: {
      title: '服务管理',
      icon: 'el-icon-eleme',
      isRootLevel: true,
    },
    children: [
      {
        path: 'business',
        name: 'Business',
        component: () =>
          import(/* webpackChunkName: "business-server" */ '../views/servers-management/BusinessServer.vue'),
        meta: {
          title: '业务服务',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'business-add',
        name: 'BusinessAdd',
        component: () =>
          import(/* webpackChunkName: "business-server" */ '../views/servers-management/BusinessEdit.vue'),
        meta: {
          title: '业务服务新增',
          icon: 'el-icon-eleme',
          hidden: true,
          isRootLevel: false,
        },
      },
      {
        path: 'business-edit/:id',
        name: 'BusinessEdit',
        component: () =>
          import(/* webpackChunkName: "business-server" */ '../views/servers-management/BusinessEdit.vue'),
        meta: {
          title: '业务服务编辑',
          icon: 'el-icon-eleme',
          hidden: true,
          isRootLevel: false,
        },
        props: true,
      },
      {
        path: 'other-server',
        name: 'OtherServer',
        component: {
          render: () => h('div', {}, '敬请期待'),
        },
        meta: {
          title: '其他服务',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/schema',
    name: 'Schema',
    redirect: '/model',
    component: Layout,
    meta: {
      title: '数据建模',
      icon: 'el-icon-eleme',
      isRootLevel: true,
    },
    children: [
      {
        path: 'model',
        component: () => import(/* webpackChunkName: "data-schema" */ '@/views/data-schema/data-object/Index.vue'),
        name: 'DataObject',
        meta: {
          title: '数据对象',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'model/:id',
        component: () =>
          import(/* webpackChunkName: "data-schema" */ '@/views/data-schema/data-object/data-object-edit/Index.vue'),
        name: 'DataObjectEdit',
        meta: {
          title: '数据对象',
          icon: 'el-icon-eleme',
          hidden: true,
          isRootLevel: false,
        },
      },
      {
        path: 'other-object',
        component: {
          render: () => h('div', {}, '敬请期待'),
        },
        name: 'Model',
        meta: {
          title: '其他对象',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

setRouterRef(router);

export default router;
