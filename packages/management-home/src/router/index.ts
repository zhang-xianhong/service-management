import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/Index.vue';
import { setRouterRef } from '@/layout/messageCenter/routerRef';
import { h } from 'vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index.vue'),
    props: {
      isRouteLevel: false,
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    props: {
      isRouteLevel: true,
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/Index.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'el-icon-eleme',
        },
        props: {
          isRouteLevel: false,
        },
      },
    ],
  },
  {
    path: '/project',
    component: Layout,
    name: 'project',
    props: {
      isRouteLevel: true,
    },
    meta: {
      title: '项目管理',
      icon: 'el-icon-eleme',
    },
    children: [
      {
        path: 'project-list',
        component: () => import('@/views/project-management/Index.vue'),
        name: 'projectList',
        props: {
          isRouteLevel: false,
        },
        meta: {
          title: '项目列表',
          icon: 'el-icon-eleme',
        },
      },
      {
        path: 'add-project',
        component: () => import('@/views/project-management/add-project/AddProject.vue'),
        name: 'addProject',
        props: {
          isRouteLevel: false,
        },
        meta: {
          title: '新增项目',
          icon: 'el-icon-eleme',
          hidden: false,
        },
      },
      {
        path: 'user-list',
        component: () => import('@/views/user-management/Index.vue'),
        name: 'userList',
        props: {
          isRouteLevel: false,
        },
        meta: {
          title: '用户列表',
          icon: 'el-icon-eleme',
        },
      },
    ],
  },
  {
    path: '/serve',
    name: 'Server',
    component: Layout,
    props: {
      isRouteLevel: true,
    },
    meta: {
      title: '服务管理',
      icon: 'el-icon-eleme',
    },
    children: [
      {
        path: 'business-server',
        name: 'BusinessServer',
        component: () =>
          import(/* webpackChunkName: "business-server" */ '../views/servers-management/BusinessServer.vue'),
        meta: {
          title: '业务服务',
          icon: 'el-icon-eleme',
        },
        props: {
          isRouteLevel: false,
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
        },
        props: {
          isRouteLevel: false,
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
        },
        props: {
          isRouteLevel: false,
        },
      },
    ],
  },
  {
    path: '/schema',
    name: 'Schema',
    redirect: '/data-object',
    component: Layout,
    props: {
      isRouteLevel: true,
    },
    meta: {
      title: '数据建模',
      icon: 'el-icon-eleme',
    },
    children: [
      {
        path: 'data-object',
        component: () => import('@/views/data-schema/field-data/data-object/Index.vue'),
        name: 'DataObject',
        meta: {
          title: '数据对象',
          icon: 'el-icon-eleme',
        },
        props: {
          isRouteLevel: false,
        },
      },
      {
        path: 'data-object/:id',
        component: () => import('@/views/data-schema/field-data/data-object/data-object-edit/Index.vue'),
        name: 'DataObjectEdit',
        props: {
          isRouteLevel: false,
        },
        meta: {
          title: '数据对象',
          icon: 'el-icon-eleme',
          hidden: true,
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
        },
        props: {
          isRouteLevel: false,
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
