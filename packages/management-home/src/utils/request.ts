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
    if (error.response.status === 401) {
      const redirectUrl = error.response.headers['x-sa-redirect-url'];
      redirectUrl && location.replace(redirectUrl);
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
            // window.location.href = '/login';
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
