import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getApps: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.app.GET_APPS), { params: payload });
export const getAppDetailById: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.get(getUrl(URL.app.GET_APP_DETAIL, id));
export const createApp: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.app.CREATE_APP), payload);
export const updateAppById: (id: string, payload: any) => Promise<SuccessResponse<any>> = (id: string, payload: any) =>
  request.post(getUrl(URL.app.UPDATE_APP, id), payload);
export const deleteAppById: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.app.DELETE_APP, id));
export const validateName: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.app.DELETE_APP), payload);
