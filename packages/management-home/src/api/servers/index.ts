import request from '@/utils/request';
import URL from '@/shared/constant/url';
import { getUrl } from '../utils';
import { SuccessResponse } from '@/types/response';

export const addService: (payload: object) => Promise<SuccessResponse<any>> = (payload: object) =>
  request.post(getUrl(URL.service.ADD_SERVICE), payload);

export const updateService: (id: string, payload: object) => Promise<SuccessResponse<any>> = (
  id: string,
  payload: object,
) => request.post(getUrl(URL.service.UPDATE_SERVICE, id), payload);

export const getServiceById: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_BY_ID, payload.id));

export const getServiceList: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.GET_SERVICE_LIST), { params: payload });

export const deleteService: (id: string) => Promise<SuccessResponse<any>> = (id: string) =>
  request.post(getUrl(URL.service.DELETE_SERVICR, id));

export const buildService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.post(getUrl(URL.service.BUILD_SERVICE), payload, { timeout: 60000 });

export const initService: (payload: object) => Promise<SuccessResponse<any>> = (payload: any) =>
  request.get(getUrl(URL.service.INIT_SERVICE, payload.serviceId), { timeout: 60000 });
