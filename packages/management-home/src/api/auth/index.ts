import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const checkHealth: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.auth.GET_HEALTH));

export const getUserInfo: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.auth.GET_USER_MESSAGE), { params: payload });

export const postCurrentProject: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.auth.POST_CURRENT_PROJECT), payload);

export const logout: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.auth.LOGOUT));

export const getCaptcha: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.auth.GET_CAPTCHA));

export const login: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.auth.LOGIN), payload);

export const getCode: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.auth.CODE));

export const verifyCaptcha: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.auth.VERIFY_CAPTCHA), payload);
