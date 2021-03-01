import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, removeToken } from '@/utils/todoToken';
import { ElMessage } from 'element-plus';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

const TOKEN = 'token';

service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const newConfig = { ...config };
    if (getToken()) {
      newConfig.headers[TOKEN] = getToken();
    }
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
    const { data, status } = error.response;
    // 登录失效处理
    if (status === 401) {
      ElMessage({
        message: '登录状态失效，请重新登录',
        type: 'error',
        duration: 5 * 1000,
        onClose() {
          removeToken();
          window.location.href = '/login';
        },
      });
    } else {
      return Promise.reject(data);
    }
  },
);

export default service;
