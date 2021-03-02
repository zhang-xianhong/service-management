import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/Index.vue';
import { setRouterRef } from '@/layout/messageCenter/routerRef';

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
        component: () => import('@/views/projectManagement/Index.vue'),
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
        component: () => import('@/views/projectManagement/add-project/AddProject.vue'),
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
        component: () => import('@/views/userManagement/Index.vue'),
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
        component: () => import(/* webpackChunkName: "business-server" */ '../views/servers/BusinessServer.vue'),
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
        component: () => import(/* webpackChunkName: "business-server" */ '../views/servers/BusinessEdit.vue'),
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
        component: () => import(/* webpackChunkName: "business-server" */ '../views/servers/BusinessEdit.vue'),
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
        component: () => import(/* webpackChunkName: "business-server" */ '../views/servers/BusinessServer.vue'),
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
    redirect: '/model',
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
        path: 'model',
        component: () => import('@/views/schema/model/Index.vue'),
        name: 'Model',
        meta: {
          title: '数据对象',
          icon: 'el-icon-eleme',
        },
        props: {
          isRouteLevel: false,
        },
      },
      {
        path: 'model/:id',
        component: () => import('@/views/schema/model/form/Index.vue'),
        name: 'ModelCreate',
        props: {
          isRouteLevel: false,
        },
        meta: {
          title: '数据对象',
          icon: 'el-icon-eleme',
          hidden: true,
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
