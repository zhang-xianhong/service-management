import router, { alloverRouter, baseRoutes } from '@/router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { getToken } from '@/utils/todoToken';

import { routerLoading } from '@/layout/messageCenter/routerRef';

NProgress.configure({ showSpinner: false });

const whiteList = baseRoutes.map((x) => x.path);

router.beforeEach(async (to, from, next) => {
  console.log(to, 'to');
  NProgress.start();
  document.title = `${to.meta.title} city-base`;

  const hasToken = getToken();
  const usefulRoutes = alloverRouter();

  if (!hasToken) {
    if (to.path === '/login') {
      next();
      NProgress.done();
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        if (routerLoading.value) {
          NProgress.done();
          return next(`/login?redirect=${to.path}`);
        }
      }
      if (to.matched.length > 1 || whiteList.includes(to.path)) {
        next();
        localStorage.setItem('currentPathId', to.meta.id as any);
      } else {
        console.log(usefulRoutes, 'routes');
        const { matched } = usefulRoutes.resolve(to);
        console.log(matched);
        if (matched.length >= 1) {
          next('/no-right');
        } else {
          next('/not-found');
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
