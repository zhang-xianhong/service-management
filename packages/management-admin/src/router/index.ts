import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/Index.vue';
import { setRouterRef } from '@/layout/messageCenter/routerRef';

export const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index.vue'),
    meta: {
      isRootLevel: false,
      title: '登录',
    },
  },
  {
    path: '/forget-password',
    name: 'password',
    component: () => import('@/views/login/ForgetPassword.vue'),
    meta: {
      isRootLevel: false,
      title: '密码找回',
    },
  },
  {
    path: '/no-right',
    name: 'noRight',
    component: () => import('@/views/no-right/Index.vue'),
    meta: {
      isRootLevel: false,
      title: '没有权限',
    },
  },
  {
    path: '/not-found',
    name: 'notFound',
    component: () => import('@/views/not-found/Index.vue'),
    meta: {
      isRootLevel: false,
      title: '404',
    },
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tenant-management',
  },
  {
    path: '/user-info',
    redirect: '/user',
    component: Layout,
    meta: {
      isRootLevel: true,
      hidden: true,
      title: '用户信息',
    },
    children: [
      {
        path: '/user',
        component: () => import(/* webpackChunkName: "userinfo" */ '@/views/user-info/Index.vue'),
        name: 'user',
        meta: {
          title: '用户信息',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/tenant-management',
    redirect: '/tenant-list',
    component: Layout,
    meta: {
      isRootLevel: true,
    },
    children: [
      {
        path: '/tenant-list',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/tenant-management/Index.vue'),
        name: 'TenantList',
        meta: {
          title: '租户管理',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: '/tenant-list/add',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/tenant-management/TenantAdd.vue'),
        name: 'TenantAdd',
        meta: {
          title: '新增账户',
          icon: 'el-icon-eleme',
          hidden: true,
          isRootLevel: false,
        },
      },
      {
        path: '/tenant-list/edit/:id',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/tenant-management/TenantEdit.vue'),
        name: 'TenantEdit',
        meta: {
          title: '租户管理',
          icon: 'el-icon-eleme',
          hidden: true,
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/about-info',
    redirect: '/about',
    component: Layout,
    meta: {
      isRootLevel: true,
      hidden: true,
      title: '关于信息',
    },
    children: [
      {
        path: '/about',
        component: () => import(/* webpackChunkName: "userinfo" */ '@/views/about-info/Index.vue'),
        name: 'about',
        meta: {
          title: '关于信息',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [...baseRoutes, ...routes] as RouteRecordRaw[],
});

setRouterRef(router);

export default router;
