import router, { alloverRouter, baseRoutes } from '@/router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// import { getToken } from '@/utils/todoToken';

import { currentids, routerLoading } from '@/layout/messageCenter/routerRef';

NProgress.configure({ showSpinner: false });

const whiteList = baseRoutes.map((x) => x.path);

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = `${to.meta.title} city-base`;

  // const hasToken = getToken();
  const usefulRoutes = alloverRouter();

  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (routerLoading.value) {
      NProgress.done();
      return next(`/router-loading?redirect=${to.path}`);
    }
  }
  if (to.matched.length >= 1 || whiteList.includes(to.path)) {
    next();
    localStorage.setItem('currentPathId', to.meta.id as any);
    const arr = [3, 4, 10, 11, 12, 17, 18, 19, 20, 25, 26, 27, 28];
    currentids.value = !arr.includes(Number(to?.meta?.id || 0));
    console.log(currentids.value, 'this is currentPathId-show');
  } else {
    const { matched } = usefulRoutes.resolve(to);
    if (matched.length >= 1) {
      next('/no-right');
    } else {
      next('/not-found');
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
