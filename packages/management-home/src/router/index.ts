import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'
import { setRouterRef } from '@/layout/messageCenter/routerRef'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    // eslint-disable-next-line
    // @ts-ignore
    component: Layout,
    props: {
      isRouteLevel: true
    },
    children: [
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
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
