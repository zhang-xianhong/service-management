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
    path: '/home',
    name: 'Home',
    // eslint-disable-next-line
    // @ts-ignore
    component: Layout,
    meta: {
      title: 'home',
      icon: 'el-icon-eleme',
    },
    props: {
      isRouteLevel: true,
    },
    children: [
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: {
          title: 'about',
          icon: 'el-icon-eleme',
        },
        props: {
          isRouteLevel: false,
        },
      },
      {
        path: '/hello',
        name: 'Hello',
        props: {
          hidden: !true,
          isRouteLevel: false,
        },
        meta: {
          title: 'hello',
          icon: 'el-icon-eleme',
        },
        component: () => import('../views/Home.vue'),
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
        path: 'model/create',
        component: () => import('@/views/schema/model/form/Index.vue'),
        name: 'ModelCreate',
        props: {
          isRouteLevel: false,
          hidden: true,
        },
        meta: {
          title: '数据对象',
          icon: 'el-icon-eleme',
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
