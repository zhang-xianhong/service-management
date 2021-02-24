import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken, removeToken } from '@/utils/todoToken';

import { ElMessage, ElMessageBox } from 'element-plus';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

const TOKEN = 'token';

service.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (getToken()) {
      config.headers[TOKEN] = getToken();
    }
    return config;
  },
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    if (response.status !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
      // TODO 状态码同步
      if (response.status === 401) {
        ElMessageBox.confirm('登录状态失效，请重新登录！', '登录状态提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          removeToken();
          location.reload();
        })
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    ElMessage({
      message: error || 'Error',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
