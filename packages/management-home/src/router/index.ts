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
      id: 2,
      hidden: false,
      title: '租户管理',
    },
    children: [
      {
        path: 'tenant-detail',
        component: () => import(/* webpackChunkName: "tenant" */ '@/views/tenant-management/Index.vue'),
        name: 'TenantDetail',
        meta: {
          title: '租户详情',
          icon: 'tenant',
          isRootLevel: false,
          id: 10,
          hidden: false,
        },
      },
    ],
  },
  {
    path: '/company-manage',
    name: 'Company',
    component: Layout,
    meta: {
      title: '公司管理',
      icon: 'compony',
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
          isRootLevel: false,
          id: 12,
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
      icon: 'project-list',
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
          icon: 'project-list',
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
          isRootLevel: false,
          hidden: true,
          activeMenu: '/project-management/project-list',
          id: 4,
          showBackButton: true,
        },
        props: true,
      },
    ],
  },

  {
    path: '/publish',
    name: 'Publish',
    component: Layout,
    meta: {
      title: '部署管理',
      icon: 'publish',
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
          title: '部署申请',
          isRootLevel: false,
          id: 14,
        },
      },
      {
        path: 'review',
        component: () => import(/* webpackChunkName: "general" */ '@/views/demands/publish/Review.vue'),
        name: 'PublishReview',
        meta: {
          title: '部署审核',
          isRootLevel: false,
          id: 15,
        },
      },
    ],
  },
  {
    path: '/deploy',
    name: 'Deploy',
    component: Layout,
    meta: {
      title: '发布管理',
      isRootLevel: true,
      icon: 'publish',
      hidden: false,
      id: 29,
      node: true,
    },
    children: [
      {
        path: 'apply',
        component: () => import('@/views/deploy/Apply.vue'),
        name: 'DeployApply',
        meta: {
          title: '发布申请',
          isRootLevel: false,
          id: 30,
        },
      },
      {
        path: 'review',
        component: () => import('@/views/deploy/Review.vue'),
        name: 'DeployReview',
        meta: {
          title: '发布审核',
          isRootLevel: false,
          id: 31,
        },
      },
      {
        path: 'detail/:id',
        component: () =>
          import(/* webpackChunkName: "repository-detail" */ '@/views/service-repository/detail/Index.vue'),
        name: 'RepositoryDetail',
        meta: {
          title: '服务详情',
          isRootLevel: false,
          hidden: true,
          showBackButton: true,
          activeMenu: '/deploy',
          id: 32,
        },
      },
    ],
  },
  {
    path: '/service-management',
    redirect: '/service-list',
    name: 'ServiceManagement',
    component: Layout,
    meta: {
      title: '服务建模',
      icon: 'service',
      isRootLevel: true,
      id: 7,
      node: true,
    },
    children: [
      {
        path: 'service-list',
        component: () => import('@/views/service-management/business-service/ServiceList.vue'),
        name: 'ServiceList',
        meta: {
          title: '业务服务',
          isRootLevel: false,
          id: 7,
          hidden: false,
        },
      },

      {
        path: 'iot-list',
        component: () => import('@/views/service-management/iot/Index.vue'),
        name: 'IotServiceList',
        meta: {
          title: 'IOT服务',
          isRootLevel: false,
          hidden: false,
        },
      },
      {
        path: ':serviceId/interface/:apiId/params',
        component: () => import('@/views/service-management/api-params/ParamList.vue'),
        name: 'ServiceApiParamList',
        meta: {
          title: '接口参数',
          isRootLevel: false,
          hidden: true,
          showBackButton: true,
        },
      },
      {
        path: 'service-list/detail/:id',
        // component: () => import('@/views/service-management/business-service/ServiceDetail.vue'),
        component: () =>
          import(/* webpackChunkName: "repository-detail" */ '@/views/service-repository/detail/Index.vue'),
        name: 'ServiceDetail',
        meta: {
          title: '业务服务详情',
          isRootLevel: false,
          hidden: true,
          activeMenu: '/service-management/service-list',
          showBackButton: true,
          id: 7,
        },
      },
      {
        path: 'service-list/edit/:id',
        component: () => import('@/views/service-management/business-service/ServiceDetail.vue'),
        name: 'ServiceEdit',
        meta: {
          title: '服务详情',
          isRootLevel: false,
          hidden: true,
          // 回退路由
          activeMenu: '/service-management/service-list',
          showBackButton: true,
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
    path: '/application',
    name: 'ApplicationManagement',
    redirect: '/application-list',
    component: Layout,
    meta: {
      title: '应用编排',
      icon: 'application',
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
          isRootLevel: false,
          id: 23,
        },
      },
      {
        path: 'application-detail',
        component: () =>
          import(/* webpackChunkName: "classification" */ '@/views/application-management/IframeDiv.vue'),
        name: 'ApplicationDetail',
        meta: {
          title: '应用详情',
          isRootLevel: false,
          id: 23,
          hidden: true,
          activeMenu: '/application/application-list',
          showBackButton: true,
        },
      },
    ],
  },
  {
    path: '/service-repository',
    name: '服务仓库',
    component: Layout,
    redirect: 'platform',
    meta: {
      title: '服务仓库',
      icon: 'service-repository',
      isRootLevel: true,
      hidden: false,
      node: true,
      id: 24,
    },
    children: [
      {
        path: 'platform',
        component: () => import('@/views/service-repository/platform/Index.vue'),
        name: 'PublicRepositoryList',
        children: [],
        meta: {
          title: '平台仓库',
          isRootLevel: false,
          hidden: false,
          id: 25,
        },
      },
      {
        path: 'platform/:id',
        component: () =>
          import(/* webpackChunkName: "repository-detail" */ '@/views/service-repository/detail/Index.vue'),
        name: 'RepositoryPlatformDetail',
        meta: {
          title: '服务详情',
          isRootLevel: false,
          hidden: true,
          activeMenu: '/service-repository/platform',
          showBackButton: true,
          id: 25,
        },
      },
      {
        path: 'tenant',
        component: () => import('@/views/service-repository/tenant/Index.vue'),
        name: 'TenantRepositoryList',
        redirect: 'shared',
        children: [
          {
            path: 'shared',
            component: () => import('@/views/service-repository/tenant/Shared.vue'),
            name: 'SharedList',
            children: [],
            meta: {
              title: '服务共享',
              isRootLevel: false,
              hidden: false,
              id: 27,
            },
          },
          {
            path: 'distribute',
            component: () => import('@/views/service-repository/tenant/Distribute.vue'),
            name: 'DistributeList',
            children: [],
            meta: {
              title: '服务下发',
              isRootLevel: false,
              hidden: false,
              id: 28,
            },
          },
        ],
        meta: {
          title: '租户仓库',
          isRootLevel: false,
          hidden: false,
          id: 26,
        },
      },
      {
        path: 'tenant/shared/:id',
        component: () =>
          import(/* webpackChunkName: "repository-detail" */ '@/views/service-repository/detail/Index.vue'),
        name: 'RepositoryTenantSharedDetail',
        meta: {
          title: '服务详情',
          isRootLevel: false,
          hidden: true,
          activeMenu: '/service-repository/tenant/shared',
          showBackButton: true,
          id: 27,
        },
      },
      {
        path: 'tenant/distribute/:id',
        component: () =>
          import(/* webpackChunkName: "repository-detail" */ '@/views/service-repository/detail/Index.vue'),
        name: 'RepositoryTenantDistributeDetail',
        meta: {
          title: '服务详情',
          isRootLevel: false,
          hidden: true,
          activeMenu: '/service-repository/tenant/distribute',
          showBackButton: true,
          id: 28,
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
      icon: 'config',
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
          title: '分类配置',
          isRootLevel: false,
          id: 17,
        },
      },
      {
        path: 'tag',
        component: () => import(/* webpackChunkName: "tag" */ '@/views/conf-management/Tag.vue'),
        name: 'Tag',
        meta: {
          title: '标签配置',
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
          isRootLevel: false,
          id: 19,
        },
      },
      {
        path: 'datatype/addedit',
        component: () => import(/* webpackChunkName: "datatype-edit" */ '@/views/conf-management/DataTypeEdit.vue'),
        name: 'DataTypeAddEdit',
        meta: {
          title: '新建数据类型',
          hidden: true,
          isRootLevel: false,
          id: 19,
        },
      },
      {
        path: 'datatype/edit/:id',
        component: () => import(/* webpackChunkName: "datatype-edit" */ '@/views/conf-management/DataTypeEdit.vue'),
        name: 'DataTypeEdit',
        meta: {
          title: '编辑数据类型',
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
  // {
  //   path: '/dto-dev',
  //   name: 'dto-dev',
  //   component: () => import('@/views/service-management/dto/Index.vue'),
  //   meta: {
  //     isRootLevel: true,
  //     title: '没有权限',
  //   },
  // },
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
