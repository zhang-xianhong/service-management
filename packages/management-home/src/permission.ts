import router, { alloverRouter } from '@/router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { getToken } from '@/utils/todoToken';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/not-found', '/no-right'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const hasToken = getToken();
  const usefulRoutes = alloverRouter();

  if (!hasToken) {
    if (to.path === '/login') {
      next('/');
      NProgress.done();
    } else {
      if (to.matched.length > 1 || whiteList.includes(to.path)) {
        next();
      } else {
        const { matched } = usefulRoutes.resolve(to);
        if (matched.length > 1) {
          next('/no-right');
        } else {
          next('/not-found');
        }
      }
      console.log('this is permission_router place todo');
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
