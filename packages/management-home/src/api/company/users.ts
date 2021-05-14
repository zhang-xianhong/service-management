import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getUserList: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.company.GET_USER_LIST), { params: payload });

export const createUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.CREATE_USER), payload);

export const updateUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.UPDATE_USER), payload);

export const delUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.DEL_USER), payload);

export const ableUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.ABLE_USER), payload);

export const disableUser: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.company.DISABLE_USER), payload);
