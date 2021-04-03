import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getTenantList: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.tenant.GET_TENANT_LIST), { params: payload });

export const getTenantDetail: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.get(getUrl(URL.tenant.GET_TENANT_DETAIL, id));

export const deleteTenant: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.tenant.DELETE_TENANT, id));

export const freezeTenant: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.tenant.FREEZE_TENANT, id));

export const enableTenant: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.tenant.ENABLE_TENANT, id));
