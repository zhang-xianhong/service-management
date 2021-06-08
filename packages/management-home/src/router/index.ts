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
  {
    path: '/reset-password',
    component: () => import('@/views/login/ResetPassword.vue'),
    name: 'resetPassword',
    meta: {
      title: '重置密码',
      icon: 'el-icon-eleme',
      isRootLevel: true,
      hidden: true,
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
      id: 10,
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
          id: 10,
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
      node: true,
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
          id: 13,
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
          id: 21,
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
      id: 16,
      node: true,
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
          id: 16,
          hidden: false,
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
          id: 16,
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
    path: '/application',
    name: 'ApplicationManagement',
    redirect: '/application-list',
    component: Layout,
    meta: {
      title: '应用编排',
      icon: 'el-icon-eleme',
      isRootLevel: true,
      id: 22,
      node: true,
    },
    children: [
      {
        path: 'application-list',
        component: () => import(/* webpackChunkName: "classification" */ '@/views/application-management/Index.vue'),
        name: 'ApplicationList',
        meta: {
          title: '应用列表',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          id: 23,
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
      id: 8,
      node: true,
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
          id: 17,
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
          id: 18,
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
          id: 19,
        },
      },
      {
        path: 'datatype/edit/:id',
        component: () => import(/* webpackChunkName: "datatype-edit" */ '@/views/conf-management/DataTypeEdit.vue'),
        name: 'DataTypeEdit',
        meta: {
          title: '新增数据类型',
          icon: 'el-icon-eleme',
          hidden: true,
          isRootLevel: false,
          id: 19,
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
          id: 20,
        },
      },
    ],
  },
  // {
  //   path: '/iframe-management',
  //   redirect: '/iframe-detail',
  //   name: 'IframeManagement',
  //   component: Layout,
  //   meta: {
  //     isRootLevel: true,
  //     hidden: true,
  //   },
  //   children: [
  //     {
  //       path: 'iframe-detail',
  //       component: () => import(/* webpackChunkName: "tenant" */ '@/views/iframe-test/Index.vue'),
  //       name: 'iframe',
  //       meta: {
  //         title: 'iframe传参管理',
  //         icon: 'el-icon-eleme',
  //         isRootLevel: false,
  //         id: 12345,
  //       },
  //     },
  //   ],
  // },
  {
    path: '/company-manage',
    name: 'Company',
    component: Layout,
    meta: {
      title: '公司管理',
      icon: 'el-icon-eleme',
      isRootLevel: true,
      id: 3,
      node: true,
    },
    children: [
      {
        path: 'person',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/company-manage/Person.vue'),
        name: 'Person',
        meta: {
          title: '人员管理',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          id: 11,
        },
      },
      {
        path: 'department',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/company-manage/Department.vue'),
        name: 'Department',
        meta: {
          title: '部门管理',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          id: 12,
        },
      },
    ],
  },
  {
    path: '/publish',
    name: 'Publish',
    component: Layout,
    meta: {
      title: '发布管理',
      icon: 'el-icon-eleme',
      isRootLevel: true,
      id: 6,
      node: true,
    },
    children: [
      {
        path: 'apply',
        component: () => import(/* webpackChunkName: "general" */ '@/views/demands/publish/Apply.vue'),
        name: 'PublishApply',
        meta: {
          title: '发布申请',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          id: 14,
        },
      },
      {
        path: 'review',
        component: () => import(/* webpackChunkName: "general" */ '@/views/demands/publish/Review.vue'),
        name: 'PublishReview',
        meta: {
          title: '发布审核',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          id: 15,
        },
      },
    ],
  },
  {
    path: '/user-management',
    redirect: '/user-center',
    name: 'UserManagement',
    component: Layout,
    meta: {
      isRootLevel: true,
      hidden: true,
      node: true,
    },
    children: [
      {
        path: 'user-detail',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/user-management/Index.vue'),
        name: 'UserCenter',
        meta: {
          title: '个人中心',
          icon: 'el-icon-eleme',
          isRootLevel: false,
          hidden: true,
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
  resetRouter(routed);
  setRouterRef(router);
};

resetPremissionRouter();

export const alloverRouter = () => reCreateRouter([...baseRoutes, ...routes]);
setRouterRef(router);

export default router;
