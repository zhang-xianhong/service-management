import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const getTenantList: (payload?: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.tenant.GET_TENANT_LIST), { params: payload });

export const getTenantDepartment = (payload?: object): Promise<SuccessResponse<any>> =>
  request.get(getUrl(URL.tenant.GET_TENANT_DEPT), { params: payload });

export const getTenantDetail: () => Promise<SuccessResponse<any>> = () =>
  request.get(getUrl(URL.tenant.GET_TENANT_DETAIL));

export const updateTenant: (payload: any) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.tenant.UPDATE_TENANT), payload);

export const queryInTenant = (payload: any): Promise<SuccessResponse<any>> =>
  request.get(getUrl(URL.tenant.QUERY_IN_TENT), { params: payload });

// 发送验证码
export const sendRetrievePasswordVerifyCode = (payload: any): Promise<SuccessResponse<any>> =>
  request.get(getUrl(URL.tenant.SEND_RETRIEVE_PASSWD_VERIFY_CODE), { params: payload });

// 找回密码
export const retrievePassword = (payload: any): Promise<SuccessResponse<any>> =>
  request.post(getUrl(URL.tenant.RETRIEVE_PASSWD), payload);
