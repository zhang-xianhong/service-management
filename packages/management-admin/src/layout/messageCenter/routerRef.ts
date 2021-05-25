import router from '@/router';
import { reactive } from 'vue';
import { RouteRecordNormalized } from 'vue-router';

const routerRef = reactive({ value: router });

console.log(routerRef.value, 'router1');

export const getRouterRef = () => routerRef;

export const setRouterRef = (res: any) => {
  routerRef.value = res;
};

export const getComputedRoutes = () =>
  routerRef.value
    .getRoutes()
    .map((x: any): undefined | RouteRecordNormalized => {
      const data = x?.meta as {
        isRootLevel: boolean;
      };
      if (data.isRootLevel) {
        return x;
      }
      return undefined;
    })
    .filter((x: any) => x);
