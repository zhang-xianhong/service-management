import { createRouter, createWebHistory, Router, RouteRecordRaw, createRouterMatcher, RouterMatcher } from 'vue-router';

import Layout from '@/layout/Index.vue';
import { setRouterRef, getPermissionRoutes } from '@/layout/messageCenter/routerRef';

export const baseRoutes: Array<RouteRecordRaw> = [
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
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index.vue'),
    meta: {
      isRootLevel: false,
      title: '登录',
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
  {
    path: '/router-loading',
    name: 'RouterLoading',
    component: () => import('@/views/router-loading/Index.vue'),
    meta: {
      isRootLevel: false,
      title: '信息获取中...',
    },
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tenant-management',
    name: 'Dashboard',
    meta: {
      isRootLevel: true,
      hidden: true,
    },
  },
  {
    path: '/tenant-management',
    redirect: '/tenant-detail',
    name: 'TenantManagement',
    component: Layout,
    meta: {
      isRootLevel: true,
      id: 2,
      hidden: false,
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
          id: 2,
          hidden: false,
        },
      },
    ],
  },
  {
    path: '/project-management',
    redirect: '/project-list',
    name: 'ProjectManagement',
    component: Layout,
    meta: {
      isRootLevel: true,
      title: '项目管理',
      icon: 'el-icon-eleme',
      id: 4,
      hidden: false,
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
          id: 4,
          hidden: false,
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
          id: 4,
        },
        props: true,
      },
    ],
  },
  {
    path: '/service-management',
    redirect: '/service-list',
    name: 'ServiceManagement',
    component: Layout,
    meta: {
      title: '服务管理',
      icon: 'el-icon-eleme',
      isRootLevel: true,
      id: 7,
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
          id: 7,
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
          id: 7,
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
      id: 8,
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
          id: 8,
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
          id: 8,
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
          id: 8,
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
          id: 8,
        },
      },
      {
        path: 'config',
        component: () => import(/* webpackChunkName: "general" */ '@/views/conf-management/Config.vue'),
        name: 'Config',
        meta: {
          title: '通用配置',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          id: 8,
        },
      },
    ],
  },
  {
    path: '/iframe-management',
    redirect: '/iframe-detail',
    name: 'IframeManagement',
    component: Layout,
    meta: {
      isRootLevel: true,
    },
    children: [
      {
        path: 'iframe-detail',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/iframe-test/Index.vue'),
        name: 'iframe',
        meta: {
          title: 'iframe传参管理',
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

export const resetRouter = (routes: Array<RouteRecordRaw>): void => {
  // router = reCreateRouter(routes);
  router.getRoutes().forEach((x: any) => {
    router.removeRoute(x.name);
  });
  routes.forEach((x) => {
    router.addRoute(x);
  });
  setRouterRef(reCreateRouter(routes));
};

export const resetPremissionRouter = () => {
  const routed = getPermissionRoutes([...routes, ...baseRoutes]);
  routed[0].redirect = routed[1].path;
  console.log(routed, 'this is all data res');
  resetRouter(routed);
  setRouterRef(router);
  console.log(router.getRoutes(), 'this is get new routers');
};

resetPremissionRouter();

export const alloverRouter = () => reCreateRouter([...baseRoutes, ...routes]);
setRouterRef(router);

export default router;
