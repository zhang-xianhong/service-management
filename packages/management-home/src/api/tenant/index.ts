import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getTenantList: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.tenant.GET_TENANT_LIST), { params: payload });

export const getTenentDepartment = (payload?: object): Promise<SuccessResponse<any>> =>
  request.get(getUrl(URL.tenant.GET_TENANT_DEPT), { params: payload });
export const getTenantDetail: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.get(getUrl(URL.tenant.GET_TENANT_DETAIL, id));

export const updateTenant: (id: string, payload: any) => Promise<SuccessResponse<any>> = (id: string, payload: any) =>
  request.post(getUrl(URL.tenant.UPDATE_TENT, id), payload);
