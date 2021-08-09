import router from '@/router';
import { reactive, ref } from 'vue';
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router';
import { userMenus } from '@/layout/messageCenter/user-info';

export const routerRef = reactive({ value: router });

export const routerLoading = ref(true);

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

export const getPermissionRoutes = function (config = getComputedRoutes() as any) {
  const route: Array<RouteRecordRaw> = [];
  const arr = Object.keys(userMenus.value);
  // const permissionArr = localStorage.permissionArr ? JSON.parse(localStorage.permissionArr) : []; // 权限
  config.forEach((item: any) => {
    let obj = Object.assign({}, item);
    // 存在meta和permission属性
    if (item?.meta?.id) {
      // 有权限
      // TODO 权限校验规则待定
      // eslint-disable-next-line no-constant-condition
      if (arr.includes(`${item.meta.id}`)) {
        obj = Object.assign({}, item);
        if (item.children && item.children.length > 0) {
          obj.children = Object.assign([], getPermissionRoutes(item.children));
        }
        if (obj.meta.node && obj.children.length === 0) {
          obj.meta.hidden = true;
        }
        // 路由为重定向路由且子集长度大于0时，修改重定向路由为第一个子路由
        if (obj.redirect && obj.children && (obj.children as Array<RouteRecordRaw>).length > 0) {
          obj.redirect =
            (obj.children as Array<RouteRecordRaw>)[0].path.indexOf(':') !== -1
              ? obj.redirect
              : (obj.children as Array<RouteRecordRaw>)[0];
        }
      } else {
        obj.redirect = '/no-right';
        // obj.meta.hidden = true;
      }
    } else {
      obj = Object.assign({}, item);
      if (item.children && item.children.length > 0) {
        obj.children = Object.assign([], getPermissionRoutes(item.children));
      }
      // 路由为重定向路由且子集长度大于0时，修改重定向路由为第一个子路由
      if (obj.redirect && obj.children && (obj.children as Array<RouteRecordRaw>).length > 0) {
        obj.redirect =
          (obj.children as Array<RouteRecordRaw>)[0].path.indexOf(':') !== -1
            ? obj.redirect
            : (obj.children as Array<RouteRecordRaw>)[0];
      }
    }
    if (Object.keys(obj).length > 0 && obj.redirect !== '/no-right') {
      route.push(obj);
    }
  });
  // route[0].redirect = route[1] ? route[1].path : '/no-right';
  return route;
};
