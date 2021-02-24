import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/Index.vue'
import { setRouterRef } from '@/layout/messageCenter/routerRef'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index.vue'),
    props: {
      isRouteLevel: false
    }
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    props: {
      isRouteLevel: true
    },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/Index.vue'),
      name: 'Dashboard',
      meta: {
        title: '首页',
        icon: 'el-icon-eleme'
      },
      props: {
        isRouteLevel: false
      }
    }]
  },
  {
    path: '/serve',
    name: 'Server',
    component: Layout,
    meta: {
      title: '服务管理',
      icon: 'el-icon-eleme'
    },
    props: {
      isRouteLevel: true
    },
    children: [
      {
        path: '/business-server',
        name: 'BusinessServer',
        component: () => import(/* webpackChunkName: "business-server" */ '../views/servers/BusinessServer.vue'),
        meta: {
          title: '业务服务',
          icon: 'el-icon-eleme'
        },
        props: {
          isRouteLevel: false
        }
      },
      {
        path: '/business-server',
        name: 'BusinessServer',
        component: () => import(/* webpackChunkName: "business-server" */ '../views/servers/BusinessServer.vue'),
        meta: {
          title: '其他服务',
          icon: 'el-icon-eleme'
        },
        props: {
          isRouteLevel: false
        }
      }
    ]
  },
  {
    path: '/schema',
    name: 'Schema',
    redirect: '/data-object',
    component: Layout,
    props: {
      isRouteLevel: true
    },
    meta: {
      title: '数据建模',
      icon: 'el-icon-eleme'
    },
    children: [{
      path: 'data-object',
      component: () => import('@/views/schema/data-object/Index.vue'),
      name: 'DataObject',
      meta: {
        title: '数据对象',
        icon: 'el-icon-eleme'
      },
      props: {
        isRouteLevel: false
      }
    }]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

setRouterRef(router)

export default router
