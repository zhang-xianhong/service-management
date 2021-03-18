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
    },
  },
  {
    path: '/no-right',
    name: 'noRight',
    component: () => import('@/views/no-right/Index.vue'),
    meta: {
      isRootLevel: false,
    },
  },
  {
    path: '/not-found',
    name: 'notFound',
    component: () => import('@/views/not-found/Index.vue'),
    meta: {
      isRootLevel: false,
    },
  },
];

const routes: Array<RouteRecordRaw> = [
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
    path: '/service-management',
    redirect: '/service-list',
    component: Layout,
    meta: {
      title: '服务管理',
      icon: 'el-icon-eleme',
      isRootLevel: true,
    },
    children: [
      {
        path: 'service-list',
        component: () => import('@/views/sevice-management/business-service/ServiceList.vue'),
        name: 'ServiceList',
        meta: {
          title: '业务服务',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'other-service',
        component: () => import('@/views/sevice-management/other-service/Index.vue'),
        name: 'OtherService',
        meta: {
          title: '其他服务',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Layout,
    meta: {
      title: '配置管理',
      icon: 'el-icon-eleme',
      isRootLevel: true,
    },
    children: [
      {
        path: 'classification',
        component: () => import(/* webpackChunkName: "conf" */ '@/views/conf-management/Classification.vue'),
        name: 'Classification',
        meta: {
          title: '分类信息',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'tag',
        component: () => import(/* webpackChunkName: "conf" */ '@/views/conf-management/Tag.vue'),
        name: 'Tag',
        meta: {
          title: '标签信息',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/tenant-menagement',
    redirect: '/tenant-list',
    component: Layout,
    meta: {
      isRootLevel: true,
    },
    children: [
      {
        path: 'tenant-list',
        component: () => import(/* webpackChunkName: "conf" */ '@/views/tenant-management/Index.vue'),
        name: 'TenantList',
        meta: {
          title: '租户管理',
          icon: 'el-icon-eleme',
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
