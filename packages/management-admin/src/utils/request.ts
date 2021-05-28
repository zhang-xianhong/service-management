import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, getCookies } from '@/utils/todoToken';
import { ElMessage } from 'element-plus';
import router from '@/router';
import { useRoute } from 'vue-router';

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
    newConfig.headers[PROJECT_ID] = -1;
    if (process.env.NODE_ENV === 'development') {
      newConfig.headers[TENANT_ID] = -1;
      newConfig.headers[USER_ID] = 201;
    }
    const item = {} as any;
    item[PROJECT_ID] = -1;
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
      const route = useRoute();
      console.log(route, 'route');
      if (route?.path) {
        router.push(`/login?redirect=${route.path}`);
      } else {
        router.push('/login');
      }
    } else if (error.response.status === 422) {
      const { data } = error.response; // status
      // 错误状态处理
      ElMessage({
        message: data.message || '接口异常',
        type: 'error',
        duration: 5 * 1000,
      });
    }
  },
);

export default service;
