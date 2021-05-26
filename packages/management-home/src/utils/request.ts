import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, removeToken, getCookies } from '@/utils/todoToken';
import { ElMessage } from 'element-plus';
import router, { baseRoutes } from '@/router';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

const TOKEN = 'token';
const PROJECT_ID = 'x-sa-project-id';
const TENANT_ID = 'x-sa-tenant-id';
const USER_ID = 'x-sa-user-id';

service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const newConfig = { ...config };
    if (getToken()) {
      newConfig.headers[TOKEN] = getToken();
    }
    newConfig.headers[PROJECT_ID] = localStorage.getItem('projectId') || '';
    if (process.env.NODE_ENV === 'development') {
      newConfig.headers[TENANT_ID] = 1;
      newConfig.headers[USER_ID] = 83;
    }
    const item = {} as any;
    item[PROJECT_ID] = localStorage.getItem('projectId') || '';
    item.Cookie = getCookies();
    localStorage.setItem('HEADERS', JSON.stringify([item]));
    return newConfig;
  },
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    // 如果没有error.response返回，则当做服务器异常处理
    if (!error.response) {
      ElMessage({
        message: error || '服务异常，请稍后处理',
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      let currentPath = router?.currentRoute?.value?.fullPath || '/';
      const whiteList = baseRoutes.map((x) => x.path);
      if (whiteList.includes(currentPath)) {
        currentPath = '/';
      }
      router.push(`/login?redirect=${currentPath}`);
    }
    if (error.response.status === 403) {
      ElMessage.error('暂无此权限，请联系管理员添加权限');
    }
    const { data } = error.response; // status
    const { httpStatus, message } = data;
    // 错误状态处理
    if (httpStatus) {
      ElMessage({
        message,
        type: 'error',
        duration: 5 * 1000,
        onClose() {
          // 登录失效处理
          if (httpStatus === 401) {
            removeToken();
            location.reload();
          }
        },
      });
    } else {
      return Promise.reject(data);
    }
  },
);

export default service;
