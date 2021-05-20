import { createRouter, createWebHistory, Router, RouteRecordRaw, createRouterMatcher, RouterMatcher } from 'vue-router';

import Layout from '@/layout/Index.vue';
import { setRouterRef, getPermissionRoutes } from '@/layout/messageCenter/routerRef';

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
    redirect: '/login',
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
        path: 'tenant-list',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/tenant-management/Index.vue'),
        name: 'TenantList',
        meta: {
          title: '租户管理',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'tenant-list/edit/:id',
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
];

export const reCreateRouter = (routes: Array<RouteRecordRaw>): Router =>
  createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });

export const reCreateRouterMatcher = (routes: Array<RouteRecordRaw>): RouterMatcher => createRouterMatcher(routes, {});

// eslint-disable-next-line
let router = reCreateRouter([...baseRoutes]);

localStorage.setItem('permissionArr', JSON.stringify(['Dashboard']));

if (localStorage.permissionArr) {
  router = reCreateRouter(getPermissionRoutes([...routes, ...baseRoutes]));
}

export const resetRouter = (routes: Array<RouteRecordRaw>): void => {
  router = reCreateRouter(routes);
  setRouterRef(router);
};

export const alloverRouter = () => reCreateRouter([...baseRoutes, ...routes]);
setRouterRef(router);

export default router;
