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

export const createTenant: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.tenant.CREATE_TENANT), payload);

export const updateTenant: (id: string, payload: any) => Promise<SuccessResponse<any>> = (id: string, payload: any) =>
  request.post(getUrl(URL.tenant.UPDATE_TENT, id), payload);

export const validateCompanyName: (name: string) => Promise<SuccessResponse<any>> = (name: string) =>
  request.post(getUrl(URL.tenant.VALIDATE_NAME), { name });

export const validateLicense: (license: string) => Promise<SuccessResponse<any>> = (license: string) =>
  request.post(getUrl(URL.tenant.VALIDATE_LICENSE), { license });

export const validateEngAbbr: (engAbbr: string) => Promise<SuccessResponse<any>> = (engAbbr: string) =>
  request.post(getUrl(URL.tenant.VALIDATE_ENGABBR), { engAbbr });

export const validateAccount: (account: string) => Promise<SuccessResponse<any>> = (account: string) =>
  request.post(getUrl(URL.tenant.VALIDATE_ENGABBR), { account });
