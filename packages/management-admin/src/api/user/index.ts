import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getUserInfo: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.user.GET_USER_INFO), { params: payload });

export const updateUserInfo: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.user.UPDATE_USER_INFO, payload));

export const getProfile: () => Promise<SuccessResponse<any>> = () => request.get(getUrl(URL.user.GET_PROFILE));

export const updateProfile: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.user.UPDATE_PROFILE), payload);

export const updateProfilePassword: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.user.UPDATE_PROFILE_PASSWORD), payload);
