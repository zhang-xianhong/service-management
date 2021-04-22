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
    path: '/tenant-management',
    redirect: '/tenant-list',
    component: Layout,
    meta: {
      isRootLevel: true,
    },
    children: [
      {
        path: 'tenant-detail',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/tenant-management/Index.vue'),
        name: 'TenantList',
        meta: {
          title: '租户管理',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
    ],
  },
  {
    path: '/project-management',
    redirect: '/project-list',
    component: Layout,
    meta: {
      isRootLevel: true,
      title: '项目管理',
      icon: 'el-icon-eleme',
    },
    children: [
      {
        path: 'project-list',
        component: () => import('@/views/project-management/ProjectList.vue'),
        name: 'ProjectList',
        meta: {
          title: '项目列表',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'project-detail/:id',
        component: () => import('@/views/project-management/ProjectDetail.vue'),
        name: 'ProjectDetail',
        meta: {
          title: '项目详情',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          hidden: true,
          activeMenu: '/project-management/project-list',
        },
        props: true,
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
        component: () => import('@/views/service-management/business-service/ServiceList.vue'),
        name: 'ServiceList',
        meta: {
          title: '业务服务',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'service-list/detail/:id',
        component: () => import('@/views/service-management/business-service/ServiceDetail.vue'),
        name: 'ServiceDetail',
        meta: {
          title: '业务服务详情',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          hidden: true,
          activeMenu: '/service-management/service-list',
        },
      },
      // {
      //   path: 'other-service',
      //   component: () => import('@/views/service-management/other-service/Index.vue'),
      //   name: 'OtherService',
      //   meta: {
      //     title: '其他服务',
      //     icon: 'el-icon-eleme',
      //     isRootLevel: false,
      //   },
      // },
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
        component: () => import(/* webpackChunkName: "classification" */ '@/views/conf-management/Classification.vue'),
        name: 'Classification',
        meta: {
          title: '分类信息',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'tag',
        component: () => import(/* webpackChunkName: "tag" */ '@/views/conf-management/Tag.vue'),
        name: 'Tag',
        meta: {
          title: '标签信息',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'datatype',
        component: () => import(/* webpackChunkName: "datatype" */ '@/views/conf-management/DataType.vue'),
        name: 'DataType',
        meta: {
          title: '数据类型',
          icon: 'el-icon-eleme',
          isRootLevel: false,
        },
      },
      {
        path: 'datatype/edit/:id',
        component: () => import(/* webpackChunkName: "datatype-edit" */ '@/views/conf-management/DataTypeEdit.vue'),
        name: 'DataTypeEdit',
        meta: {
          title: '数据类型编辑',
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
