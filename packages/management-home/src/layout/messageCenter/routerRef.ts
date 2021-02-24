import router from '@/router';
import { reactive } from 'vue';
import { RouteRecordNormalized } from 'vue-router';

const routerRef = reactive({ value: router });

export const getRouterRef = () => routerRef;

export const setRouterRef = (res: any) => {
  routerRef.value = res;
};

export const getComputedRoutes = () =>
  routerRef.value
    .getRoutes()
    .map((x): undefined | RouteRecordNormalized => {
      const data = x?.props.default as {
        isRouteLevel: boolean;
      };
      if (data.isRouteLevel) {
        return x;
      }
      return undefined;
    })
    .filter((x) => x);
