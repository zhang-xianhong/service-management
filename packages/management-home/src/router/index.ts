import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'
import { setRouterRef } from '@/layout/messageCenter/routerRef'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
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
      component: () => import('@/views/dashboard/index.vue'),
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
    path: '/project',
    component: Layout,
    name: 'project',
    props: {
      isRouteLevel: true
    },
    meta: {
      title: '项目管理',
      icon: 'el-icon-eleme'
    },
    children: [{
      path: '/project-list',
      component: () => import('@/views/projectManagement/index.vue'),
      name: 'projectList',
      props: {
        isRouteLevel: false
      },
      meta: {
        title: '项目列表',
        icon: 'el-icon-eleme'
      }
    }, {
      path: '/add-project',
      component: () => import('@/views/projectManagement/addProject.vue'),
      name: 'addProject',
      props: {
        isRouteLevel: false,
        hidden: !true
      },
      meta: {
        title: '新增项目',
        icon: 'el-icon-eleme'
      }
    }, {
      path: '/user-list',
      component: () => import('@/views/userManagement/index.vue'),
      name: 'userList',
      props: {
        isRouteLevel: false
      },
      meta: {
        title: '用户列表',
        icon: 'el-icon-eleme'
      }
    }]
  },
  {
    path: '/home',
    name: 'Home',
    // eslint-disable-next-line
    // @ts-ignore
    component: Layout,
    meta: {
      title: 'home',
      icon: 'el-icon-eleme'
    },
    props: {
      isRouteLevel: true
    },
    children: [
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: {
          title: 'about',
          icon: 'el-icon-eleme'
        },
        props: {
          isRouteLevel: false
        }
      }, {
        path: '/hello',
        name: 'Hello',
        props: {
          hidden: !true,
          isRouteLevel: false
        },
        meta: {
          title: 'hello',
          icon: 'el-icon-eleme'
        },
        component: () => import('../views/Home.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

setRouterRef(router)

export default router
