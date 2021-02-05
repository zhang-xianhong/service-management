import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    // eslint-disable-next-line
    // @ts-ignore
    component: Layout,
    children: [
      {
        path: '/about',
        name: 'About',
        // hidden: true,
        component: () => import('../views/About.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
